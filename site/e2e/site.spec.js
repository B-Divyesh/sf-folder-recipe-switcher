import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('sample manifest works with keyboard and has no serious accessibility issues', async ({ page }) => {
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
  await page.getByRole('button', { name: 'Or load the portrait sample' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'August portraits' })).toBeVisible();
  await expect(page.getByText('Portrait neutral v3').last()).toBeVisible();

  const scan = await new AxeBuilder({ page }).analyze();
  const serious = scan.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical');
  expect(serious).toEqual([]);
  expect(errors).toEqual([]);
});

test('invalid manifests produce an actionable error', async ({ page }) => {
  await page.goto('/#inspect');
  await page.locator('#manifest-file').setInputFiles({
    name: '.photo-recipe.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{"schema_version":2}'),
  });
  await expect(page.getByRole('heading', { name: 'Check this manifest' })).toBeVisible();
  await expect(page.getByText(/Schema version 2 is not supported/)).toBeVisible();
});

test('legal pages and offline shell remain reachable', async ({ page, context }) => {
  await page.goto('/privacy/');
  await expect(page.getByRole('heading', { name: 'Privacy, kept local.' })).toBeVisible();
  await page.goto('/');
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  await page.evaluate(() => window.dispatchEvent(new Event('offline')));
  await expect(page.getByText(/Offline\. The docs/)).toBeVisible();
  await page.evaluate(() => window.dispatchEvent(new Event('online')));
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('main')).toBeVisible();
});
