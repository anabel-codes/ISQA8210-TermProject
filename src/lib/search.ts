import { Prisma } from '@prisma/client';
import { propertyTypes, statuses } from './validation';
export type Query = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
export function parseSearch(input: Query) {
  const get = (k: string) => (first(input[k]) ?? '').trim();
  const num = (k: string, max = 20000000) => {
    const raw = get(k);
    const v = Number(raw);
    return raw !== '' && Number.isFinite(v) && v >= 0 ? Math.min(v, max) : undefined;
  };
  let min = num('min'),
    max = num('max');
  if (min !== undefined && max !== undefined && min > max) [min, max] = [max, min];
  let minSqft = num('minSqft', 10000000),
    maxSqft = num('maxSqft', 10000000);
  if (minSqft !== undefined && maxSqft !== undefined && minSqft > maxSqft)
    [minSqft, maxSqft] = [maxSqft, minSqft];
  return {
    q: get('q').slice(0, 100),
    min,
    max,
    bedrooms: num('bedrooms', 100),
    bathrooms: num('bathrooms', 100),
    minSqft,
    maxSqft,
    type: propertyTypes.find((t) => t === get('type')),
    status: statuses.find((t) => t === get('status')),
    featured: get('featured') === 'true',
    sort: ['price-asc', 'price-desc', 'newest', 'oldest', 'size'].includes(get('sort'))
      ? get('sort')
      : 'newest',
    page: Math.max(1, Math.min(10000, Math.floor(num('page', 10000) ?? 1))),
  };
}
export type Search = ReturnType<typeof parseSearch>;
export function searchWhere(s: Search, admin = false): Prisma.PropertyWhereInput {
  return {
    ...(admin ? {} : { published: true }),
    ...(s.q
      ? {
          OR: [
            { city: { contains: s.q } },
            { street: { contains: s.q } },
            { title: { contains: s.q } },
            { zip: { contains: s.q } },
          ],
        }
      : {}),
    ...(s.type ? { type: s.type } : {}),
    ...(s.status ? { status: s.status } : {}),
    ...(s.featured ? { featured: true } : {}),
    priceCents: {
      ...(s.min !== undefined ? { gte: Math.round(s.min * 100) } : {}),
      ...(s.max !== undefined ? { lte: Math.round(s.max * 100) } : {}),
    },
    ...(s.bedrooms !== undefined ? { bedrooms: { gte: Math.floor(s.bedrooms) } } : {}),
    ...(s.bathrooms !== undefined ? { bathrooms: { gte: s.bathrooms } } : {}),
    ...(s.minSqft !== undefined || s.maxSqft !== undefined
      ? {
          sqft: {
            ...(s.minSqft !== undefined ? { gte: Math.ceil(s.minSqft) } : {}),
            ...(s.maxSqft !== undefined ? { lte: Math.floor(s.maxSqft) } : {}),
          },
        }
      : {}),
  };
}
export function searchOrder(sort: string): Prisma.PropertyOrderByWithRelationInput[] {
  const orders: Record<string, Prisma.PropertyOrderByWithRelationInput> = {
    'price-asc': { priceCents: 'asc' },
    'price-desc': { priceCents: 'desc' },
    newest: { createdAt: 'desc' },
    oldest: { createdAt: 'asc' },
    size: { sqft: 'desc' },
  };
  return [orders[sort] ?? orders.newest, { id: 'asc' }];
}
