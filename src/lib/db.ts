import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaPg } from '@prisma/adapter-pg';
const url = process.env.DATABASE_URL || 'file:./prisma/dev.db';
if (process.env.VERCEL && !/^postgres(ql)?:/.test(url))
  throw new Error('Vercel requires a persistent PostgreSQL DATABASE_URL');
const globalDb = globalThis as unknown as { prisma?: PrismaClient };
export const db =
  globalDb.prisma ??
  new PrismaClient({
    adapter: /^postgres(ql)?:/.test(url)
      ? new PrismaPg({ connectionString: url, max: 2 })
      : new PrismaBetterSqlite3({ url }),
  });
if (process.env.NODE_ENV !== 'production') globalDb.prisma = db;
