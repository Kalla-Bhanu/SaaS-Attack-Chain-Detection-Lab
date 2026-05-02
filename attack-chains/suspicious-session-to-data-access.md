# Suspicious Session To Data Access

This chain models an unusual identity session followed by SaaS file access and database-layer activity. It shows how identity telemetry becomes more useful when joined with downstream behavior.

## Layer Sequence

1. Okta records a successful session from an untrusted zone.
2. Google Workspace records repeated Drive downloads.
3. MongoDB Atlas records a large query or export-like action.

## Detection Logic

- `okta_suspicious_session_start`
- `workspace_drive_download_spike`
- `atlas_query_export_anomaly`

## Boundary

The chain does not prove data left the environment. It raises confidence by joining suspicious session context with modeled data-access activity.

