import { randomUUID } from 'node:crypto';
import { db } from '@/lib/db';
import { inquirySchema } from '@/lib/validation';
import { handle, readJson } from '@/lib/http';
import { requireSameOrigin, limit, clientKey, HttpError } from '@/lib/security';
export async function POST(request: Request) {
  return handle(async () => {
    requireSameOrigin(request);
    await limit(clientKey(request, 'inquiry'), 5, 15 * 60000);
    const input = inquirySchema.parse(await readJson(request));
    if (
      input.propertyId &&
      !(await db.property.findFirst({ where: { id: input.propertyId, published: true } }))
    )
      throw new HttpError(404, 'Listing unavailable');
    await db.$transaction(async (tx) => {
      const inquiry = await tx.inquiry.create({
        data: {
          name: input.name,
          email: input.email,
          phone: input.phone || null,
          message: input.message,
          propertyId: input.propertyId || null,
        },
      });
      await tx.analyticsEvent.create({
        data: {
          kind: 'INQUIRY',
          propertyId: input.propertyId || null,
          dedupeKey: randomUUID(),
          test: process.env.APP_TEST_MODE === 'true',
        },
      });
      return inquiry;
    });
    return Response.json({ success: true }, { status: 201 });
  });
}
