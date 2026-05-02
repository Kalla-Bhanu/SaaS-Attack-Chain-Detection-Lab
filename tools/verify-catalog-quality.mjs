import fs from "node:fs";

const catalog = JSON.parse(fs.readFileSync("detections/catalog.json", "utf8"));
const expectedPlatforms = {
  okta: 8,
  google_workspace: 5,
  mongodb_atlas: 3
};

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!Array.isArray(catalog.rules) || !Array.isArray(catalog.chains)) {
  fail("Detection catalog must include rules and chains arrays.");
}

const ruleIds = new Set();
const platformCounts = {};
const detectionTypes = new Set();

for (const rule of catalog.rules) {
  for (const field of ["id", "platform", "detection_type", "sigma", "description"]) {
    if (!rule[field]) {
      fail(`Rule is missing ${field}: ${JSON.stringify(rule)}`);
    }
  }
  if (ruleIds.has(rule.id)) {
    fail(`Duplicate rule id: ${rule.id}`);
  }
  if (!fs.existsSync(rule.sigma)) {
    fail(`Sigma rule file missing for ${rule.id}: ${rule.sigma}`);
  }
  if (!Array.isArray(rule.conditions) || rule.conditions.length === 0) {
    fail(`Rule has no conditions: ${rule.id}`);
  }
  ruleIds.add(rule.id);
  detectionTypes.add(rule.detection_type);
  platformCounts[rule.platform] = (platformCounts[rule.platform] ?? 0) + 1;
}

for (const [platform, expected] of Object.entries(expectedPlatforms)) {
  if (platformCounts[platform] !== expected) {
    fail(`Expected ${expected} ${platform} rules, found ${platformCounts[platform] ?? 0}.`);
  }
}

if (detectionTypes.size < 8) {
  fail(`Expected at least 8 distinct detection pattern types, found ${detectionTypes.size}.`);
}

const chainIds = new Set();
let threeLayerChains = 0;

for (const chain of catalog.chains) {
  for (const field of ["id", "title", "required_rules", "min_layers", "window_minutes"]) {
    if (!Object.hasOwn(chain, field)) {
      fail(`Chain is missing ${field}: ${JSON.stringify(chain)}`);
    }
  }
  if (chainIds.has(chain.id)) {
    fail(`Duplicate chain id: ${chain.id}`);
  }
  if (chain.required_rules.length < 3) {
    fail(`Chain must require at least three rule signals: ${chain.id}`);
  }

  const platforms = new Set();
  for (const ruleId of chain.required_rules) {
    const rule = catalog.rules.find((item) => item.id === ruleId);
    if (!rule) {
      fail(`Chain ${chain.id} references unknown rule: ${ruleId}`);
    }
    platforms.add(rule.platform);
  }

  if (platforms.size < 2) {
    fail(`Chain must span at least two telemetry layers: ${chain.id}`);
  }
  if (chain.min_layers < 2 || chain.min_layers > platforms.size) {
    fail(`Chain ${chain.id} has invalid min_layers ${chain.min_layers} for ${platforms.size} platforms.`);
  }
  if (platforms.size === 3) {
    threeLayerChains += 1;
  }
  chainIds.add(chain.id);
}

if (threeLayerChains < 4) {
  fail(`Expected at least four three-layer chains, found ${threeLayerChains}.`);
}

console.log(
  `Catalog quality verification passed: ${catalog.rules.length} rules, ${detectionTypes.size} detection types, ${catalog.chains.length} chains, ${threeLayerChains} three-layer chains.`
);
