import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ upload: vi.fn(), download: vi.fn(), createClient: vi.fn() }));
vi.mock('@supabase/supabase-js', () => ({ createClient: mocks.createClient }));
import { readMedia, writeMedia } from '../src/lib/media';
import { GET } from '../src/app/uploads/[file]/route';

beforeEach(() => {
  vi.stubEnv('MEDIA_STORAGE', 'supabase');
  vi.stubEnv('SUPABASE_URL', 'https://example.supabase.co');
  vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'server-only-test-key');
  mocks.createClient.mockReturnValue({
    storage: { from: () => ({ upload: mocks.upload, download: mocks.download }) },
  });
  mocks.upload.mockResolvedValue({ error: null });
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});
describe('persistent photo storage', () => {
  it('uploads encoded bytes without overwriting existing objects', async () => {
    const bytes = Buffer.from('webp');
    await writeMedia('abc.webp', bytes);
    expect(mocks.upload).toHaveBeenCalledWith('abc.webp', bytes, {
      contentType: 'image/webp',
      upsert: false,
    });
    expect(mocks.createClient).toHaveBeenCalledWith(
      'https://example.supabase.co',
      'server-only-test-key',
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
  });
  it('serves private storage objects through the existing public image route', async () => {
    mocks.download.mockResolvedValue({ data: new Blob(['image-bytes']), error: null });
    const response = await GET(new Request('https://example.test/uploads/abc.webp'), {
      params: Promise.resolve({ file: 'abc.webp' }),
    });
    expect(response.status).toBe(200);
    expect(await response.text()).toBe('image-bytes');
    expect(response.headers.get('content-type')).toBe('image/webp');
  });
  it('rejects path traversal before contacting storage', async () => {
    const response = await GET(new Request('https://example.test/uploads/invalid'), {
      params: Promise.resolve({ file: '../site.db' }),
    });
    expect(response.status).toBe(404);
    expect(mocks.download).not.toHaveBeenCalled();
  });
  it('returns 404 for absent objects and 503 for storage outages', async () => {
    mocks.download.mockResolvedValue({ data: null, error: { statusCode: '404' } });
    expect(await readMedia('abc.webp')).toBeNull();
    mocks.download.mockResolvedValue({ data: null, error: { statusCode: '503' } });
    const response = await GET(new Request('https://example.test/uploads/abc.webp'), {
      params: Promise.resolve({ file: 'abc.webp' }),
    });
    expect(response.status).toBe(503);
  });
  it('does not report success when upload storage fails', async () => {
    mocks.upload.mockResolvedValue({ error: { message: 'upstream private diagnostic' } });
    await expect(writeMedia('abc.webp', Buffer.from('image'))).rejects.toThrow(
      'Photo storage is unavailable',
    );
  });
  it('requires storage configuration and prevents Vercel filesystem fallback', async () => {
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', '');
    await expect(writeMedia('abc.webp', Buffer.from('image'))).rejects.toThrow(
      'Configure server-only',
    );
    vi.stubEnv('MEDIA_STORAGE', 'local');
    vi.stubEnv('VERCEL', '1');
    await expect(writeMedia('abc.webp', Buffer.from('image'))).rejects.toThrow(
      'Vercel requires MEDIA_STORAGE=supabase',
    );
  });
});
