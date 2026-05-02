# Lab Modeling Disclosure

This repository is a public-safe lab. The attack chains, events, and validation results are synthetic and designed to model realistic telemetry relationships without exposing private service data.

## Real

- The project structure.
- The detection design.
- The validation harness.
- The local verification commands.
- Sanitized service-surface evidence for eight Okta, Google Workspace, and MongoDB Atlas control surfaces.
- The documented Google Workspace audit-report privilege boundary.
- The public-safe release checks and evidence catalog checks.

## Lab-Modeled

- User identities.
- Source addresses.
- Service events.
- Correlation windows.
- Alert outcomes.
- Tuning decisions.
- Workspace audit report content that the lab role could not access.

## Not Claimed

- Production operation.
- Real adversary activity.
- Real false-positive rates.
- Complete tenant audit coverage.
- Live export from the Google Workspace Admin audit report.
- Database audit parity with a managed production Atlas environment.

## Not Included In The Public Repo

- Private tenant names.
- Real user data.
- Service credentials.
- Raw exports from SaaS platforms.
- Production claims.
