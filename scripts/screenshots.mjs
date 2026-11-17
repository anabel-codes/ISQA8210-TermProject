import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
const browser = await chromium.launch({ headless: true });
const directory = '.artifacts/visual';
const base = process.env.PREVIEW_URL || 'http://localhost:3000';
await mkdir(directory, { recursive: true });
try {
  for (const [name, width, height] of [
    ['desktop', 1440, 1050],
    ['mobile', 390, 844],
  ]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    // Visual captures must not be counted as genuine engagement.
    await page.route('**/api/events', (route) => route.fulfill({ json: { success: true } }));
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    for (const [route, label] of [
      ['/', 'home'],
      ['/properties/sample-prairie', 'detail'],
    ]) {
      await page.goto(new URL(route, base).href, { waitUntil: 'networkidle' });
      await page.screenshot({ path: `${directory}/${label}-${name}.png`, fullPage: true });
      console.log(
        `${label}-${name}`,
        JSON.stringify({
          errors,
          overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
        }),
      );
    }
    await page.close();
  }
} finally {
  await browser.close();
}
