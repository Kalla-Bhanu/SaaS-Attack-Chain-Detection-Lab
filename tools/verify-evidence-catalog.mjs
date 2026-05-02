import fs from "node:fs";
import path from "node:path";

if (!fs.existsSync("evidence/catalog.json")) {
  console.error("evidence/catalog.json is missing.");
  process.exit(1);
}

const catalog = JSON.parse(fs.readFileSync("evidence/catalog.json", "utf8"));
if (!Array.isArray(catalog.evidence)) {
  console.error("evidence/catalog.json must contain an evidence array.");
  process.exit(1);
}

const allowedStatuses = new Set(["captured", "blocked_by_privilege"]);
const statusCounts = new Map();
const ids = new Set();

for (const item of catalog.evidence) {
  if (!item.id || !item.platform || !item.status || !item.file || !item.sanitization_note || !item.captured_at) {
    console.error(`Evidence catalog entry is incomplete: ${JSON.stringify(item)}`);
    process.exit(1);
  }

  if (ids.has(item.id)) {
    console.error(`Duplicate evidence id: ${item.id}`);
    process.exit(1);
  }
  ids.add(item.id);

  if (!allowedStatuses.has(item.status)) {
    console.error(`Evidence ${item.id} has unsupported status ${item.status}.`);
    process.exit(1);
  }

  if (!item.file.startsWith("evidence/") || path.basename(item.file).includes("raw")) {
    console.error(`Evidence ${item.id} must point to a sanitized file under evidence/.`);
    process.exit(1);
  }

  if (!path.basename(item.file).includes("sanitized") || path.extname(item.file) !== ".png") {
    console.error(`Evidence ${item.id} must use a sanitized PNG artifact.`);
    process.exit(1);
  }

  if (!fs.existsSync(item.file)) {
    console.error(`Evidence file is missing for ${item.id}: ${item.file}`);
    process.exit(1);
  }

  const size = fs.statSync(item.file).size;
  if (size < 10000) {
    console.error(`Evidence file looks too small for ${item.id}: ${item.file}`);
    process.exit(1);
  }

  if (item.status === "blocked_by_privilege" && !item.blocker_note) {
    console.error(`Evidence ${item.id} needs a blocker_note because it is blocked_by_privilege.`);
    process.exit(1);
  }

  statusCounts.set(item.status, (statusCounts.get(item.status) ?? 0) + 1);
}

const summary = [...statusCounts.entries()]
  .map(([status, count]) => `${count} ${status}`)
  .join(", ");

console.log(`Evidence catalog verification passed: ${summary}.`);
