# Coverage And Gaps

Coverage is intentionally conservative. The project validates chain logic against synthetic events and documents where more telemetry would be needed.

| Area | Status | What The Lab Proves | What It Does Not Claim |
| --- | --- | --- | --- |
| Identity pressure | Validated | Failed login pressure, MFA pressure, suspicious session, role and policy changes. | Original credential theft path or complete account-takeover proof. |
| OAuth abuse | Validated | Broad grant and Workspace authorization pattern. | Malicious app attribution or completed data transfer. |
| Workspace data access | Validated | Drive downloads, external sharing, admin security changes, and control-surface evidence. | Full DLP classification, all user baseline context, or direct Admin audit report capture from the retired lab role. |
| Database exposure | Partial | Atlas network expansion, database role changes, large query activity. | Confirmed exfiltration or full database audit parity. |
| Cross-layer correlation | Validated | Rule signals compose into eight chain outcomes. | Production alert quality or long-term tuning history. |

## Chain Coverage Discipline

Every chain requires at least three rule signals and at least two telemetry layers. Four chains span all three layers: suspicious session to data access, admin account takeover, service account misuse, and database access after SaaS pivot. The remaining four chains are identity-to-Workspace chains where Atlas is intentionally not forced into the sequence.

The rule distribution is weighted by where the detection context starts: eight Okta rules, five Google Workspace rules, and three MongoDB Atlas rules. Atlas is a supporting database layer in this lab, not an equal identity source.

| Chain | Layer Span | Why The Span Is Enough |
| --- | --- | --- |
| Credential stuffing to OAuth abuse | Okta -> Workspace | The finding moves from identity pressure to OAuth authorization and Workspace access. Atlas would be unrelated unless database activity follows. |
| MFA fatigue to admin action | Okta -> Workspace | The finding moves from identity pressure to privileged SaaS control change. Database activity is not needed to prove the administrative risk. |
| Suspicious session to data access | Okta -> Workspace -> Atlas | The finding joins identity session context with SaaS data access and database-layer activity. |
| OAuth app abuse to Workspace exfiltration | Okta -> Workspace | The finding focuses on grant abuse and Workspace data access. Atlas is not assumed. |
| Admin account takeover | Okta -> Workspace -> Atlas | The finding joins role grant, SaaS security change, and database role change. |
| Service account misuse | Okta -> Workspace -> Atlas | The finding joins service token use, OAuth scope expansion, and database query/export-like activity. |
| Policy weakening chain | Okta -> Workspace | The finding joins weakened identity control with SaaS security and sharing changes. |
| Database access after SaaS pivot | Okta -> Workspace -> Atlas | The finding requires the downstream database layer because that is the pivot being modeled. |

## Detection Pattern Variety

The catalog labels rule patterns so the project can be reviewed for variety instead of only for count. The current set includes volume thresholds, behavioral pressure, rare context, scope expansion, privilege change, control weakening, source anomaly, account recovery change, external sharing, persistence path, control change, and exposure change.

## ATT&CK Mapping Boundary

This lab uses ATT&CK as a vocabulary for describing technique families, not as a claim of full technique coverage. Chain-level coverage is only considered validated when the chain fires through the local harness. Single-rule coverage is treated as a supporting signal, not a complete finding.

| Mapping Use | How This Repo Treats It |
| --- | --- |
| Covered when chain triggers | Technique-family language for valid account use, OAuth abuse, control weakening, external sharing, and data access is used only when the required chain signals validate together. |
| Supporting single-rule signal | A single rule can support a technique family, but it does not become a complete finding by itself. |
| Partial by design | Workspace audit-style events are modeled because the lab role could not access the live Admin audit report. The blocker is documented in the evidence catalog. |
| Not claimed | The repo does not claim full phishing, malware, endpoint execution, DLP classification, database audit parity, or production tuning coverage. |

## Evidence Boundary

The evidence set includes sanitized screenshots for Okta, Google Workspace, and MongoDB Atlas control surfaces. Google Workspace Admin audit reporting was attempted and blocked by role privilege; that boundary is documented in the evidence catalog and preserved as a sanitized screenshot. The event bundles still model Workspace audit-style events, but the repository does not claim a successful live export from that report surface.

## Not Claimed

- Complete SaaS breach detection.
- Production tuning.
- Incident response execution.
- Confirmed data loss.
- Identity-provider or database platform coverage beyond the modeled events.
- Full ATT&CK technique coverage for phishing, malware delivery, endpoint execution, DLP classification, or database audit parity.
- Successful live capture of every paid-service audit surface.
