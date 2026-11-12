# Agent notes — personal-records-vault

## Apps

- Desktop UI: Electron + SolidJS under `apps/desktop`.
- Marketing site: `apps/site` (`@prv/site`). GitHub Actions publishes `apps/site/.output/public` to Netlify (`netlify.toml` names the directory). Do not rely on Netlify's Git builder.

## CI

- GitHub Actions uses Ubuntu runners (not Windows desktop builds).
