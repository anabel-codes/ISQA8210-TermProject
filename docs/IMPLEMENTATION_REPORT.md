# Implementation report

## Repository and architecture

The starting repository contained only README documentation, two initial commits, no application, and a clean `feature/jake-initial-development` branch. Work remains on that branch. Existing team/course attribution has been preserved. No remote push, history rewrite, or merge was performed.

The delivered modular monolith uses Next.js 16.4.6 App Router, React 19.3.1, TypeScript, Tailwind CSS 4, Lucide, Zod, Prisma 7.10.1 with SQLite's driver adapter, NextAuth 4.24.15, bcrypt and Sharp. Versions are pinned and locked. SQLite and local media keep development reproducible; PostgreSQL/shared-storage conversion is documented rather than represented as deployed.

## Completed functionality

- Responsive public home, catalog, property detail/gallery, about and contact pages with a consistent ivory/forest design, local photographs, focus states, semantic navigation, loading/error/empty states and clear sample labeling.
- Persisted property search across location, price, beds, baths, type, status, area and featured flag; stable sorting and pagination retain URL state. Drafts are excluded from public queries and direct detail access.
- Protected listing create/edit/delete, independent publication/sale status, featured selection, optional property facts, features and photo management. Uploads are authenticated, decoded, bounded, re-encoded and served immediately through a controlled media route.
- Durable general/listing inquiries, client/server validation, honeypot, persistent rate limits, feedback, private contact review, status/notes, search and date sorting.
- Real first-party view/search/featured/inquiry events, retry deduplication, test separation, 30-day dashboard summaries and documented 90-day cleanup command. Empty analytics start at zero.
- Site name/contact/biography/homepage settings and administrator account creation, activation/deactivation and password reset.

## Database and migrations

The committed `20261117011527_initial` migration creates User, Property, PropertyImage, PropertyFeature, Inquiry, AnalyticsEvent, SiteSetting and RateLimit with foreign keys, appropriate indexes, timestamps and unique constraints. Price is stored as integer cents. Listing saves and inquiry/event persistence use transactions. Deleting a listing cascades its image/feature metadata and preserves inquiries/events with a null association.

The repeatable seed creates thirteen fictional properties, twelve published and one draft. It preserves existing sample edits and creates no users, inquiries or fabricated analytics. Development migrations and seeding were executed successfully.

## Routes

Public: `/`, `/properties`, `/properties/[id]`, `/about`, `/contact`, `/login`, and the controlled media endpoint `/uploads/[file]`.

Administration: `/admin`, `/admin/listings`, `/admin/listings/new`, `/admin/listings/[id]`, `/admin/inquiries`, `/admin/analytics`, `/admin/settings`, `/admin/users`.

Public mutations: `/api/inquiries`, `/api/events`; authentication: `/api/auth/[...nextauth]`. Authenticated mutations cover listings, inquiries, uploads, settings and users under `/api/admin`. See ARCHITECTURE for methods/contracts.

## Authentication and authorization

NextAuth credentials/JWT sessions last eight hours. Bcrypt uses cost 12. Password input is constrained to prevent bcrypt's 72-byte truncation. Every protected page/API rechecks the database account, ADMIN role, active status and session version. Account changes revoke previous sessions. Custom mutations enforce the canonical origin; login uses NextAuth's CSRF flow. Initialization requires environment credentials and a random auth secret; there is no default password or committed production credential.

## Verification

The completed local verification includes:

- Database migration and repeatable demonstration seed.
- TypeScript and ESLint checks.
- Prettier consistency checks.
- 26 Vitest service/integration/component tests, including real isolated SQLite operations.
- Six Playwright workflows across desktop and mobile Chromium, covering public discovery, price filters/sort, galleries, persisted inquiries, login/logout, protected access, upload/read, create/edit/publish, inquiry management, analytics and settings.
- Successful optimized production build of all routes.
- Runtime and full dependency audits reporting zero known vulnerabilities at verification time.
- Desktop/mobile homepage/detail screenshots inspected, with zero runtime page errors and no horizontal overflow in the captured pages.

The browser suite initially exposed label resolution and a create-to-edit input race. Those were corrected with explicit select labels, controlled editor state and disabled fields during hydration/navigation. The full suite was rerun successfully. Automated checks use temporary test databases/media and generated credentials. Connected interactive browser handoff was unavailable; Playwright supplied automation and visual captures. GitHub Actions is configured, but no remote CI success is claimed.

## Documentation and repository delivery

README, CONTRIBUTING, ARCHITECTURE, DATABASE, USER_GUIDE, TESTING, USER_STORIES, DEPLOYMENT, RETROSPECTIVE_TEMPLATE, ASSETS and this report explain setup, data flow, acceptance criteria, deployment and remaining limits. The retrospective is an unfilled template. GitHub Actions, PR/issue templates, environment examples, ignored local runtime data, formatter/linter configuration and lockfile support team review.

## Local commands

```bash
npm ci
cp .env.example .env
openssl rand -base64 48
```

Set `NEXTAUTH_SECRET` in `.env` to the generated value; keep the canonical origin `http://localhost:3000`. Then:

```bash
npm run db:migrate
npm run db:seed
npm run dev
```

For administration, temporarily set `ADMIN_EMAIL` and a unique `ADMIN_PASSWORD` in `.env`, run `npm run admin:create`, and remove the initialization password. Sign in at `/login`.

```bash
npm run format:check
npm run typecheck
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

## Deployment and remaining limitations

Production requires a persistent Node 22.12+ host, HTTPS, a canonical production origin/random auth secret, absolute database/media paths, migration, production build, account initialization and process supervision. Back up and restore-test database/media, schedule analytics cleanup, and verify client details before accepting real inquiries or inventory. DEPLOYMENT provides the commands and PostgreSQL conversion procedure.

Not implemented: email notifications, licensed MLS/IDX imports, appointment booking, map/geocoding integration, MFA/self-service recovery, granular non-admin roles, automatic orphan-media cleanup, automatic inquiry deletion, and a verified PostgreSQL/object-storage deployment. Cross-engine and assistive-technology acceptance remain manual review items. These limits do not prevent the demonstrated local end-to-end workflows from operating. Unknown biography, contact information, qualifications and service area remain unconfirmed.
