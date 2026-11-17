import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { saveProperty } from '@/lib/properties';
import { handle, readJson } from '@/lib/http';
import { requireSameOrigin, HttpError } from '@/lib/security';
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    requireSameOrigin(request);
    await requireAdmin();
    const { id } = await params;
    const item = await saveProperty(await readJson(request), id);
    return Response.json({ id: item.id });
  });
}
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    requireSameOrigin(request);
    await requireAdmin();
    const { id } = await params;
    const body = await readJson(request);
    if (body.confirm !== id) throw new HttpError(400, 'Deletion confirmation required');
    await db.property.delete({ where: { id } });
    return Response.json({ success: true });
  });
}
