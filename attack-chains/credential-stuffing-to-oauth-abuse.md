# Credential Stuffing To OAuth Abuse

This chain models repeated identity pressure followed by a risky OAuth grant and broad Google Workspace access. The point is not that failed logins alone prove compromise; the value is the sequence across identity and SaaS data access.

## Layer Sequence

1. Okta records repeated failed authentication attempts for a modeled user.
2. Okta records a broad OAuth consent event from an untrusted access context.
3. Google Workspace records an OAuth authorization with Drive read scope.

## Detection Logic

- `okta_credential_failure_pressure`
- `okta_suspicious_oauth_grant`
- `workspace_oauth_scope_broad`

The chain fires only when all three signals appear inside the modeled correlation window.

## Boundary

This chain does not prove the password source, the original phishing path, or actual file exfiltration. It proves a defensible identity-to-SaaS escalation pattern that should trigger review.

