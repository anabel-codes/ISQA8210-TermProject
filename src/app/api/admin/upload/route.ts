import { randomUUID } from 'node:crypto';
import { writeMedia } from '@/lib/media';
import sharp from 'sharp';
import { requireAdmin } from '@/lib/auth';
import { handle, readLimitedBody } from '@/lib/http';
import { requireSameOrigin, limit, HttpError } from '@/lib/security';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  return handle(async () => {
    requireSameOrigin(request);
    const user = await requireAdmin();
    await limit(`uploads:${user.id}`, 30, 60000);
    const bytes = await readLimitedBody(request, 4.25 * 1024 * 1024);
    let form: FormData;
    try {
      form = await new Response(bytes as BodyInit, {
        headers: { 'Content-Type': request.headers.get('content-type') || '' },
      }).formData();
    } catch {
      throw new HttpError(400, 'Invalid upload form');
    }
    const file = form.get('file');
    if (
      !(file instanceof File) ||
      file.size > 4 * 1024 * 1024 ||
      !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
    )
      throw new HttpError(400, 'Choose a JPEG, PNG, or WebP under 4 MB');
    let output: Buffer;
    try {
      output = await sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 40000000 })
        .rotate()
        .resize({ width: 2000, withoutEnlargement: true })
        .webp({ quality: 85 })
        .toBuffer();
    } catch {
      throw new HttpError(400, 'The image could not be decoded');
    }
    const name = `${randomUUID()}.webp`;
    await writeMedia(name, output);
    return Response.json({ url: `/uploads/${name}` }, { status: 201 });
  });
}
