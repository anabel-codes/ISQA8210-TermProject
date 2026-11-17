import { ZodError } from 'zod';
import { HttpError } from './security';
import { Prisma } from '@prisma/client';
export async function handle(fn: () => Promise<Response>) {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof ZodError)
      return Response.json(
        { error: e.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ') },
        { status: 400 },
      );
    if (e instanceof HttpError) return Response.json({ error: e.message }, { status: e.status });
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2025') return Response.json({ error: 'Record not found' }, { status: 404 });
      if (e.code === 'P2002')
        return Response.json({ error: 'A record with that value already exists' }, { status: 409 });
    }
    if (e instanceof SyntaxError)
      return Response.json({ error: 'Invalid request body' }, { status: 400 });
    console.error('Request failed', e instanceof Error ? e.name : 'Unknown error');
    return Response.json({ error: 'Unable to complete this request' }, { status: 500 });
  }
}
export async function readLimitedBody(request: Request, maximum: number) {
  if (Number(request.headers.get('content-length')) > maximum)
    throw new HttpError(413, 'Request too large');
  const reader = request.body?.getReader();
  if (!reader) return new Uint8Array();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maximum) {
      await reader.cancel();
      throw new HttpError(413, 'Request too large');
    }
    chunks.push(value);
  }
  const body = new Uint8Array(size);
  let position = 0;
  for (const chunk of chunks) {
    body.set(chunk, position);
    position += chunk.byteLength;
  }
  return body;
}
export async function readJson(request: Request) {
  return JSON.parse(new TextDecoder().decode(await readLimitedBody(request, 100000)));
}
