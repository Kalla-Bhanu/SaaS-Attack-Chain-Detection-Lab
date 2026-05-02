import fs from "node:fs";
import path from "node:path";

const required = ["site/index.html", "site/styles.css"];
const missing = required.filter((file) => !fs.existsSync(file));
if (missing.length > 0) {
  console.error(`Missing site files: ${missing.join(", ")}`);
  process.exit(1);
}

const html = fs.readFileSync("site/index.html", "utf8");
for (const requiredText of [
  "SaaS Attack Chain Detection Lab",
  "Okta",
  "Google Workspace",
  "MongoDB Atlas",
  "4",
  "Evidence catalog",
  "documented Workspace privilege boundary",
  "database-layer activity materially changes the finding"
]) {
  if (!html.includes(requiredText)) {
    console.error(`site/index.html missing required text: ${requiredText}`);
    process.exit(1);
  }
}

const imageRefs = [...html.matchAll(/src="(assets\/evidence\/[^"]+\.png)"/g)].map((match) => match[1]);
if (imageRefs.length !== 8) {
  console.error(`Expected 8 dashboard evidence detail images, found ${imageRefs.length}.`);
  process.exit(1);
}

for (const imageRef of imageRefs) {
  const imagePath = path.join("site", imageRef);
  if (!fs.existsSync(imagePath)) {
    console.error(`Missing dashboard evidence asset: ${imagePath}`);
    process.exit(1);
  }
}

const sourceRefs = [...html.matchAll(/href="(assets\/evidence\/[^"]+\.png)"/g)].map((match) => match[1]);
if (sourceRefs.length !== 9) {
  console.error(`Expected 9 full sanitized screenshot links, found ${sourceRefs.length}.`);
  process.exit(1);
}

for (const sourceRef of sourceRefs) {
  const sourcePath = path.join("site", sourceRef);
  if (!fs.existsSync(sourcePath)) {
    console.error(`Missing linked evidence asset: ${sourcePath}`);
    process.exit(1);
  }
}

const visualSummaries = [...html.matchAll(/class="visual-summary"/g)];
if (visualSummaries.length !== 8) {
  console.error(`Expected 8 evidence visual summaries, found ${visualSummaries.length}.`);
  process.exit(1);
}

for (const requiredText of [
  "Sanitized screenshot detail",
  "Open full sanitized screenshot",
  "blocked_by_privilege",
  "modeled cases marked"
]) {
  if (!html.includes(requiredText)) {
    console.error(`site/index.html missing evidence proof text: ${requiredText}`);
    process.exit(1);
  }
}

console.log("Static site verification passed.");
