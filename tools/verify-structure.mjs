import fs from "node:fs";
import path from "node:path";

const requiredPaths = [
  "README.md",
  "LICENSE",
  ".gitattributes",
  ".gitignore",
  "package.json",
  "attack-chains",
  "detections/sigma/okta",
  "detections/sigma/google_workspace",
  "detections/sigma/mongodb_atlas",
  "events/bundles",
  "validation/results",
  "validation/self_tests",
  "docs",
  "evidence",
  "site",
  "tools",
  ".github/workflows"
];

const missing = requiredPaths.filter((relativePath) => {
  return !fs.existsSync(path.join(process.cwd(), relativePath));
});

if (missing.length > 0) {
  console.error("Missing required scaffold paths:");
  for (const item of missing) {
    console.error(`- ${item}`);
  }
  process.exit(1);
}

console.log(`Structure verification passed for ${requiredPaths.length} paths.`);
