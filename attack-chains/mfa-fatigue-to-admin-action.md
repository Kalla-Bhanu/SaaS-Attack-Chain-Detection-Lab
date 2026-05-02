# MFA Fatigue To Admin Action

This chain models repeated MFA challenge pressure followed by privileged control-plane changes. It focuses on the point where identity abuse becomes administrative risk.

## Layer Sequence

1. Okta records repeated MFA challenge events.
2. Okta records an administrative role grant.
3. Google Workspace records a security setting change.

## Detection Logic

- `okta_mfa_fatigue_pressure`
- `okta_admin_role_grant`
- `workspace_admin_security_change`

## Boundary

MFA challenge volume can be noisy. This chain intentionally requires downstream administrative activity so a single user struggling with MFA does not become a high-confidence finding by itself.

