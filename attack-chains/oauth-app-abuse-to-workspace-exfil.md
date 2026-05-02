# OAuth App Abuse To Workspace Exfiltration

This chain models a malicious or over-permissioned OAuth application moving from authorization into Workspace access changes.

## Layer Sequence

1. Okta records an OAuth consent with broad Drive-related scope.
2. Google Workspace records broad OAuth authorization.
3. Google Workspace records external Drive sharing.

## Detection Logic

- `okta_suspicious_oauth_grant`
- `workspace_oauth_scope_broad`
- `workspace_external_drive_share`

## Boundary

The chain does not claim malware, phishing infrastructure, or confirmed external download. It catches the access-grant and sharing behaviors that would justify containment review.

