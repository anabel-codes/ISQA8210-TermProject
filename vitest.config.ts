import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
const directory = mkdtempSync(path.join(tmpdir(), 'ck-unit-'));
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || `file:${directory}/test.db`;
process.env.DIRECT_URL = process.env.DATABASE_URL;
process.env.NEXTAUTH_SECRET = 'unit-test-only-secret-for-isolated-tests';
process.env.APP_TEST_MODE = 'true';
process.env.NEXTAUTH_URL = 'http://localhost:3000';
export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: {
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    globalSetup: ['./tests/global-setup.ts'],
    fileParallelism: false,
    maxWorkers: 1,
  },
});
