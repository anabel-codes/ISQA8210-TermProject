import { requireAdmin } from '@/lib/auth';
import { saveProperty } from '@/lib/properties';
import { handle, readJson } from '@/lib/http';
import { requireSameOrigin } from '@/lib/security';
export async function POST(request: Request) {
  return handle(async () => {
    requireSameOrigin(request);
    const user = await requireAdmin();
    const item = await saveProperty(await readJson(request), undefined, user.id);
    return Response.json({ id: item.id }, { status: 201 });
  });
}
