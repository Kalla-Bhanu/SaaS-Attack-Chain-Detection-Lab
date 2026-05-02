# Admin Account Takeover

This chain models privileged access changes across identity, collaboration administration, and database access.

## Layer Sequence

1. Okta records an administrative role grant.
2. Google Workspace records a security setting change.
3. MongoDB Atlas records elevated database user role assignment.

## Detection Logic

- `okta_admin_role_grant`
- `workspace_admin_security_change`
- `atlas_database_user_privilege_change`

## Boundary

Administrative changes can be legitimate. The chain is designed to highlight cross-platform privilege pressure, not to replace change approval records.

