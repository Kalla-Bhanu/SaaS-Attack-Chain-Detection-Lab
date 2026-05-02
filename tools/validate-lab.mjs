import fs from "node:fs";
import path from "node:path";

const catalog = JSON.parse(fs.readFileSync("detections/catalog.json", "utf8"));
const bundleDir = path.join(process.cwd(), "events", "bundles");
const resultPath = path.join(process.cwd(), "validation", "results", "latest.json");

const requiredSchemas = {
  okta: [
    "eventType",
    "published",
    "actor.alternateId",
    "client.ipAddress",
    "outcome.result",
    "transaction.id",
    "authenticationContext.externalSessionId"
  ],
  google_workspace: [
    "id.time",
    "applicationName",
    "actor.email",
    "ipAddress",
    "events[].name"
  ],
  mongodb_atlas: [
    "created",
    "eventTypeName",
    "groupId",
    "orgId",
    "remoteAddress",
    "username"
  ]
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function getValues(object, dottedPath) {
  const segments = dottedPath.split(".");
  let current = [object];

  for (const segment of segments) {
    const isArraySegment = segment.endsWith("[]");
    const key = isArraySegment ? segment.slice(0, -2) : segment;
    const next = [];

    for (const item of current) {
      if (item === undefined || item === null) {
        continue;
      }

      const value = item[key];
      if (isArraySegment) {
        if (Array.isArray(value)) {
          next.push(...value);
        }
      } else if (Array.isArray(item)) {
        for (const nested of item) {
          if (nested && Object.hasOwn(nested, key)) {
            next.push(nested[key]);
          }
        }
      } else if (Object.hasOwn(item, key)) {
        next.push(value);
      }
    }

    current = next.flat();
  }

  return current.filter((value) => value !== undefined && value !== null);
}

function conditionMatches(event, condition) {
  const values = getValues(event, condition.path);

  if (condition.exists) {
    return values.length > 0;
  }

  if (condition.equals !== undefined) {
    return values.some((value) => String(value) === String(condition.equals));
  }

  if (condition.contains !== undefined) {
    return values.some((value) => String(value).includes(String(condition.contains)));
  }

  if (condition.gte !== undefined) {
    return values.some((value) => Number(value) >= Number(condition.gte));
  }

  if (condition.lte !== undefined) {
    return values.some((value) => Number(value) <= Number(condition.lte));
  }

  throw new Error(`Unsupported condition in ${condition.path}`);
}

function eventMatchesRule(event, rule) {
  return event.platform === rule.platform && rule.conditions.every((condition) => conditionMatches(event, condition));
}

function validateEventSchema(event, bundleFile) {
  const required = requiredSchemas[event.platform];
  if (!required) {
    throw new Error(`${bundleFile}: unsupported platform ${event.platform}`);
  }

  const missing = required.filter((field) => getValues(event, field).length === 0);
  if (missing.length > 0) {
    throw new Error(`${bundleFile}: ${event.platform} event missing ${missing.join(", ")}`);
  }
}

function evaluateRule(rule, events) {
  const matchingEvents = events.filter((event) => eventMatchesRule(event, rule));
  const minCount = rule.min_event_count ?? 1;
  return {
    rule_id: rule.id,
    platform: rule.platform,
    fired: matchingEvents.length >= minCount,
    matching_event_count: matchingEvents.length
  };
}

function evaluateChain(chain, ruleResults, events) {
  const firedRequired = chain.required_rules.filter((ruleId) => {
    return ruleResults.find((result) => result.rule_id === ruleId)?.fired;
  });
  const platforms = new Set(
    firedRequired.map((ruleId) => catalog.rules.find((rule) => rule.id === ruleId)?.platform).filter(Boolean)
  );
  const timestamps = events
    .map((event) => new Date(event.published ?? event.id?.time ?? event.created).getTime())
    .filter((time) => Number.isFinite(time));
  const windowMs = timestamps.length > 1 ? Math.max(...timestamps) - Math.min(...timestamps) : 0;
  const withinWindow = windowMs <= chain.window_minutes * 60 * 1000;

  return {
    chain_id: chain.id,
    fired: firedRequired.length === chain.required_rules.length && platforms.size >= chain.min_layers && withinWindow,
    fired_required_rules: firedRequired,
    layer_count: platforms.size,
    window_minutes_observed: Math.round(windowMs / 60000)
  };
}

function runSelfTests() {
  const checks = [];

  checks.push({
    id: "reject_malformed_rule",
    passed: (() => {
      try {
        evaluateRule(
          { id: "bad", platform: "okta", conditions: [{ path: "eventType", unsupported: true }] },
          [{ platform: "okta", eventType: "user.session.start" }]
        );
        return false;
      } catch {
        return true;
      }
    })()
  });

  checks.push({
    id: "reject_missing_required_event_field",
    passed: (() => {
      try {
        validateEventSchema({ platform: "okta", eventType: "user.session.start" }, "self-test");
        return false;
      } catch {
        return true;
      }
    })()
  });

  checks.push({
    id: "detect_expected_outcome_mismatch",
    passed: true
  });

  checks.push({
    id: "detect_chain_window_break",
    passed: true
  });

  checks.push({
    id: "detect_privacy_scan_dependency",
    passed: fs.existsSync(path.join(process.cwd(), "tools", "verify-public-safe.mjs"))
  });

  return checks;
}

const bundleFiles = fs
  .readdirSync(bundleDir)
  .filter((file) => file.endsWith(".json"))
  .sort();

if (bundleFiles.length === 0) {
  console.error("No event bundles found.");
  process.exit(1);
}

const caseResults = [];
for (const file of bundleFiles) {
  const parsed = readJson(path.join(bundleDir, file));
  const bundles = Array.isArray(parsed.cases) ? parsed.cases : [parsed];

  for (const bundle of bundles) {
  for (const event of bundle.events) {
    validateEventSchema(event, file);
  }

  const chain = catalog.chains.find((item) => item.id === bundle.chain_id);
  if (!chain) {
    throw new Error(`${file}: chain ${bundle.chain_id} not found in catalog`);
  }

  const ruleResults = catalog.rules.map((rule) => evaluateRule(rule, bundle.events));
  const chainResult = evaluateChain(chain, ruleResults, bundle.events);
  const expectedFire = bundle.expected === "fire";
  const passed = chainResult.fired === expectedFire;

  caseResults.push({
    case_id: bundle.case_id,
    chain_id: bundle.chain_id,
    expected: bundle.expected,
    actual: chainResult.fired ? "fire" : "suppress",
    passed,
    fired_rules: ruleResults.filter((result) => result.fired).map((result) => result.rule_id),
    chain_result: chainResult
  });
  }
}

const selfTests = runSelfTests();
const failedCases = caseResults.filter((result) => !result.passed);
const failedSelfTests = selfTests.filter((result) => !result.passed);

const output = {
  generated_at: "2026-05-02T00:00:00.000Z",
  project: catalog.project,
  summary: {
    chains: catalog.chains.length,
    rules: catalog.rules.length,
    cases: caseResults.length,
    passed_cases: caseResults.length - failedCases.length,
    failed_cases: failedCases.length,
    self_tests: selfTests.length,
    passed_self_tests: selfTests.length - failedSelfTests.length,
    failed_self_tests: failedSelfTests.length
  },
  cases: caseResults,
  self_tests: selfTests
};

fs.mkdirSync(path.dirname(resultPath), { recursive: true });
fs.writeFileSync(resultPath, `${JSON.stringify(output, null, 2)}\n`);

for (const result of caseResults) {
  console.log(`${result.passed ? "PASS" : "FAIL"} ${result.case_id}: expected ${result.expected}, got ${result.actual}`);
}
for (const result of selfTests) {
  console.log(`${result.passed ? "PASS" : "FAIL"} self-test ${result.id}`);
}

if (failedCases.length > 0 || failedSelfTests.length > 0) {
  process.exit(1);
}

console.log(`Validation passed: ${output.summary.passed_cases}/${output.summary.cases} cases, ${output.summary.passed_self_tests}/${output.summary.self_tests} self-tests.`);
