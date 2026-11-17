import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { settingsSchema } from '@/lib/validation';
import { handle, readJson } from '@/lib/http';
import { requireSameOrigin } from '@/lib/security';
export async function PUT(request: Request) {
  return handle(async () => {
    requireSameOrigin(request);
    await requireAdmin();
    const input = settingsSchema.parse(await readJson(request));
    await db.$transaction(
      Object.entries(input).map(([key, value]) =>
        db.siteSetting.upsert({ where: { key }, create: { key, value }, update: { value } }),
      ),
    );
    return Response.json({ success: true });
  });
}
