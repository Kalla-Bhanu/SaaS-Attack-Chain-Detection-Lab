# Detection Design Notes

The detections are designed as small layer signals that compose into attack chains. A single rule is not meant to be the full finding.

## Correlation Strategy

Each chain requires all listed rule signals inside a defined time window. The validation harness evaluates the layer rules first, then evaluates whether the chain-level correlation should fire.

The harness is intentionally small. It checks the correlation pattern against sanitized event bundles without claiming to be a SIEM, alert queue, or managed analytics platform.

The harness answers one narrow question: given a known event bundle, did the expected layer signals appear close enough together to form the modeled chain? It does not score severity, deduplicate incidents, run enrichment jobs, manage alert ownership, or estimate real-world false-positive rates.

## False-Positive Controls

- Repeated identity failures need a downstream grant or data signal.
- MFA challenge pressure needs an administrative or SaaS control signal.
- Suspicious sessions need data access or database activity.
- Policy weakening needs a downstream security or sharing change.
- Atlas activity is treated as higher confidence only when joined with identity or Workspace context.

## Rule Pattern Types

The catalog labels each rule by detection pattern so the rule set can be checked for variety. The patterns include threshold-based activity, behavioral pressure, rare context, scope expansion, privilege changes, control weakening, source anomalies, account recovery changes, sharing changes, persistence paths, and database exposure changes.

## Chain And Rule Boundary

Rules are supporting signals. Chains are the findings. A credential-pressure rule, OAuth-scope rule, or Atlas exposure rule can be valuable on its own, but the project only treats the outcome as high confidence when the required signals appear together inside the modeled window.

This distinction matters because ATT&CK-style technique vocabulary can make a single rule look more complete than it really is. The lab uses those technique families to describe what kind of behavior is being modeled; the validation result remains chain-based.

## Production Extension Path

In a live environment, these chains would need user baselines, owner inventories, approved source ranges, change records, and historical alert quality metrics. This lab keeps those as documented extension paths rather than claiming they exist.
