import { db } from './db';
import { parseSearch, searchWhere, searchOrder, type Query } from './search';
import { propertySchema } from './validation';
export const imageInclude = {
  images: { orderBy: [{ primary: 'desc' as const }, { position: 'asc' as const }] },
  features: true,
};
export async function findProperties(query: Query, admin = false) {
  const search = parseSearch(query);
  const where = searchWhere(search, admin);
  const total = await db.property.count({ where });
  const pages = Math.max(1, Math.ceil(total / 9));
  const page = Math.min(search.page, pages);
  const items = await db.property.findMany({
    where,
    orderBy: searchOrder(search.sort),
    skip: (page - 1) * 9,
    take: 9,
    include: imageInclude,
  });
  return { items, total, page, pages, search };
}
export async function saveProperty(input: unknown, id?: string, agentId?: string) {
  const parsed = propertySchema.parse(input);
  const { price, images, features, ...values } = parsed;
  const data = {
    ...values,
    bedrooms: values.bedrooms ?? null,
    bathrooms: values.bathrooms ?? null,
    sqft: values.sqft ?? null,
    lotSize: values.lotSize ?? null,
    lotUnit: values.lotUnit ?? null,
    yearBuilt: values.yearBuilt ?? null,
    latitude: values.latitude ?? null,
    longitude: values.longitude ?? null,
    priceCents: Math.round(price * 100),
    ...(agentId ? { agentId } : {}),
    images: {
      create: images.map((i, position) => ({
        ...i,
        position,
        primary: i.primary || (!images.some((x) => x.primary) && position === 0),
      })),
    },
    features: { create: [...new Set(features)].map((name) => ({ name })) },
  };
  return db.$transaction(async (tx) => {
    if (id) {
      await tx.propertyImage.deleteMany({ where: { propertyId: id } });
      await tx.propertyFeature.deleteMany({ where: { propertyId: id } });
      return tx.property.update({ where: { id }, data });
    }
    return tx.property.create({ data });
  });
}
