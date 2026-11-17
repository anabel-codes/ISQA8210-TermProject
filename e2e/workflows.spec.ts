import { test, expect } from '@playwright/test';
import { db } from '../src/lib/db';
test.afterAll(() => db.$disconnect());
async function login(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.getByLabel('Email address', { exact: true }).fill(process.env.ADMIN_EMAIL!);
  await page.getByLabel('Password', { exact: true }).fill(process.env.ADMIN_PASSWORD!);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).toHaveURL('/admin');
}
test('public discovery, filters, sorting, gallery, and persisted inquiry', async ({
  page,
}, info) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('A place to call your own.');
  await expect(page.locator('.property-card')).toHaveCount(3);
  await expect(page.locator('.hero-visual img')).toBeVisible();
  await page.locator('.hero-search input[name=q]').fill('Omaha');
  await page.getByRole('button', { name: 'Find your place' }).click();
  await expect(page).toHaveURL(/q=Omaha/);
  await expect(page.locator('.property-card').first()).toBeVisible();
  await page.getByLabel('Max price ($)', { exact: true }).fill('300000');
  await page.getByLabel('Sort by', { exact: true }).selectOption('price-asc');
  await page.getByRole('button', { name: 'Apply filters' }).click();
  await expect(page.locator('.property-card')).toHaveCount(3);
  await expect(page.locator('.card-price').first()).toContainText('$1');
  await expect(page.locator('.property-card').first()).toContainText('The Cardboard Box');
  await page.getByRole('link', { name: 'View The City Nest', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The City Nest');
  await page.getByRole('button', { name: /View photograph 2/ }).click();
  await expect(page.locator('.gallery-count')).toHaveText('2 / 2');
  const email = `visitor-${info.project.name}@example.test`;
  await page.getByLabel('Your name').fill('Browser Sample Visitor');
  await page.getByLabel('Email address', { exact: true }).fill(email);
  await page
    .getByLabel('How can we help?')
    .fill('I would like to learn more about this sample property.');
  await page.getByRole('button', { name: 'Send inquiry' }).click();
  await expect(page.getByRole('heading', { name: 'Thank you for reaching out.' })).toBeVisible();
  await expect.poll(() => db.inquiry.count({ where: { email } })).toBe(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});
test('protected administration, create/edit/publish, images, inquiries, analytics, settings, and logout', async ({
  page,
}, info) => {
  await page.goto('/admin');
  await expect(page).toHaveURL('/login');
  const denied = await page.request.post('/api/admin/properties', {
    headers: { origin: 'http://localhost:3100' },
    data: {},
  });
  expect(denied.status()).toBe(401);
  await login(page);
  await page.goto('/admin/listings/new');
  const title = `Browser ${info.project.name} sample`;
  await page.getByLabel('Listing title').fill(title);
  await page.getByLabel('Street address').fill('100 Test Example Lane');
  await page.getByLabel('City', { exact: true }).fill('Omaha');
  await page.getByLabel('ZIP code').fill('68102');
  await page.getByLabel('Price ($)', { exact: true }).fill('399000');
  await page.getByLabel('Bedrooms', { exact: true }).fill('3');
  await page.getByLabel('Bathrooms', { exact: true }).fill('2');
  await page
    .getByLabel('Description', { exact: true })
    .fill(
      'This fictional property exists only for isolated browser verification of the application.',
    );
  await page.getByLabel('Upload photograph').setInputFiles('public/images/home-1.jpg');
  await expect(page.getByLabel('Photograph 1 alt text')).toBeVisible();
  await page.getByLabel('Photograph 1 alt text').fill('Fictional property photograph');
  await page.getByLabel('Published publicly').check();
  await page.getByLabel('Featured on homepage').check();
  await page.getByRole('button', { name: 'Save listing', exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/listings\/[a-z0-9]+$/);
  await page.getByLabel('Price ($)', { exact: true }).fill('405000');
  await page.getByRole('button', { name: 'Save listing', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Listing saved');
  const record = await db.property.findFirstOrThrow({
    where: { title },
    include: { images: true },
  });
  const photo = await page.request.get(record.images[0].url);
  expect(photo.status()).toBe(200);
  expect(photo.headers()['content-type']).toContain('image/webp');
  await page.goto(`/properties/${record.id}`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
  await expect(page.locator('.detail-price')).toContainText('$405,000');
  await expect
    .poll(() => db.analyticsEvent.count({ where: { kind: 'VIEW', propertyId: record.id } }))
    .toBeGreaterThan(0);
  await page.getByLabel('Your name').fill('Admin Workflow Visitor');
  await page
    .getByLabel('Email address', { exact: true })
    .fill(`admin-flow-${info.project.name}@example.test`);
  await page.getByRole('button', { name: 'Send inquiry' }).click();
  await expect(page.getByRole('status')).toContainText('Thank you');
  await page.goto(`/admin/inquiries?q=admin-flow-${info.project.name}`);
  await expect(page.locator('.inquiry-record')).toHaveCount(1);
  await page.getByLabel('Status', { exact: true }).last().selectOption('CONTACTED');
  await page.getByLabel('Internal notes').fill('Reviewed in browser test.');
  await page.getByRole('button', { name: 'Save inquiry' }).click();
  await expect(page.getByRole('status')).toContainText('Inquiry updated');
  await page.goto('/admin/analytics');
  await expect(page.getByRole('heading', { name: 'Interest, in perspective.' })).toBeVisible();
  await expect(page.locator('.metric').first()).not.toContainText(/^Property views0$/);
  await page.goto('/admin/settings');
  await page.getByLabel('Contact phone (optional)').fill('');
  await page.getByRole('button', { name: 'Save settings' }).click();
  await expect(page.getByRole('status')).toContainText('Settings saved');
  await page.goto('/admin/users');
  await expect(page.getByRole('heading', { name: 'Your trusted team.' })).toBeVisible();
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await expect(page).toHaveURL('/login');
  await page.goto('/admin/listings');
  await expect(page).toHaveURL('/login');
});
test('draft privacy, direct routes, mobile navigation, and empty states', async ({
  page,
}, info) => {
  await page.goto('/properties/sample-draft');
  await expect(page.getByRole('heading', { name: 'This page isn’t available.' })).toBeVisible();
  await page.goto('/properties?q=NoMatchingPlace');
  await expect(page.getByRole('heading', { name: 'No properties match just yet.' })).toBeVisible();
  await page.goto('/about');
  await expect(page.getByRole('heading', { name: 'Meet Carlos Kosala.' })).toBeVisible();
  if (info.project.name === 'mobile') {
    await page.getByRole('button', { name: 'Open navigation' }).click();
    await page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'Contact', exact: true })
      .click();
  } else
    await page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'Contact', exact: true })
      .click();
  await expect(page).toHaveURL('/contact');
  await expect(page.getByRole('heading', { name: 'Good things start with hello.' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});
