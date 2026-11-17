import { db } from './db';
export const defaultSettings = {
  name: 'Carlos Kosala',
  email: '',
  phone: '',
  business: 'Carlos Kosala Real Estate',
  biography:
    'A thoughtful approach to finding your next place. This academic demonstration brings property discovery and personal service together. Realtor biography and business details are awaiting confirmation.',
  heroTitle: 'A place to call your own.',
  heroSubtitle: 'Explore spaces, imagine possibilities, and find a home for your next chapter.',
};
export async function getSettings() {
  const rows = await db.siteSetting.findMany();
  return {
    ...defaultSettings,
    ...Object.fromEntries(rows.map((r) => [r.key, r.value])),
  } as typeof defaultSettings;
}
