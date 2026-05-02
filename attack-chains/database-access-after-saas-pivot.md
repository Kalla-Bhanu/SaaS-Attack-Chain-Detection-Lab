# Database Access After SaaS Pivot

This chain models identity recovery pressure followed by file access and MongoDB Atlas network exposure.

## Layer Sequence

1. Okta records a privileged user recovery factor reset.
2. Google Workspace records repeated Drive downloads.
3. MongoDB Atlas records broad network access list expansion.

## Detection Logic

- `okta_recovery_factor_reset`
- `workspace_drive_download_spike`
- `atlas_network_access_expanded`

## Boundary

This chain catches control weakening around a database owner and database access exposure. It does not prove that database contents were exported.

