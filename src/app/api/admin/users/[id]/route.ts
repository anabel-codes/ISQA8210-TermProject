import { passwordSchema } from '@/lib/password';
import { z } from 'zod';
import { hash } from 'bcryptjs';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { handle, readJson } from '@/lib/http';
import { requireSameOrigin, HttpError } from '@/lib/security';
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    requireSameOrigin(request);
    const actor = await requireAdmin();
    const { id } = await params;
    const input = z
      .object({ active: z.boolean().optional(), password: passwordSchema.optional() })
      .parse(await readJson(request));
    if (actor.id === id && input.active === false)
      throw new HttpError(400, 'You cannot deactivate your own account');
    await db.user.update({
      where: { id },
      data: {
        ...(input.active !== undefined ? { active: input.active } : {}),
        ...(input.password ? { passwordHash: await hash(input.password, 12) } : {}),
        sessionVersion: { increment: 1 },
      },
    });
    return Response.json({ success: true });
  });
}
