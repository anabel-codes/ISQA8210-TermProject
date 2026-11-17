import { createHmac } from 'node:crypto';
import { db } from './db';
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export function requireSameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin || origin !== new URL(process.env.NEXTAUTH_URL || request.url).origin)
    throw new HttpError(403, 'Invalid request origin');
}
export function clientKey(request: Request, scope: string) {
  const ip =
    process.env.TRUST_PROXY === 'true'
      ? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
      : 'local';
  return createHmac('sha256', process.env.NEXTAUTH_SECRET || 'local-rate-limit')
    .update(`${scope}:${ip}`)
    .digest('hex');
}
export async function limit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const bucket = Math.floor(now / windowMs);
  const row = await db.rateLimit.upsert({
    where: { key: `${key}:${bucket}` },
    create: { key: `${key}:${bucket}`, count: 1, expiresAt: new Date((bucket + 1) * windowMs) },
    update: { count: { increment: 1 } },
  });
  if (row.count > max) throw new HttpError(429, 'Too many attempts. Please try again later.');
}
