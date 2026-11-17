import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
const dir = mkdtempSync(join(tmpdir(), 'ck-e2e-'));
const env = {
  ...process.env,
  DATABASE_URL: process.env.TEST_DATABASE_URL || `file:${dir}/test.db`,
  DIRECT_URL: process.env.TEST_DATABASE_URL || `file:${dir}/test.db`,
  MEDIA_STORAGE: 'local',
  NEXTAUTH_URL: 'http://localhost:3100',
  NEXTAUTH_SECRET: randomBytes(48).toString('base64'),
  ADMIN_EMAIL: 'browser-admin@example.test',
  ADMIN_PASSWORD: randomBytes(24).toString('hex'),
  APP_TEST_MODE: 'true',
  MEDIA_ROOT: join(dir, 'media'),
};
const commands = [
  ['node_modules/prisma/build/index.js', 'migrate', 'deploy'],
  ['--import', 'tsx', 'prisma/seed.ts'],
  ['--import', 'tsx', 'scripts/create-admin.ts'],
  ['node_modules/@playwright/test/cli.js', 'test', ...process.argv.slice(2)],
];
for (const args of commands) {
  const result = spawnSync(process.execPath, args, { env, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
