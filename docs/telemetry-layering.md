# Telemetry Layering

## Okta

Okta is the identity anchor. It shows authentication failures, MFA pressure, session starts, policy changes, OAuth grants, service account activity, and role grants.

Identity telemetry is strong at showing how access starts. It is weaker at proving what the actor did after authentication.

## Google Workspace

Google Workspace is the SaaS data plane. It shows OAuth authorization, Drive activity, sharing changes, mail forwarding changes, and administrative security changes.

Workspace telemetry is strong at showing data access and collaboration changes. It is weaker at proving the original authentication path.

## MongoDB Atlas

MongoDB Atlas is the cloud database layer. It shows access list changes, database user changes, activity feed events, and modeled query or export-like activity.

Atlas telemetry is strong at showing database-layer exposure and access changes. It is weaker at proving the actor's original identity path without correlation.

## Layer Weighting

The rule catalog uses eight Okta rules, five Google Workspace rules, and three MongoDB Atlas rules. That weighting is intentional:

- Okta is the identity anchor and starts every chain.
- Google Workspace is the main SaaS data plane and appears in every chain.
- MongoDB Atlas is the downstream database layer and appears only when database activity changes the finding.

This keeps Atlas meaningful without turning the lab into a database monitoring project. If Atlas were forced into every chain, the model would look broader but the detections would be less honest.
