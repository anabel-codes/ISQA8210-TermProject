import { spawnSync } from 'node:child_process';

if (!/^postgres(ql)?:/.test(process.env.DATABASE_URL || ''))
  throw new Error('Set the Supabase PostgreSQL DATABASE_URL');
if (process.env.MEDIA_STORAGE !== 'supabase')
  throw new Error('Set MEDIA_STORAGE=supabase for persistent photo uploads');
for (const key of [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
]) {
  if (!process.env[key]) throw new Error(`Set the server-only ${key} environment variable`);
}
if (!process.env.NEXTAUTH_URL.startsWith('https://'))
  throw new Error('NEXTAUTH_URL must match the public HTTPS origin');
if (process.env.NEXTAUTH_SECRET.length < 32) throw new Error('Use a random session secret');
// Apply reviewed migrations separately; preview builds must never mutate live data.
const result = spawnSync('npm', ['run', 'build'], { stdio: 'inherit', env: process.env });
process.exit(result.status ?? 1);
