# Service Account Misuse

This chain models an automation or service identity being used from an unexpected source and then touching SaaS and database data.

## Layer Sequence

1. Okta records service account token activity from an untrusted zone.
2. Google Workspace records broad OAuth authorization.
3. MongoDB Atlas records large query activity.

## Detection Logic

- `okta_service_account_token_use`
- `workspace_oauth_scope_broad`
- `atlas_query_export_anomaly`

## Boundary

This chain depends heavily on source inventory. A moved automation runner can resemble misuse unless expected source ranges and owners are maintained.

