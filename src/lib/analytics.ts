import { db } from './db';
export const eventKinds = ['VIEW', 'SEARCH', 'FEATURED', 'INQUIRY'] as const;
export async function recordEvent(
  kind: (typeof eventKinds)[number],
  dedupeKey: string,
  propertyId?: string,
  data: Record<string, string | number | boolean> = {},
) {
  return db.analyticsEvent.upsert({
    where: { dedupeKey },
    create: {
      kind,
      dedupeKey,
      propertyId,
      data: JSON.stringify(data),
      test: process.env.APP_TEST_MODE === 'true',
    },
    update: {},
  });
}
export async function analyticsSummary() {
  const since = new Date(Date.now() - 30 * 86400000);
  const events = await db.analyticsEvent.findMany({
    where: { test: process.env.APP_TEST_MODE === 'true', createdAt: { gte: since } },
    orderBy: { createdAt: 'desc' },
    take: 10000,
    include: { property: { select: { id: true, title: true } } },
  });
  const counts: Record<string, number> = { VIEW: 0, SEARCH: 0, FEATURED: 0, INQUIRY: 0 };
  const popular: Record<string, number> = {};
  const views: Record<string, { title: string; count: number }> = {};
  const days: Record<string, number> = {};
  const filters: Record<string, number> = {};
  for (const e of events) {
    counts[e.kind] = (counts[e.kind] ?? 0) + 1;
    if (e.kind === 'SEARCH') {
      const data = JSON.parse(e.data);
      const q = String(data.q || 'All locations');
      popular[q] = (popular[q] ?? 0) + 1;
      for (const k of Object.keys(data)) {
        if (k !== 'q' && k !== 'page' && k !== 'sort' && data[k] !== '' && data[k] !== false)
          filters[k] = (filters[k] ?? 0) + 1;
      }
    }
    if (e.kind === 'VIEW' && e.property) {
      views[e.property.id] ??= { title: e.property.title, count: 0 };
      views[e.property.id].count++;
    }
    if (e.kind === 'INQUIRY') {
      const day = e.createdAt.toISOString().slice(0, 10);
      days[day] = (days[day] ?? 0) + 1;
    }
  }
  return {
    counts,
    popular: Object.entries(popular)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10),
    views: Object.values(views)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
    days,
    filters,
    total: events.length,
  };
}
