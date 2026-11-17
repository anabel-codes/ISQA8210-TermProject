import { z } from 'zod';
export const statuses = ['ACTIVE', 'PENDING', 'SOLD', 'OFF_MARKET'] as const;
export const propertyTypes = ['HOUSE', 'CONDO', 'TOWNHOUSE', 'LAND'] as const;
const optionalNumber = (schema: z.ZodNumber) =>
  z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
    schema.optional(),
  );
export const imageSchema = z.object({
  url: z
    .string()
    .max(1000)
    .refine(
      (v) =>
        /^\/uploads\/[a-f0-9-]+\.webp$/.test(v) ||
        /^\/images\/[a-zA-Z0-9-]+\.(svg|webp|jpg)$/.test(v) ||
        /^https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+(\?[^\s]*)?$/.test(v),
      'Use an uploaded image or approved Unsplash image',
    ),
  alt: z.string().trim().min(3).max(200),
  primary: z.boolean().default(false),
});
export const propertySchema = z
  .object({
    title: z.string().trim().min(3).max(160),
    street: z.string().trim().min(3).max(160),
    city: z.string().trim().min(2).max(80),
    state: z
      .string()
      .trim()
      .regex(/^[A-Z]{2}$/, 'Use a two-letter state code'),
    zip: z.string().regex(/^\d{5}(-\d{4})?$/),
    price: z.coerce
      .number()
      .positive()
      .max(20000000)
      .refine(
        (v) => Math.abs(v * 100 - Math.round(v * 100)) < 0.0001,
        'Use at most two decimal places',
      ),
    type: z.enum(propertyTypes),
    status: z.enum(statuses),
    published: z.boolean().default(false),
    featured: z.boolean().default(false),
    sample: z.boolean().default(false),
    bedrooms: optionalNumber(z.number().int().min(0).max(100)),
    bathrooms: optionalNumber(z.number().min(0).max(100)),
    sqft: optionalNumber(z.number().int().positive().max(10000000)),
    lotSize: optionalNumber(z.number().positive()),
    lotUnit: z.enum(['ACRES', 'SQFT']).optional(),
    yearBuilt: optionalNumber(
      z
        .number()
        .int()
        .min(1600)
        .max(new Date().getFullYear() + 5),
    ),
    latitude: optionalNumber(z.number().min(-90).max(90)),
    longitude: optionalNumber(z.number().min(-180).max(180)),
    description: z.string().trim().min(30).max(15000),
    features: z.array(z.string().trim().min(1).max(80)).max(40),
    images: z.array(imageSchema).max(30),
  })
  .superRefine((v, ctx) => {
    if (v.published && !v.images.length)
      ctx.addIssue({
        code: 'custom',
        path: ['images'],
        message: 'Published listings require a photograph',
      });
    if (v.images.filter((i) => i.primary).length > 1)
      ctx.addIssue({ code: 'custom', path: ['images'], message: 'Select only one primary image' });
  });
export const inquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(254),
  phone: z
    .string()
    .trim()
    .max(40)
    .regex(/^[+\d\s().-]*$/)
    .optional(),
  message: z.string().trim().min(10).max(5000),
  propertyId: z.string().max(100).optional(),
  website: z.string().max(0).optional(),
});
export const settingsSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.union([z.email(), z.literal('')]),
  phone: z.string().max(40),
  business: z.string().max(160),
  biography: z.string().max(4000),
  heroTitle: z.string().min(5).max(120),
  heroSubtitle: z.string().max(300),
});
export type PropertyInput = z.infer<typeof propertySchema>;
