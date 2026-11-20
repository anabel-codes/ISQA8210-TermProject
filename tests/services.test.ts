import { passwordSchema } from '../src/lib/password';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
vi.mock('next-auth', () => ({ getServerSession: vi.fn() }));
import { getServerSession } from 'next-auth';
import { db } from '../src/lib/db';
import { parseSearch, searchWhere, searchOrder } from '../src/lib/search';
import { propertySchema, inquirySchema } from '../src/lib/validation';
import { findProperties, saveProperty } from '../src/lib/properties';
import { requireAdmin } from '../src/lib/auth';
import { recordEvent, analyticsSummary } from '../src/lib/analytics';
import { limit, requireSameOrigin } from '../src/lib/security';
import { readJson } from '../src/lib/http';
import { compare } from 'bcryptjs';
import { randomBytes } from 'node:crypto';
import { POST as createUser } from '../src/app/api/admin/users/route';
import { PATCH as patchUser } from '../src/app/api/admin/users/[id]/route';
import { POST as inquiryPost } from '../src/app/api/inquiries/route';
import { POST as listingPost } from '../src/app/api/admin/properties/route';
import { POST as eventPost } from '../src/app/api/events/route';
const input = {
  title: 'Test sample home',
  street: '100 Example Lane',
  city: 'Omaha',
  state: 'NE',
  zip: '68102',
  price: 123456.78,
  type: 'HOUSE',
  status: 'ACTIVE',
  published: true,
  featured: true,
  sample: true,
  bedrooms: 3,
  bathrooms: 2,
  sqft: 1800,
  description: 'A fictional property used for isolated service integration tests.',
  features: ['Garage', 'Garden'],
  images: [{ url: '/images/home-1.jpg', alt: 'Illustrative home', primary: true }],
};
let id: string;
beforeAll(async () => {
  id = (await saveProperty(input)).id;
  await saveProperty({
    ...input,
    title: 'Bellevue draft',
    city: 'Bellevue',
    price: 200000,
    published: false,
  });
  await saveProperty({
    ...input,
    title: 'Higher priced home',
    price: 300000,
    bedrooms: 4,
    sqft: 2500,
  });
});
afterAll(() => db.$disconnect());
describe('validation', () => {
  it('rejects passwords exceeding bcrypt byte limits', () => {
    expect(passwordSchema.safeParse('a'.repeat(73)).success).toBe(false);
    expect(passwordSchema.safeParse('é'.repeat(37)).success).toBe(false);
    expect(passwordSchema.safeParse('A longer sample passphrase').success).toBe(true);
  });
  it('preserves cents and accepts unavailable optional details', () => {
    expect(propertySchema.parse({ ...input, sqft: '', bedrooms: '' }).sqft).toBeUndefined();
    expect(propertySchema.parse(input).price).toBe(123456.78);
  });
  it('rejects negative price, invalid coordinates, and fractional cents', () => {
    for (const data of [{ price: -1 }, { latitude: 91 }, { price: 1.001 }, { bedrooms: 2.5 }])
      expect(propertySchema.safeParse({ ...input, ...data }).success).toBe(false);
  });
  it('requires an image to publish but permits image-free drafts', () => {
    expect(propertySchema.safeParse({ ...input, images: [] }).success).toBe(false);
    expect(propertySchema.safeParse({ ...input, images: [], published: false }).success).toBe(true);
  });
  it('rejects unsafe image URLs and multiple primary photographs', () => {
    expect(
      propertySchema.safeParse({
        ...input,
        images: [{ url: 'javascript:alert(1)', alt: 'Unsafe' }],
      }).success,
    ).toBe(false);
    expect(
      propertySchema.safeParse({ ...input, images: [...input.images, ...input.images] }).success,
    ).toBe(false);
  });
  it('validates inquiries and the honeypot', () => {
    expect(inquirySchema.safeParse({ name: 'A', email: 'bad', message: 'short' }).success).toBe(
      false,
    );
    expect(
      inquirySchema.safeParse({
        name: 'Sample Visitor',
        email: 'visitor@example.test',
        message: 'I would like more information.',
        website: 'spam',
      }).success,
    ).toBe(false);
  });
});
describe('database search and publication', () => {
  it('normalizes swapped price and size ranges and invalid pagination', () => {
    const s = parseSearch({
      min: '500',
      max: '100',
      page: 'NaN',
      minSqft: '2000',
      maxSqft: '1000',
    });
    expect(s).toMatchObject({ min: 100, max: 500, page: 1, minSqft: 1000, maxSqft: 2000 });
    expect(parseSearch({ min: 'bad', sort: 'SQL', type: 'bad' }).min).toBeUndefined();
  });
  it('constructs validated numerical filters with integer money', () => {
    const where = searchWhere(
      parseSearch({
        min: '123456.78',
        max: '300000',
        bedrooms: '3',
        bathrooms: '2',
        featured: 'true',
      }),
    );
    expect(where).toMatchObject({
      published: true,
      priceCents: { gte: 12345678, lte: 30000000 },
      bedrooms: { gte: 3 },
      bathrooms: { gte: 2 },
      featured: true,
    });
  });
  it('does not expose unpublished records to public search', async () => {
    expect((await findProperties({ q: 'Bellevue' })).total).toBe(0);
    expect((await findProperties({ q: 'Bellevue' }, true)).total).toBe(1);
  });
  it('filters against persisted price, bedrooms, size, and city', async () => {
    const result = await findProperties({
      q: 'Omaha',
      max: '150000',
      bedrooms: '3',
      minSqft: '1700',
    });
    expect(result.items.map((p) => p.id)).toEqual([id]);
    expect((await findProperties({ minSqft: '2000' })).total).toBe(1);
  });
  it('sorts in both price directions and by size', async () => {
    expect((await findProperties({ sort: 'price-asc' })).items[0].id).toBe(id);
    expect((await findProperties({ sort: 'price-desc' })).items[0].priceCents).toBe(30000000);
    expect((await findProperties({ sort: 'size' })).items[0].sqft).toBe(2500);
    expect(searchOrder('oldest')[0]).toEqual({ createdAt: 'asc' });
  });
  it('clears optional numerical details instead of retaining stale values', async () => {
    await saveProperty({ ...input, bedrooms: '', sqft: '' }, id);
    const p = await db.property.findUniqueOrThrow({ where: { id } });
    expect(p.bedrooms).toBeNull();
    expect(p.sqft).toBeNull();
    await saveProperty(input, id);
  });
  it('updates images and features atomically and can unpublish', async () => {
    await saveProperty({ ...input, published: false, features: ['Patio'] }, id);
    expect((await findProperties({ max: '150000' })).total).toBe(0);
    expect(await db.propertyFeature.count({ where: { propertyId: id } })).toBe(1);
    await saveProperty(input, id);
  });
});
describe('authorization and abuse controls', () => {
  it('denies unauthenticated administrative service calls', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);
    await expect(requireAdmin()).rejects.toMatchObject({ status: 401 });
    const res = await listingPost(
      new Request('http://localhost:3000/api/admin/properties', {
        method: 'POST',
        headers: { origin: 'http://localhost:3000', 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      }),
    );
    expect(res.status).toBe(401);
  });
  it('checks account state and session revocation in the database', async () => {
    const user = await db.user.create({
      data: {
        email: 'admin@example.test',
        name: 'Test administrator',
        passwordHash: 'not-used',
        sessionVersion: 2,
      },
    });
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: user.id, version: 2 } });
    expect((await requireAdmin()).id).toBe(user.id);
    await db.user.update({ where: { id: user.id }, data: { sessionVersion: 3 } });
    await expect(requireAdmin()).rejects.toMatchObject({ status: 401 });
    vi.mocked(getServerSession).mockResolvedValue(null);
  });
  it('rejects cross-origin mutations', () => {
    expect(() =>
      requireSameOrigin(
        new Request('http://localhost:3000', { headers: { origin: 'https://attacker.test' } }),
      ),
    ).toThrow('Invalid request origin');
  });
  it('rate limits persistently across calls', async () => {
    await limit('unit-limiter', 1, 60000);
    await expect(limit('unit-limiter', 1, 60000)).rejects.toMatchObject({ status: 429 });
  });
});
describe('inquiry persistence and analytics', () => {
  it('stores inquiries and their event in one transaction', async () => {
    const res = await inquiryPost(
      new Request('http://localhost:3000/api/inquiries', {
        method: 'POST',
        headers: { origin: 'http://localhost:3000', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Demo Visitor',
          email: 'visitor@example.test',
          message: 'Please tell me more about this sample home.',
          propertyId: id,
        }),
      }),
    );
    expect(res.status).toBe(201);
    expect(await db.inquiry.count({ where: { propertyId: id, status: 'NEW' } })).toBe(1);
    expect(await db.analyticsEvent.count({ where: { kind: 'INQUIRY' } })).toBe(1);
  });
  it('rejects inquiries for unpublished properties', async () => {
    const draft = await db.property.findFirstOrThrow({ where: { published: false } });
    const res = await inquiryPost(
      new Request('http://localhost:3000/api/inquiries', {
        method: 'POST',
        headers: { origin: 'http://localhost:3000', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Demo Visitor',
          email: 'visitor@example.test',
          message: 'Please tell me more about this sample home.',
          propertyId: draft.id,
        }),
      }),
    );
    expect(res.status).toBe(404);
  });
  it('deduplicates and aggregates actual observations', async () => {
    await recordEvent('VIEW', 'view-1', id);
    await recordEvent('VIEW', 'view-1', id);
    await recordEvent('SEARCH', 'search-1', undefined, { q: 'Omaha', bedrooms: 3 });
    await db.analyticsEvent.create({ data: { kind: 'VIEW', dedupeKey: 'genuine-1', test: false } });
    const summary = await analyticsSummary();
    expect(summary.counts.VIEW).toBe(1);
    expect(summary.popular).toEqual([['Omaha', 1]]);
    expect(summary.filters.bedrooms).toBe(1);
    expect(summary.views[0].count).toBe(1);
  });
  it('drops unrecognized analytics fields and never stores message contents', async () => {
    const res = await eventPost(
      new Request('http://localhost:3000/api/events', {
        method: 'POST',
        headers: { origin: 'http://localhost:3000', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'SEARCH',
          key: crypto.randomUUID(),
          query: { q: 'Omaha', password: 'secret', message: 'private' },
        }),
      }),
    );
    expect(res.status).toBe(200);
    const event = await db.analyticsEvent.findFirstOrThrow({
      where: { kind: 'SEARCH' },
      orderBy: { createdAt: 'desc' },
    });
    expect(event.data).not.toContain('private');
    expect(event.data).not.toContain('secret');
  });
  it('preserves inquiries when a listing is removed', async () => {
    await db.property.delete({ where: { id } });
    const inquiry = await db.inquiry.findFirstOrThrow({ where: { email: 'visitor@example.test' } });
    expect(inquiry.propertyId).toBeNull();
    expect(await db.propertyImage.count({ where: { propertyId: id } })).toBe(0);
  });
});

describe('account management and request limits', () => {
  it('creates hashed accounts, prevents self-deactivation, and revokes disabled accounts', async () => {
    const actor = await db.user.create({
      data: { email: 'owner@example.test', name: 'Test owner', passwordHash: 'not-used' },
    });
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: actor.id, version: 0 } });
    const password = randomBytes(24).toString('hex');
    const request = (path: string, method: string, body: unknown) =>
      new Request(`http://localhost:3000${path}`, {
        method,
        headers: { origin: 'http://localhost:3000', 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    expect(
      (
        await createUser(
          request('/api/admin/users', 'POST', {
            email: 'second@example.test',
            name: 'Second administrator',
            password,
          }),
        )
      ).status,
    ).toBe(201);
    const account = await db.user.findUniqueOrThrow({ where: { email: 'second@example.test' } });
    expect(account.passwordHash).not.toBe(password);
    expect(await compare(password, account.passwordHash)).toBe(true);
    expect(
      (
        await patchUser(request(`/api/admin/users/${actor.id}`, 'PATCH', { active: false }), {
          params: Promise.resolve({ id: actor.id }),
        })
      ).status,
    ).toBe(400);
    expect(
      (
        await patchUser(request(`/api/admin/users/${account.id}`, 'PATCH', { active: false }), {
          params: Promise.resolve({ id: account.id }),
        })
      ).status,
    ).toBe(200);
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: account.id, version: 0 } });
    await expect(requireAdmin()).rejects.toMatchObject({ status: 401 });
    vi.mocked(getServerSession).mockResolvedValue(null);
  });
  it('caps JSON bodies before processing oversized input', async () => {
    await expect(
      readJson(
        new Request('http://localhost:3000', {
          method: 'POST',
          body: JSON.stringify({ value: 'x'.repeat(100001) }),
        }),
      ),
    ).rejects.toMatchObject({ status: 413 });
  });
});
