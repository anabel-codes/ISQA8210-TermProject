import 'dotenv/config';
import { defineConfig } from 'prisma/config';
const postgres = /^postgres(ql)?:/.test(process.env.DATABASE_URL || '');
export default defineConfig({
  schema: postgres ? 'prisma/schema.postgresql.prisma' : 'prisma/schema.prisma',
  migrations: { path: postgres ? 'prisma/migrations-postgresql' : 'prisma/migrations' },
  datasource: {
    url: (postgres && process.env.DIRECT_URL) || process.env.DATABASE_URL || 'file:./prisma/dev.db',
  },
});
