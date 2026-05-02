# SaaS Attack Chain Detection Lab

[![License: All Rights Reserved](https://img.shields.io/badge/license-All%20Rights%20Reserved-red)](LICENSE)

This lab models detection design across a SaaS attack chain: identity activity in Okta, collaboration activity in Google Workspace, and database-layer activity in MongoDB Atlas. The project is built around cross-layer correlation, not a single product dashboard or a simulated SIEM.

The core question is simple: what changes when an identity signal is joined with downstream SaaS data access and database-layer activity? The lab answers that with eight attack chains, Sigma-style layer rules, synthetic event bundles, a local validation harness, conservative coverage boundaries, and a static coverage map.

This is not a post-compromise AWS investigation narrative and not a single-vendor monitor-as-code exercise. The scope is narrower: identity, collaboration, and database-layer signals are joined into higher-confidence attack-chain findings before a cloud incident becomes obvious downstream.

## Project Contents

- Eight SaaS attack chains across identity, collaboration, and database layers.
- Sixteen Sigma-style rules grouped by Okta, Google Workspace, and MongoDB Atlas, with explicit detection-pattern labels.
- Twenty-four validation bundles: positive, negative, and edge cases for every chain.
- A local correlation harness with five intentional failure self-tests.
- A static attack-chain coverage map that works without live paid services.
- A sanitized evidence catalog with service screenshots and a documented Workspace audit-report privilege boundary.

## Quick Links

- [Attack chain cards](attack-chains)
- [Detection catalog](detections/catalog.json)
- [Sigma-style rules](detections/sigma)
- [Synthetic event bundles](events/bundles/cases.json)
- [Validation results](validation/results/latest.json)
- [Threat modeling approach](docs/threat-modeling-approach.md)
- [Telemetry layering](docs/telemetry-layering.md)
- [Coverage and gaps](docs/coverage-and-gaps.md)
- [Evidence preservation](docs/evidence-preservation-and-retirement.md)
- [Static coverage map](site/index.html)

## Attack Chains

1. Credential stuffing to OAuth abuse.
2. MFA fatigue to admin action.
3. Suspicious session to data access.
4. OAuth app abuse to Workspace exfiltration.
5. Admin account takeover.
6. Service account misuse.
7. Policy weakening chain.
8. Database access after SaaS pivot.

## Repository Layout

```text
attack-chains/       Per-chain detection rationale and boundaries
detections/          Detection catalog and Sigma-style rules
events/              Synthetic Okta, Workspace, and Atlas event bundles
validation/          Validation result artifact
docs/                Threat model, coverage, reproducibility, and disclosure notes
evidence/            Sanitized evidence index and captured artifacts
site/                Static attack-chain coverage map
tools/               Local verification scripts
```

## Verification

```powershell
npm run verify:all
```

The full verification path checks repository structure, catalog quality, event schemas, layer rules, chain correlation, harness self-tests, release manifest counts, evidence catalog shape, static site content, and public-release wording.

## Public Boundary

This project must not include private tenant names, real user data, real emails, account IDs, API keys, tokens, account subscription pages, raw service exports, or production-operation claims.
