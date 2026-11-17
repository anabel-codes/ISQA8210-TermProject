import { passwordSchema } from '@/lib/password';
import { z } from 'zod';
import { hash } from 'bcryptjs';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { handle, readJson } from '@/lib/http';
import { requireSameOrigin } from '@/lib/security';
export async function POST(request: Request) {
  return handle(async () => {
    requireSameOrigin(request);
    await requireAdmin();
    const input = z
      .object({
        email: z.email().max(254),
        name: z.string().trim().min(2).max(100),
        password: passwordSchema,
      })
      .parse(await readJson(request));
    await db.user.create({
      data: {
        email: input.email.toLowerCase(),
        name: input.name,
        passwordHash: await hash(input.password, 12),
      },
    });
    return Response.json({ success: true }, { status: 201 });
  });
}
