import { passwordSchema } from '../src/lib/password';
import 'dotenv/config';
import { z } from 'zod';
import { hash } from 'bcryptjs';
import { db } from '../src/lib/db';
async function main() {
  const env = z
    .object({ ADMIN_EMAIL: z.email(), ADMIN_PASSWORD: passwordSchema })
    .parse(process.env);
  if (!process.env.NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET.length < 32)
    throw new Error('Set NEXTAUTH_SECRET to at least 32 random characters first');
  const email = env.ADMIN_EMAIL.toLowerCase();
  if (await db.user.findUnique({ where: { email } }))
    throw new Error('Account already exists; use the protected Users screen to reset it');
  await db.user.create({
    data: {
      email,
      name: process.env.ADMIN_NAME || 'Site administrator',
      passwordHash: await hash(env.ADMIN_PASSWORD, 12),
    },
  });
  console.log(
    'Administrator created. Remove ADMIN_PASSWORD from your environment after initialization.',
  );
}
main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : 'Initialization failed');
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
