# Reproducibility

Run the full local check:

```powershell
npm run verify:all
```

The verification path checks:

- Repository structure.
- Synthetic event schemas.
- Layer rule evaluation.
- Chain correlation outcomes.
- Harness self-tests.
- Release manifest counts.
- Evidence catalog structure.
- Static site content.
- Public-safe wording and identifier hygiene.

The checks do not require live Okta, Google Workspace, or MongoDB Atlas services.

