# Policy Weakening Chain

This chain models authentication control weakening followed by SaaS security and sharing changes.

## Layer Sequence

1. Okta records a policy rule update that weakens MFA handling.
2. Google Workspace records a security setting change.
3. Google Workspace records external sharing.

## Detection Logic

- `okta_policy_mfa_weakened`
- `workspace_admin_security_change`
- `workspace_external_drive_share`

## Boundary

The chain does not claim that every policy change is malicious. It models a sequence that would require fast owner validation and rollback review.

