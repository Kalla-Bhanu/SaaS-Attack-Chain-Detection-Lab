# Evidence Preservation And Service Retirement

The repo is designed to survive after Okta, Google Workspace, and MongoDB Atlas lab services are retired. The reusable value is in the detection design, synthetic event bundles, validation harness, static coverage map, and public-safe evidence index.

## Capture Before Retirement

The final evidence set keeps only sanitized screenshots that prove familiarity with the relevant surfaces:

- Okta System Log, policy surfaces, and application/OAuth surfaces.
- Google Workspace OAuth app access controls and Drive external sharing controls.
- MongoDB Atlas activity feed, database users, and network access controls.

Google Workspace Admin audit reporting was attempted, but the lab role did not have the required reporting privilege. The sanitized access-boundary screenshot is retained as evidence of the limitation instead of replacing it with a misleading substitute.

## Redaction Standard

- Hide tenant URLs, org names, real identities, real domains, source addresses, account identifiers, and service credentials.
- Do not capture account subscription pages.
- Use visible redaction; it should be clear that the screenshot is sanitized.
- Keep only screenshots that explain the detection logic or the telemetry source.
- Store raw screenshots outside the repository while redacting. Commit only the sanitized PNG artifacts listed in `evidence/catalog.json`.

## After Retirement

After evidence is captured and reviewed, the lab should not require any live paid services. `npm run verify:all` must continue to work locally from checked-in artifacts.
