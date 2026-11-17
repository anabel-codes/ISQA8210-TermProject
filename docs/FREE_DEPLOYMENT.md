# Free academic demo: Vercel and Supabase

This workflow hosts the Next.js application on **Vercel Hobby** and stores PostgreSQL data and photographs on **Supabase Free**. No paid Render service or disk is needed. Both accounts must be created and connected by the operator. Code and CI checks alone do not establish a live deployment.

Vercel Hobby is for personal, noncommercial use. Use this workflow for the class demonstration, with clearly labeled fictional inventory; a live commercial realtor site needs an appropriate plan. Supabase Free currently includes a 500 MB database and 1 GB of object storage, with bandwidth limits, and may pause after a week of inactivity. Review the dashboards before a presentation and resume a paused project there. Stay on the free plans; no payment or Pro trial is required by this workflow.

## 1. Create the free accounts

- Sign up at <https://vercel.com/signup> with GitHub; select **Hobby / personal**.
- Sign up at <https://supabase.com/dashboard/sign-up>, create a **Free** organization/project, and save the generated database password securely.
- Do not deploy the old SQLite-only app to Vercel. Wait until the free-hosting changes are merged into main.

## 2. Configure Supabase storage and connections

1. In Supabase **Storage**, create a **private** bucket called `property-media`. Allow `image/webp`; a 10 MB bucket object limit leaves room for encoded output. No public insert, update, delete, or select policies are needed. The app uploads through its authenticated administrator route and serves photos through `/uploads/<random-name>.webp` using its server credential.
2. Under **Connect**, copy the **Transaction pooler** PostgreSQL URL (port 6543) for `DATABASE_URL`, and the **Session pooler** URL (port 5432) for `DIRECT_URL`. Use the database password, URL-encoded if it contains special characters. These are different from API keys. Follow Supabase's current connection/TLS instructions, using trusted TLS (`sslmode=verify-full`) and `pgbouncer=true` for the transaction URL. Do not disable certificate verification.
3. Under project API settings, copy the project URL and the server-side legacy **service_role** key for storage. This is a privileged secret, not the anon/publishable key. Keep it in server-only environment variables. The app continues to use NextAuth for administrator login; Supabase Auth does not need configuration.

The PostgreSQL migration enables row-level security on all application tables, including accounts and inquiries, with no public policies. Use the server database owner connection from Supabase's Connect panel, or a dedicated server role configured following its Prisma guide. Browser clients must never receive database URLs or the service-role key.

## 3. Initialize the new hosted database from a clean checkout

Use a clean checkout of the merged main branch. The original local project contains uncommitted work; do not overwrite it or reset it to main. A separate clone avoids interfering with that work.

Create an ignored `.env.production.local` file at the checkout root with these values. Replace each placeholder with the actual account value; never commit this file or paste its contents into chat:

```dotenv
DATABASE_URL="postgresql://...transaction-pooler:6543/postgres?pgbouncer=true&sslmode=verify-full"
DIRECT_URL="postgresql://...session-pooler:5432/postgres?sslmode=verify-full"
NEXTAUTH_URL="https://your-chosen-project.vercel.app"
NEXTAUTH_SECRET="a-random-secret-at-least-32-characters"
MEDIA_STORAGE="supabase"
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-server-only-service-role-key"
SUPABASE_STORAGE_BUCKET="property-media"
TRUST_PROXY="false"
```

Generate the session secret with `openssl rand -base64 48`. Use the exact project domain chosen in Vercel and correct it before deployment if Vercel assigns another domain. Do not include `ADMIN_PASSWORD` in Vercel's environment.

With Node 22.12+:

```bash
npm ci
node --env-file=.env.production.local scripts/generate-client.mjs
node --env-file=.env.production.local node_modules/prisma/build/index.js migrate deploy
```

This selects the PostgreSQL schema and its independent migration directory. It creates an empty hosted application database and does not transfer or delete the local SQLite database. Apply migrations only to a new dedicated Supabase project. Existing databases need backup and schema review first.

For a class demo, optionally add clearly labeled fictional inventory:

```bash
node --env-file=.env.production.local --import tsx prisma/seed.ts
```

Create the first administrator without placing the password in command history:

```bash
read -rp 'Admin email: ' ADMIN_EMAIL
read -rsp 'New admin password: ' ADMIN_PASSWORD; echo
export ADMIN_EMAIL ADMIN_PASSWORD
node --env-file=.env.production.local --import tsx scripts/create-admin.ts
unset ADMIN_EMAIL ADMIN_PASSWORD
```

Use a unique password of 12–72 characters, at most 72 UTF-8 bytes. Do not run tests against the Supabase database. When returning this checkout to local SQLite development, run `npm run db:generate` using the local SQLite environment to select the matching generated client again.

## 4. Deploy from Vercel

1. Choose **Add New > Project** and import the public GitHub repository `anabel-codes/ISQA8210-TermProject`. Grant access through the GitHub account that can access it. Use the root directory, the **Next.js** framework preset, **Node.js 22.x**, and production branch **main**.
2. Copy the environment variables above into **Production** environment settings. Mark credentials sensitive. Do not use `NEXT_PUBLIC_` prefixes. `DIRECT_URL` is needed for manual migration commands, not the running app; it can remain local rather than being copied to Vercel.
3. Confirm the detected build command is `npm run build:vercel`, supplied by `vercel.json`. This validates the hosted settings and generates the PostgreSQL client before building. Builds do not automatically migrate or seed the live database. Apply reviewed migrations separately before deploying changes that need them.
4. Deploy and open the assigned HTTPS production URL. Correct `NEXTAUTH_URL` to this exact origin if necessary, then redeploy. A custom domain is optional; the included `vercel.app` domain is public and free.
5. For public class access, check **Deployment Protection** and ensure visitors can access the production domain without a Vercel account. Open the production URL in a signed-out/private browser window to verify.

The checked-in Git configuration enables automatic deployments only for main. Do not assign production database/storage secrets to previews; use a separate disposable project if preview deployments are later enabled. Main changes still need reviewed migrations and passing CI before rollout.

## 5. Verify and maintain

- Browse the homepage, property search, detail pages and contact page while signed out.
- Submit a test inquiry, sign in at `/login`, and confirm it appears in administration.
- Upload a photo under **4 MB**, create a draft, publish it, and verify the public image. Vercel's function payload limit requires the smaller upload cap; the app encodes the image to WebP.
- Redeploy the same commit and verify the listing, inquiry, and uploaded image still exist. These belong to Supabase, not Vercel's temporary disk.
- Back up data and media before later migrations. A code rollback does not undo database changes. The free plan has limits; monitor usage and avoid real customer information in an academic demo.
- Run retention maintenance daily from the secure checkout using `node --env-file=.env.production.local --import tsx scripts/prune.ts`, or configure a Supabase scheduled job with equivalent deletion rules. It removes analytics older than 90 days and expired rate-limit entries. Inquiry deletion remains an operator decision.
- Before presentations, check that the Supabase Free project is active. Do not depend on it for uninterrupted commercial service.

## Verification boundaries

The SQLite CI job verifies local behavior. A separate disposable PostgreSQL CI job applies the actual PostgreSQL migration, runs service/media tests, checks row-level isolation, builds, and runs desktop/mobile browser workflows. Supabase storage tests cover SDK upload/download handling with a test double; live account credentials, private bucket permissions, pooled TLS connections and public deployment still need the smoke checks above after account creation.

References: [Vercel Hobby](https://vercel.com/docs/plans/hobby), [Supabase Free](https://supabase.com/pricing), [Supabase Prisma connections](https://supabase.com/docs/guides/database/prisma), [Vercel function limits](https://vercel.com/docs/functions/limitations), [Vercel Git deployment controls](https://vercel.com/docs/project-configuration/git-configuration).
