import { readMedia } from '@/lib/media';
export const runtime = 'nodejs';
export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (!/^[a-f0-9-]+\.webp$/.test(file)) return new Response('Not found', { status: 404 });
  try {
    const data = await readMedia(file);
    if (!data) return new Response('Not found', { status: 404 });
    return new Response(data as BodyInit, {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new Response('Photo storage is unavailable', { status: 503 });
  }
}
