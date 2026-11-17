import { z } from 'zod';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { handle, readJson } from '@/lib/http';
import { requireSameOrigin } from '@/lib/security';
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    requireSameOrigin(request);
    await requireAdmin();
    const input = z
      .object({ status: z.enum(['NEW', 'CONTACTED', 'RESOLVED']), notes: z.string().max(5000) })
      .parse(await readJson(request));
    await db.inquiry.update({ where: { id: (await params).id }, data: input });
    return Response.json({ success: true });
  });
}
