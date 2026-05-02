import fs from "node:fs";

if (!fs.existsSync("release-manifest.json")) {
  console.error("release-manifest.json is missing.");
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync("release-manifest.json", "utf8"));
const catalog = JSON.parse(fs.readFileSync("detections/catalog.json", "utf8"));
const results = JSON.parse(fs.readFileSync("validation/results/latest.json", "utf8"));
const evidence = JSON.parse(fs.readFileSync("evidence/catalog.json", "utf8"));

const detectionTypes = new Set(catalog.rules.map((rule) => rule.detection_type).filter(Boolean));
const capturedEvidence = evidence.evidence.filter((item) => item.status === "captured").length;
const blockedEvidence = evidence.evidence.filter((item) => item.status === "blocked_by_privilege").length;
const threeLayerChains = catalog.chains.filter((chain) => {
  const platforms = new Set(
    chain.required_rules
      .map((ruleId) => catalog.rules.find((rule) => rule.id === ruleId)?.platform)
      .filter(Boolean)
  );
  return platforms.size === 3;
}).length;

const checks = [
  ["chains", manifest.counts.chains, catalog.chains.length],
  ["rules", manifest.counts.rules, catalog.rules.length],
  ["detection_types", manifest.counts.detection_types, detectionTypes.size],
  ["three_layer_chains", manifest.counts.three_layer_chains, threeLayerChains],
  ["validation_cases", manifest.counts.validation_cases, results.summary.cases],
  ["self_tests", manifest.counts.self_tests, results.summary.self_tests],
  ["evidence_items", manifest.counts.evidence_items, evidence.evidence.length],
  ["captured_evidence_items", manifest.counts.captured_evidence_items, capturedEvidence],
  ["documented_evidence_blockers", manifest.counts.documented_evidence_blockers, blockedEvidence]
];

const failures = checks.filter(([, actual, expected]) => actual !== expected);
if (failures.length > 0) {
  for (const [name, actual, expected] of failures) {
    console.error(`Manifest count mismatch for ${name}: expected ${expected}, got ${actual}`);
  }
  process.exit(1);
}

console.log("Release manifest verification passed.");
