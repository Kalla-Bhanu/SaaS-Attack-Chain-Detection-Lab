import fs from "node:fs";

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
  "documented Workspace privilege boundary",
  "database-layer activity materially changes the finding"
]) {
  if (!html.includes(requiredText)) {
    console.error(`site/index.html missing required text: ${requiredText}`);
    process.exit(1);
  }
}

console.log("Static site verification passed.");
