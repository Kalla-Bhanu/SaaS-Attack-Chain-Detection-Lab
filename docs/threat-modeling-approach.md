# Threat Modeling Approach

This lab treats SaaS compromise as a chain across three layers:

- Identity activity in Okta.
- Collaboration and data-plane activity in Google Workspace.
- Database access and administration activity in MongoDB Atlas.

The central idea is that no single layer tells the full story. Identity logs can show an unusual session or grant, Workspace logs can show the downstream data action, and Atlas logs can show whether the activity reached a cloud database tier.

The lab is intentionally not balanced evenly across the three services. Okta carries the most rules because the identity layer is where the attack chain usually becomes visible first. Google Workspace carries the next-largest share because it is the SaaS data plane where OAuth, sharing, and administrative changes show impact. MongoDB Atlas is a supporting database layer: it appears when the chain reaches data infrastructure, but it is not treated as a second identity provider or a full standalone database audit lab.

Four chains span all three services. Four chains stop at Okta and Google Workspace because forcing Atlas into every sequence would create weaker findings, not stronger ones. The rule is simple: a chain only includes the database layer when database activity materially changes the detection.

## Design Rules

- Keep each chain small enough to defend.
- Require cross-layer correlation before calling a case high confidence.
- Treat single-layer alerts as useful but incomplete.
- Name false-positive paths instead of hiding them.
- Preserve clear boundaries between modeled data and live operations.
- Do not add a layer to a chain only to make the diagram look broader.

## Threat Patterns Modeled

The eight chains focus on common SaaS compromise paths: credential pressure leading to OAuth abuse, MFA pressure leading to administrative action, suspicious identity sessions followed by data access, OAuth grants that turn into Workspace exposure, admin takeover, service-account misuse, control weakening, and database access after a SaaS pivot.

Each pattern is modeled as a sequence of smaller signals. The project does not claim that any one signal proves compromise by itself.
