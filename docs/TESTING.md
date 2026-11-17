# Testing and acceptance

## Strategy

Tests target actual service behavior, persisted data, authorization, validation, and browser workflows. All automated mutations use fresh isolated databases under the OS temporary directory. The application development database, real accounts and external real estate services are not used.

### Service and component checks

```bash
npm run typecheck
npm run lint
npm test
```

Vitest creates a temporary SQLite URL before imports and applies the committed migration in global setup. Test files run serially. Service coverage includes property validation, currency precision, optional numerical clearing, normalized ranges, query construction, publication privacy, numeric filtering, sorting, transactional listing updates, inquiry validation/persistence, foreign-key deletion behavior, analytics aggregation/deduplication/test separation, unknown analytics field exclusion, origin checks, persistent rate limits, request size limits, account hashing, self-deactivation protection and session revocation.

React Testing Library/jsdom verifies durable inquiry success feedback and server-error handling that retains the visitor's message. Component tests mock network responses; service tests call actual route handlers and a real temporary Prisma database.

### Browser checks

```bash
npm run build
npx playwright install chromium
npm run test:e2e
```

On Linux CI, `npx playwright install --with-deps chromium` installs required system libraries too. Browser tests run the production server on **port 3100**, which must be free. The E2E wrapper creates a fresh temporary database/media directory, applies migrations, seeds samples, generates an ephemeral administrator password, and initializes that account. The production server and test process receive the same isolated environment. Existing local `.env` secrets are not copied into the test account.

Three scenario groups run in two Chromium projects: desktop 1280×720 and a 390×664 mobile viewport with iPhone-style device settings. Together they verify:

1. Homepage heading and three featured records.
2. City search and URL state, price filtering and ascending price sort.
3. Detail routes and gallery thumbnail selection.
4. Visitor inquiry success and direct database persistence.
5. Protected page redirect and unauthenticated API rejection.
6. Administrator credential login.
7. Listing creation, upload, publication, price editing and immediate public visibility.
8. Uploaded WebP fetches through the runtime media route.
9. Recorded views and inquiry association.
10. Inquiry status/private-note updates in administration.
11. Analytics and settings screens; settings persistence feedback.
12. User management screen and logout/protected-access behavior.
13. Draft privacy, no-result states, about/contact direct URLs and mobile menu.
14. No horizontal page overflow on representative visitor pages.

Failures retain Playwright traces under ignored `test-results`. Run `npx playwright show-trace <path>` locally to inspect them. Tests generate artificial activity tagged `test`; normal dashboards exclude it. Browser tests use local photographs and do not need outbound data feeds.

### Formatting, build and dependency checks

```bash
npm run format:check
npm run build
npm audit
```

Prettier skips generated Next type declarations, Prisma SQL, lockfiles, and assets. ESLint includes Next and TypeScript rules. The build compiles all public/admin/API routes and performs framework TypeScript validation. Audits are time-specific evidence, not a permanent security guarantee.

## Local verification record

The implementation was verified locally on Node 22.23.1 with Prisma 7.10.1 and Next.js 16.4.6. The migration was applied and sample seeding completed without overwriting existing records. Final local results: 26 service/component tests passed; six desktop/mobile browser workflows passed; formatting, TypeScript, ESLint, production build and dependency audits passed. A clean `npm ci`, migration deployment and repeatable seed were also executed successfully. GitHub Actions is configured but has not been pushed or executed remotely by this task.

Sandboxed process/network restrictions required authorized execution for dependency installation, browser launch, local listening ports and some build/migration subprocesses. Initial browser failures exposed select-label resolution and a create-to-edit transition race; those were fixed and the workflows rerun. These environment or earlier test failures must not be presented as final passing results until the full rerun completes.

## Visual QA

`scripts/screenshots.mjs` captures homepage/detail pages at 1440×1050 and 390×844 against a running local server on port 3000. It reports runtime errors and horizontal overflow. Captures were inspected for spacing, typography, image cropping, form readability and responsive stacking. A connected interactive browser was unavailable in this environment; Playwright provided browser automation and screenshots.

The screenshot command is optional and writes ignored artifacts. It requires a local server and Chromium installation; captures are saved under `.artifacts/visual`, and event ingestion is intercepted to keep visual QA out of genuine analytics. Do not run `next dev` concurrently with a production server using the same build output while tests are running.

## Manual acceptance checklist

These are review steps, not claims of completed assistive-technology or cross-browser testing.

- [ ] Review all public pages at 360, 390, 768, 1024 and 1440 pixels; verify no clipped controls.
- [ ] Tab through navigation, mobile menu, gallery, forms and dashboard; check visible focus and meaningful labels.
- [ ] Verify skip link, heading hierarchy, status/error announcements and gallery alt text with a screen reader.
- [ ] Test all search fields together; previous/next pages retain every active filter; shared URLs reproduce results.
- [ ] Create drafts with unavailable optional facts; publish only after a photo; verify unpublishing removes direct public access.
- [ ] Upload JPEG/PNG/WebP; reject malformed, oversized and disallowed files; check alt text, primary image, reorder, remove, and gallery order after saving.
- [ ] Confirm listing deletion and cancel it once; verify associated inquiries survive a confirmed deletion.
- [ ] Submit general and listing inquiries; review status filters, ordering and internal notes; check rate-limit feedback.
- [ ] Verify no inquiry/contact data appears in public page responses or analytics.
- [ ] Change known site content, refresh public pages, then restore the intended settings.
- [ ] Add a secondary admin, deactivate/reactivate, reset password and verify session revocation; confirm self-deactivation is prevented.
- [ ] Check genuine empty analytics, then generate activity and review counts/retention command.
- [ ] Test database/media persistence across application restart and verify a backup restore.
- [ ] Test Safari/Firefox and real touch devices before production acceptance.

## CI

`.github/workflows/ci.yml` installs pinned dependencies, migrates/seeds a CI database, checks formatting/types/lint, runs service/component tests, builds, installs Chromium, and runs browser workflows with their own database. It uploads failure artifacts. Workflow configuration does not establish that a remote run passed; review the actual GitHub run after an authorized push.
