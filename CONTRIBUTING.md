# Contributing

Use Node 22. `npm ci`, copy `.env.example` to `.env`, generate a local auth secret, migrate, and seed as described in README. Never use a shared or production database for tests.

Create `feature/<name>-<description>` branches from the team's agreed base. Keep changes focused; include acceptance criteria, tests, and documentation in each pull request. Do not assign contributions to teammates without evidence. Preserve the existing team attribution.

Before opening a PR, run `npm run format:check`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, and `npm run test:e2e`. Add tests for behavior changes. Do not commit `.env`, databases, uploads, credentials, or generated browser reports. Never force-push shared branches or merge without team review.

Stock photographs are illustrative; preserve sample labels. Real inventory requires an authorized source and verified details. New client requirements must be documented as proposed until confirmed.
