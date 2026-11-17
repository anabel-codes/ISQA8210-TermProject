# Carlos Kosala Real Estate

An end-to-end real estate application for **ISQA 8210, University of Nebraska at Omaha**. Visitors can discover properties and submit inquiries without creating an account. Administrators manage inventory, photographs, inquiries, site content, accounts, and observed search activity.

This repository began with the team's project README. The baseline requirements are property listings, search and filtering, customer inquiries, featured properties, search analytics, responsive design, application stability, and Agile deliverables. Additional implementation decisions in this repository are not assertions of client approval.

**Demonstration only:** seeded addresses, prices, descriptions, and property facts are fictional. Local stock photography is illustrative and does not depict the sample addresses. No MLS/IDX data is used. Brokerage credentials, biography, service area, and client contact information remain unverified and configurable.

## Features

- Editorial public homepage, about and contact pages, responsive navigation, featured property cards, accessible forms, and image galleries.
- Database-backed property search with URL filters for location, price, bedrooms, bathrooms, type, sale status, square feet, and featured listings. Stable sorting and server pagination; reversed ranges are normalized.
- Complete protected listing creation, editing, publication, feature selection, sale status, and confirmed deletion. Upload, reorder, remove, and select primary photographs.
- Durable general/property inquiries with validation, honeypot, persistent rate limits, status management, and private notes.
- Administrator dashboard with inventory counts, real first-party analytics, inquiry activity, and useful empty states. No fabricated analytics are seeded.
- Site content/contact settings, administrator provisioning, activation/deactivation, password reset, and session revocation.

## Stack and architecture

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4 and custom design tokens, Lucide, Prisma 7 with its SQLite driver adapter, Zod, NextAuth credentials/JWT sessions, bcrypt, and Sharp. Vitest/React Testing Library and Playwright provide automated checks. Exact resolved versions are committed in `package-lock.json`.

Server components read from services in `src/lib`; HTTP mutations validate input and authorize on the server. SQLite keeps local setup simple. Production can run on a persistent Node host; PostgreSQL conversion steps are documented separately. No hosting service or cloud account is required locally.

## Local setup

Prerequisites: **Node.js 22.12+**, npm, and a modern browser. A native compiler toolchain may be needed if a `better-sqlite3` prebuilt binary is unavailable.

```bash
npm ci
cp .env.example .env
openssl rand -base64 48
```

Paste the generated value into `NEXTAUTH_SECRET` in `.env`. Do not commit it. Then:

```bash
npm run db:migrate
npm run db:seed
npm run dev
```

Open <http://localhost:3000>. The seed is repeatable: it creates only missing sample IDs and preserves existing edits. It creates 13 sample records: 12 published and one draft. It never creates users or analytics.

### Initialize an administrator

Set `ADMIN_EMAIL` and a unique `ADMIN_PASSWORD` of 12–72 characters (at most 72 UTF-8 bytes) in your local `.env`, then run:

```bash
npm run admin:create
```

Sign in at `/login`. Remove `ADMIN_PASSWORD` from `.env` afterward. There is no default password and the seed creates no administrator. Existing accounts are not overwritten by initialization; use the protected Users screen for resets. `ADMIN_NAME` is optional.

### Environment

| Variable                                      | Purpose                                                                                       |
| --------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                                | SQLite URL; default example `file:./prisma/dev.db`, relative to repository root.              |
| `NEXTAUTH_URL`                                | Canonical origin, including port. Must match the URL used in the browser.                     |
| `NEXTAUTH_SECRET`                             | At least 32 random characters; required for safe session signing.                             |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` | Initialization only; no hardcoded credentials.                                                |
| `MEDIA_ROOT`                                  | Optional absolute persistent upload directory; defaults to `.data/media`.                     |
| `TRUST_PROXY`                                 | Default `false`. Set `true` only behind a trusted proxy that overwrites forwarded client IPs. |
| `APP_TEST_MODE`                               | Test runner only. Separates test events; never enable in production.                          |

Without a trusted proxy, public request rate limits share a local bucket. Email notifications are not integrated: inquiries are always stored and reviewed in the dashboard.

## Commands and verification

```bash
npm run typecheck
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
npm run format:check
```

`npm test` and `npm run test:e2e` each create an isolated temporary database and apply committed migrations. Browser tests generate an ephemeral administrator password, use port 3100, start the production build, and exercise desktop and mobile Chromium. Build before browser tests. No real estate APIs or external photographs are needed during tests.

Other commands: `npm run format`, `npm run test:watch`, `npm run analytics:prune`, `npm run start`. The prune command removes analytics older than 90 days and expired rate-limit buckets; schedule it daily in deployment. See [TESTING](docs/TESTING.md) for actual verification results and manual acceptance criteria.

## Routes

| Public                                 | Protected administration                                                   |
| -------------------------------------- | -------------------------------------------------------------------------- |
| `/`, `/properties`, `/properties/[id]` | `/admin`, `/admin/listings`, `/admin/listings/new`, `/admin/listings/[id]` |
| `/about`, `/contact`, `/login`         | `/admin/inquiries`, `/admin/analytics`, `/admin/settings`, `/admin/users`  |

Mutating JSON APIs live under `/api`; administration is under `/api/admin`. Uploaded WebP assets are served through `/uploads/[file]`. Auth handlers are under `/api/auth`. See [ARCHITECTURE](docs/ARCHITECTURE.md) for the API contract.

## Deployment

Use a Node 22.12+ host with persistent database and media storage. Set production environment variables, run `npm ci`, `npm run db:migrate`, `npm run build`, initialize the first administrator, and `npm start` behind HTTPS. Do not seed production inventory automatically. SQLite deployment is single-host; horizontally scaled/serverless deployment needs PostgreSQL and shared media storage. See [DEPLOYMENT](docs/DEPLOYMENT.md) for exact production and conversion steps.

## Documentation

- [Implementation report](docs/IMPLEMENTATION_REPORT.md)
- [Architecture](docs/ARCHITECTURE.md) and [database](docs/DATABASE.md)
- [User guide](docs/USER_GUIDE.md) and [testing](docs/TESTING.md)
- [User stories and acceptance criteria](docs/USER_STORIES.md)
- [Deployment](docs/DEPLOYMENT.md), [contributor workflow](CONTRIBUTING.md), and [retrospective template](docs/RETROSPECTIVE_TEMPLATE.md)
- [Image sources and usage](docs/ASSETS.md)

GitHub Actions is configured to install, migrate, seed, format-check, type-check, lint, test, build, and run isolated browser workflows. A workflow file is not evidence of a successful remote CI run. No push or merge is performed by local setup.

## Known limitations

- Academic sample inventory, not licensed MLS/IDX integration. No verified brokerage profile or contact details.
- Email delivery, appointment booking, maps/geocoding, and real estate feed imports are not implemented.
- Uploaded files need a persistent writable volume. Removed images remain on disk for recovery; automatic orphan cleanup is not implemented.
- SQLite is a local/single-host choice. PostgreSQL and object storage require the documented adapter and schema changes; these deployment paths are not verified here.
- Inquiries contain personal contact data; the operator must establish access, deletion, backup, and retention practices before collecting real customer information. No automated inquiry deletion is enabled.
- Analytics summarize at most the latest 10,000 events in 30 days, use approximate browser-session deduplication, and do not represent unique visitors. Retention requires scheduling the prune command.
- Authentication provides administrator-only roles, eight-hour sessions, and account revocation. MFA and self-service password recovery are not implemented.
- Browser automation covers desktop and mobile Chromium, not every browser or assistive technology.

## Team members

- Anabel Diaz
- Ethan Vincent
- Jake Madison
- Twumasi Adomako
- Cole Beiermann
- Gage Heithold

Individual contributions are not attributed without documented evidence. The retrospective is a template for the team's own sprint observations.
