import { z } from 'zod';
import { db } from '@/lib/db';
import { recordEvent } from '@/lib/analytics';
import { parseSearch } from '@/lib/search';
import { handle, readJson } from '@/lib/http';
import { requireSameOrigin, limit, clientKey, HttpError } from '@/lib/security';
const schema = z.object({
  kind: z.enum(['VIEW', 'SEARCH', 'FEATURED']),
  propertyId: z.string().max(100).optional(),
  key: z.string().uuid(),
  query: z.record(z.string().max(50), z.string().max(100)).optional(),
});
export async function POST(request: Request) {
  return handle(async () => {
    requireSameOrigin(request);
    await limit(clientKey(request, 'events'), 120, 60000);
    const input = schema.parse(await readJson(request));
    if (input.kind !== 'SEARCH' && !input.propertyId) throw new HttpError(400, 'Listing required');
    if (
      input.propertyId &&
      !(await db.property.findFirst({ where: { id: input.propertyId, published: true } }))
    )
      throw new HttpError(404, 'Listing unavailable');
    const data: Record<string, string | number | boolean> = {};
    if (input.kind === 'SEARCH') {
      const s = parseSearch(input.query ?? {});
      for (const [k, v] of Object.entries(s)) if (v !== undefined) data[k] = v;
    }
    await recordEvent(input.kind, input.key, input.propertyId, data);
    return Response.json({ success: true });
  });
}
