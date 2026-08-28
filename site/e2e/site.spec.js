import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve } from 'node:path';

const siteRoot = resolve(process.cwd(), 'dist/site');
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

async function startVersionedSite() {
  const [index, worker] = await Promise.all([
    readFile(resolve(siteRoot, 'index.html'), 'utf8'),
    readFile(resolve(siteRoot, 'sw.js'), 'utf8'),
  ]);
  const scriptPath = index.match(/<script[^>]+src="(\/assets\/[^\"]+\.js)"/)?.[1];
  const cacheName = worker.match(/const CACHE = '([^']+)';/)?.[1];
  if (!scriptPath || !cacheName) throw new Error('The built site does not contain a versioned worker and entry script.');

  const futureScriptPath = scriptPath.replace(/\.js$/, '-future.js');
  const futureIndex = index
    .replace(scriptPath, futureScriptPath)
    .replace('Folder Recipe</span>', 'Updated Folder Recipe</span>');
  const futureWorker = worker
    .replace(cacheName, 'folder-recipe-future-release')
    .replaceAll(scriptPath, futureScriptPath);
  let futureRelease = false;

  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
      if (pathname === '/__switch-release') {
        futureRelease = true;
        response.writeHead(204).end();
        return;
      }
      if (pathname === '/') {
        response.writeHead(200, { 'Content-Type': contentTypes['.html'], 'Cache-Control': 'no-cache' }).end(futureRelease ? futureIndex : index);
        return;
      }
      if (pathname === '/sw.js') {
        response.writeHead(200, { 'Content-Type': contentTypes['.js'], 'Cache-Control': 'no-cache', 'Service-Worker-Allowed': '/' }).end(futureRelease ? futureWorker : worker);
        return;
      }
      if (futureRelease && pathname === futureScriptPath) {
        response.writeHead(200, { 'Content-Type': contentTypes['.js'], 'Cache-Control': 'public, max-age=31536000, immutable' }).end(await readFile(resolve(siteRoot, scriptPath.slice(1))));
        return;
      }

      const file = resolve(siteRoot, `.${pathname}`);
      if (!file.startsWith(`${siteRoot}/`)) throw new Error('Invalid path');
      const details = await stat(file);
      const resolvedFile = details.isDirectory() ? resolve(file, 'index.html') : file;
      response.writeHead(200, { 'Content-Type': contentTypes[extname(resolvedFile)] ?? 'application/octet-stream' }).end(await readFile(resolvedFile));
    } catch {
      response.writeHead(404).end();
    }
  });
  await new Promise((resolveServer) => server.listen(0, '127.0.0.1', resolveServer));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Could not start versioned-site fixture.');
  return {
    origin: `http://127.0.0.1:${address.port}`,
    futureScriptPath,
    close: () => new Promise((resolveServer, reject) => server.close((error) => error ? reject(error) : resolveServer())),
  };
}

test('sample manifest works with keyboard and has no serious accessibility issues', async ({ page }) => {
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
  await page.getByRole('button', { name: 'Try the sample recipe file' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'August portraits' })).toBeVisible();
  await expect(page.getByText('Portrait neutral v3').last()).toBeVisible();

  const scan = await new AxeBuilder({ page }).analyze();
  const serious = scan.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical');
  expect(serious).toEqual([]);
  expect(errors).toEqual([]);
});

test('invalid recipe files produce an actionable error', async ({ page }) => {
  await page.goto('/#inspect');
  await page.locator('#manifest-file').setInputFiles({
    name: '.photo-recipe.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{"schema_version":2}'),
  });
  await expect(page.getByRole('heading', { name: 'Check this recipe file' })).toBeVisible();
  await expect(page.getByText(/Schema version 2 is not supported/)).toBeVisible();
});

test('legal pages and offline shell remain reachable', async ({ page, context }) => {
  await page.goto('/privacy/');
  await expect(page.getByRole('heading', { name: 'Privacy for your photo folders' })).toBeVisible();
  await page.goto('/');
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  await page.evaluate(() => window.dispatchEvent(new Event('offline')));
  await expect(page.getByText(/Offline\. The demo/)).toBeVisible();
  await page.evaluate(() => window.dispatchEvent(new Event('online')));
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('main')).toBeVisible();
});

test('first screen explains the job and demo route restores focus after Back', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Save photo editor profiles beside folders' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
  await expect(page.getByText('For photographers mixing shoots and editors')).toBeVisible();
  if (testInfo.project.name === 'mobile-390') {
    for (const text of ['Runs locally without a network connection', 'Does not change photos', 'Free under the MIT License']) {
      const box = await page.getByText(text, { exact: true }).boundingBox();
      expect(box?.y).toBeLessThan(844);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  }
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveTitle('Demo — Folder Recipe');
  await expect(page.locator('h1')).toBeFocused();
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { name: 'Save photo editor profiles beside folders' })).toBeFocused();
  await expect(page.locator('#route-announcer')).not.toBeEmpty();
});

test('route metadata, shared shell, and designed 404 are present', async ({ page }) => {
  for (const [path, title] of [['/demo/', 'Demo — Folder Recipe'], ['/privacy/', 'Privacy — Folder Recipe'], ['/terms/', 'Terms — Folder Recipe']]) {
    await page.goto(path);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
    await expect(page.getByText('Built by Param Factory')).toBeVisible();
  }
  await page.goto('/404.html');
  await expect(page).toHaveTitle('Page not found — Folder Recipe');
  await expect(page.getByRole('heading', { name: 'This page has no recipe' })).toBeVisible();
});

test('static routes restore heading focus and announcement after Back', async ({ page }) => {
  await page.goto('/privacy/');
  await page.getByRole('link', { name: 'Demo' }).click();
  await expect(page.getByRole('heading', { name: 'Check saved profiles in a sample shoot' })).toBeFocused();
  await page.goBack();
  await expect(page).toHaveURL(/\/privacy\/$/);
  await expect(page.getByRole('heading', { name: 'Privacy for your photo folders' })).toBeFocused();
  await expect(page.locator('#route-announcer')).not.toBeEmpty();
});

test('a controlled client adopts a future shell and asset graph without clearing site data', async ({ page }) => {
  const fixture = await startVersionedSite();
  const requests = [];
  page.on('request', (request) => requests.push(new URL(request.url()).pathname));
  try {
    await page.goto(fixture.origin);
    await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
    await expect(page.getByText('Folder Recipe', { exact: true }).first()).toBeVisible();

    await page.request.get(`${fixture.origin}/__switch-release`);
    await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready;
      const controllerChanged = new Promise((resolveChange) => navigator.serviceWorker.addEventListener('controllerchange', resolveChange, { once: true }));
      await registration.update();
      await Promise.race([controllerChanged, new Promise((resolveTimeout) => window.setTimeout(resolveTimeout, 3_000))]);
    });
    await page.reload();

    await expect(page.getByText('Updated Folder Recipe', { exact: true }).first()).toBeVisible();
    expect(requests).toContain(fixture.futureScriptPath);
  } finally {
    await fixture.close();
  }
});
