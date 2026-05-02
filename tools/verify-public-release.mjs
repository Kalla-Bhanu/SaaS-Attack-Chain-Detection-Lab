import fs from "node:fs";
import path from "node:path";

const ignoredDirs = new Set([
  ".git",
  "node_modules",
  ".cache",
  "coverage",
  "test-results",
  "playwright-report"
]);

const scannedExtensions = new Set([
  ".md",
  ".json",
  ".js",
  ".mjs",
  ".html",
  ".css",
  ".yml",
  ".yaml",
  ".txt",
  ".ps1"
]);

const findings = [];

const checks = [
  {
    name: "Private project or review context",
    pattern: /\b(Keyrock|interv[i]ew|debrief|SharePoint|Maria|Gilad|David|Shiran|DreamlineA[I]|American Express)\b/i
  },
  {
    name: "Assistant scaffolding residue",
    pattern: /\b(ChatG[P]T|Cl[a]ude|Co[d]ex|OpenA[I]|Anthropi[c]|L[L]M|A[I] generat[e]d|generat[e]d by A[I]|as an A[I]|what to sa[y]|reviewer wording|resu[m]e positioning)\b/i
  },
  {
    name: "Billing or account-management residue",
    pattern: /\b(billing|invoice|salary|offer letter|job update|payment method)\b/i
  },
  {
    name: "Potential non-example email",
    pattern: /\b[A-Z0-9._%+-]+@(?!example\.(?:com|org|net)\b)[A-Z0-9.-]+\.[A-Z]{2,}\b/i
  },
  {
    name: "Potential public or private non-documentation IPv4",
    pattern: /\b(?!(?:192\.0\.2|198\.51\.100|203\.0\.113)\.)(?!0\.0\.0\.0\/0\b)((?:10|172\.(?:1[6-9]|2\d|3[0-1])|192\.168|\d{1,3})\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/
  },
  {
    name: "Potential secret material",
    pattern: /\b(api[_-]?key|client[_-]?secret|access[_-]?token|refresh[_-]?token|private[_-]?key|BEGIN [A-Z ]*PRIVATE KEY)\b/i
  },
  {
    name: "Self-promotional or overclaim wording",
    pattern: /\b(this demonstrat[e]s my ability to|this showcas[e]s|in production I would|production-read[y]|battle-test[e]d)\b/i
  }
];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (!scannedExtensions.has(path.extname(entry.name))) {
      continue;
    }

    const relativePath = path.relative(process.cwd(), fullPath);
    if (relativePath.replaceAll("\\", "/") === "tools/verify-public-release.mjs") {
      continue;
    }

    const text = fs.readFileSync(fullPath, "utf8");
    for (const check of checks) {
      const match = text.match(check.pattern);
      if (match) {
        findings.push({
          file: relativePath,
          check: check.name,
          match: match[0]
        });
      }
    }
  }
}

walk(process.cwd());

if (findings.length > 0) {
  console.error("Public release verification failed:");
  for (const finding of findings) {
    console.error(`- ${finding.file}: ${finding.check} (${finding.match})`);
  }
  process.exit(1);
}

console.log("Public release verification passed.");
