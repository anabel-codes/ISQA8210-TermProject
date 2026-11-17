import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

function storage() {
  if (process.env.MEDIA_STORAGE !== 'supabase') {
    if (process.env.VERCEL) throw new Error('Vercel requires MEDIA_STORAGE=supabase');
    return null;
  }
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Configure server-only Supabase storage credentials');
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  }).storage.from(process.env.SUPABASE_STORAGE_BUCKET || 'property-media');
}

export async function writeMedia(name: string, data: Buffer) {
  const bucket = storage();
  if (bucket) {
    const { error } = await bucket.upload(name, data, { contentType: 'image/webp', upsert: false });
    if (error) throw new Error('Photo storage is unavailable');
    return;
  }
  const root = process.env.MEDIA_ROOT || path.join(process.cwd(), '.data/media');
  await mkdir(root, { recursive: true });
  await writeFile(path.join(root, name), data);
}

export async function readMedia(name: string): Promise<Uint8Array | null> {
  const bucket = storage();
  if (bucket) {
    const { data, error } = await bucket.download(name);
    if (error) {
      if ('statusCode' in error && String(error.statusCode) === '404') return null;
      // Storage may report a missing object as a 400 with this error code.
      if ('code' in error && error.code === 'NoSuchKey') return null;
      throw new Error('Photo storage is unavailable');
    }
    return new Uint8Array(await data.arrayBuffer());
  }
  try {
    return new Uint8Array(
      await readFile(
        path.join(process.env.MEDIA_ROOT || path.join(process.cwd(), '.data/media'), name),
      ),
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw error;
  }
}
