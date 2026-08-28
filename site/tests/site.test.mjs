import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const builtSite = new URL('../../dist/site/', import.meta.url);
const run = promisify(execFile);

test('landing page has required semantic structure', async () => {
  const html = await readFile(new URL('index.html', root), 'utf8');
  assert.match(html, /<html lang="en">/);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.equal((html.match(/<main\b/g) ?? []).length, 1);
  assert.match(html, /<title>[^<]+<\/title>/);
  assert.match(html, /archive-room\.webp[^>]+alt="[^"]+"/);
  assert.doesNotMatch(html, /https:\/\/(fonts|cdn\.|unpkg|jsdelivr)/);
});

test('privacy and terms are static routes', async () => {
  for (const route of ['privacy', 'terms']) {
    const html = await readFile(new URL(`public/${route}/index.html`, root), 'utf8');
    assert.match(html, /<main\b/);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
    assert.match(html, /rel="canonical"/);
    assert.match(html, /property="og:image"/);
    assert.match(html, /Built by Param Factory/);
  }
});

test('reduced motion and focus treatment are explicit', async () => {
  const css = await readFile(new URL('src/style.css', root), 'utf8');
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /:focus-visible/);
});

test('route scripts restore heading focus and announce browser history navigation', async () => {
  const [app, staticRoutes] = await Promise.all([
    readFile(new URL('src/main.ts', root), 'utf8'),
    readFile(new URL('public/route.js', root), 'utf8'),
  ]);
  for (const source of [app, staticRoutes]) {
    assert.match(source, /getEntriesByType\(['"]navigation['"]\)/);
    assert.match(source, /back_forward/);
    assert.match(source, /focusHeading|title\.focus/);
    assert.match(source, /announcer\.textContent|routeAnnouncer\.textContent/);
  }
});

test('built site versions its service worker and declares immutable asset caching', async () => {
  const [worker, index, headers, staticWebAppConfig] = await Promise.all([
    readFile(new URL('sw.js', builtSite), 'utf8'),
    readFile(new URL('index.html', builtSite), 'utf8'),
    readFile(new URL('_headers', builtSite), 'utf8'),
    readFile(new URL('staticwebapp.config.json', builtSite), 'utf8'),
  ]);
  const assets = [...index.matchAll(/(?:src|href)="(\/assets\/[^\"]+)"/g)].map((match) => match[1]);

  assert.match(worker, /const CACHE = 'folder-recipe-[a-f0-9]{16}';/);
  assert.doesNotMatch(worker, /folder-recipe-v1/);
  assert.match(worker, /request\.mode === 'navigate'/);
  assert.match(worker, /return await fetch\(request\);/);
  assert.match(worker, /caches\.match\(request\).*caches\.match\('\/'\)/s);
  for (const asset of assets) assert.match(worker, new RegExp(asset.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

  assert.match(headers, /\/assets\/\*\n  Cache-Control: public, max-age=31536000, immutable/);
  assert.match(headers, /\/sw\.js\n  Cache-Control: no-cache/);
  assert.match(headers, /\/\n  Cache-Control: public, max-age=0, must-revalidate/);
  const config = JSON.parse(staticWebAppConfig);
  assert.equal(config.globalHeaders['X-Frame-Options'], 'DENY');
  assert.match(config.globalHeaders['Content-Security-Policy'], /frame-ancestors 'none'/);
  assert.match(config.globalHeaders['Permissions-Policy'], /camera=\(\)/);
  assert.deepEqual(config.responseOverrides['404'], { rewrite: '/404.html', statusCode: 404 });
  assert.equal(config.routes.find(({ route }) => route === '/assets/*').headers['Cache-Control'], 'public, max-age=31536000, immutable');
});

test('a shell change produces a different service-worker revision', async () => {
  const indexUrl = new URL('index.html', builtSite);
  const workerUrl = new URL('sw.js', builtSite);
  const [originalIndex, originalWorker] = await Promise.all([
    readFile(indexUrl, 'utf8'),
    readFile(workerUrl, 'utf8'),
  ]);
  try {
    await writeFile(indexUrl, originalIndex.replace('Folder Recipe saves editor profiles beside photo folders.', 'Folder Recipe release updated.'));
    await run('node', ['scripts/build-site.mjs'], { cwd: process.cwd() });
    const nextWorker = await readFile(workerUrl, 'utf8');
    assert.notEqual(nextWorker.match(/const CACHE = '([^']+)'/)?.[1], originalWorker.match(/const CACHE = '([^']+)'/)?.[1]);
  } finally {
    await Promise.all([writeFile(indexUrl, originalIndex), writeFile(workerUrl, originalWorker)]);
  }
});
