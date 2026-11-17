import 'dotenv/config';
import { db } from '../src/lib/db';
async function main() {
  const result = await db.analyticsEvent.deleteMany({
    where: { createdAt: { lt: new Date(Date.now() - 90 * 86400000) } },
  });
  const rates = await db.rateLimit.deleteMany({ where: { expiresAt: { lt: new Date() } } });
  console.log(
    `Removed ${result.count} old analytics events and ${rates.count} expired rate buckets.`,
  );
}
main()
  .catch(() => {
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
