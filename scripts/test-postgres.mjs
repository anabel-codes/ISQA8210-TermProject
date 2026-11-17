import { randomBytes } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import pg from 'pg';

// This command needs a disposable local/CI PostgreSQL server with CREATE DATABASE.
const connectionString = process.env.POSTGRES_TEST_SERVER;
if (!connectionString) throw new Error('Set POSTGRES_TEST_SERVER to a disposable test server');
const admin = new pg.Client({ connectionString });
await admin.connect();
const suffix = randomBytes(8).toString('hex');
const databases = [`isqa_unit_${suffix}`, `isqa_browser_${suffix}`];
function run(args, url, overrides = {}) {
  const env = {
    ...process.env,
    DATABASE_URL: url,
    DIRECT_URL: url,
    TEST_DATABASE_URL: url,
    MEDIA_STORAGE: 'local',
    NEXTAUTH_URL: 'http://localhost:3000',
    NEXTAUTH_SECRET: randomBytes(48).toString('hex'),
    RUST_LOG: 'info',
    ...overrides,
  };
  const result = spawnSync(process.execPath, args, { env, stdio: 'inherit' });
  if (result.status !== 0) throw new Error(`Verification failed: ${args.join(' ')}`);
}
async function verifyPublicIsolation(url) {
  const client = new pg.Client({ connectionString: url });
  const role = `isqa_public_${suffix}`;
  await client.connect();
  try {
    const tables = await client.query(
      "SELECT relname FROM pg_class JOIN pg_namespace ON pg_namespace.oid = relnamespace WHERE nspname = 'public' AND relkind = 'r' AND NOT relrowsecurity",
    );
    if (tables.rows.length) throw new Error('Every application table must enable row security');
    await client.query(`CREATE ROLE "${role}" NOLOGIN NOSUPERUSER NOBYPASSRLS`);
    await client.query(`GRANT USAGE ON SCHEMA public TO "${role}"`);
    await client.query(`GRANT SELECT ON ALL TABLES IN SCHEMA public TO "${role}"`);
    await client.query(`SET ROLE "${role}"`);
    for (const table of ['User', 'Inquiry']) {
      const result = await client.query(`SELECT count(*) FROM "${table}"`);
      if (Number(result.rows[0].count) !== 0)
        throw new Error('Public roles must not read private data');
    }
    console.log('PostgreSQL row security prevents public access to accounts and inquiries.');
  } finally {
    await client.query('RESET ROLE');
    await client.query(`DROP OWNED BY "${role}"`);
    await client.query(`DROP ROLE "${role}"`);
    await client.end();
  }
}
try {
  const urls = [];
  for (const name of databases) {
    await admin.query(`CREATE DATABASE "${name}"`);
    const url = new URL(connectionString);
    url.pathname = `/${name}`;
    urls.push(url.toString());
  }
  run(['scripts/generate-client.mjs'], urls[0]);
  run(['node_modules/vitest/vitest.mjs', 'run'], urls[0]);
  await verifyPublicIsolation(urls[0]);
  run(['scripts/vercel-build.mjs'], urls[0], {
    VERCEL: '1',
    MEDIA_STORAGE: 'supabase',
    SUPABASE_URL: 'https://example.supabase.co',
    SUPABASE_SERVICE_ROLE_KEY: 'build-test-only-not-a-live-key',
    NEXTAUTH_URL: 'https://example.test',
  });
  run(['scripts/e2e.mjs'], urls[1]);
} finally {
  for (const name of databases) await admin.query(`DROP DATABASE IF EXISTS "${name}" WITH (FORCE)`);
  await admin.end();
}
