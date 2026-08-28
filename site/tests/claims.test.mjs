import assert from 'node:assert/strict';
import { execFile as execFileCallback, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { mkdtemp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { extname, join, resolve } from 'node:path';
import { promisify } from 'node:util';
import { after, before, test } from 'node:test';
import { chromium } from 'playwright';

const execFile = promisify(execFileCallback);
const root = resolve(import.meta.dirname, '../..');
const siteRoot = resolve(root, 'dist/site');
const binary = resolve(root, `dist/bin/folder-recipe${process.platform === 'win32' ? '.exe' : ''}`);
const contentTypes = { '.css': 'text/css', '.html': 'text/html', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.xml': 'application/xml' };
let server;
let origin;
let browser;

before(async () => {
  server = createServer(async (request, response) => {
    const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
    let relative = pathname === '/' ? 'index.html' : pathname.replace(/^\//, '');
    if (relative === 'demo' || relative === 'demo/') relative = 'demo/index.html';
    else if (relative.endsWith('/')) relative += 'index.html';
    let path = resolve(siteRoot, relative);
    try {
      if (!path.startsWith(siteRoot)) throw new Error('invalid path');
      const info = await stat(path);
      if (info.isDirectory()) path = join(path, 'index.html');
      response.writeHead(200, {
        'Content-Type': contentTypes[extname(path)] ?? 'application/octet-stream',
        'Service-Worker-Allowed': '/',
        'Content-Security-Policy': "default-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; worker-src 'self'",
      }).end(await readFile(path));
    } catch {
      response.writeHead(404, { 'Content-Type': 'text/html' }).end(await readFile(resolve(siteRoot, '404.html')));
    }
  });
  await new Promise((done) => server.listen(0, '127.0.0.1', done));
  origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch();
});

after(async () => {
  await browser?.close();
  await new Promise((done) => server?.close(done));
});

async function temp() { return mkdtemp(join(tmpdir(), 'folder-recipe-claim-')); }
async function run(args, options = {}) { return execFile(binary, args, { timeout: 8_000, ...options }); }
async function digest(path) { return createHash('sha256').update(await readFile(path)).digest('hex'); }
async function init(folder, name, profile = 'Portrait neutral v3') {
  return run(['init', folder, '--name', name, '--map', `rawtherapee=${profile}`, '--map', 'darktable=Portrait neutral', '--recommend', 'rawtherapee']);
}

test('@claim:demo-isolated creates a disposable complete sample', async () => {
  const base = await temp();
  try {
    const first = join(base, 'one');
    const second = join(base, 'two');
    const a = await run(['demo', '--output', first]);
    const b = await run(['demo', '--output', second]);
    assert.match(a.stdout, /Nothing here reads or writes your real photo folders/);
    assert.match(a.stdout, /Wrote 2 folder recipe\(s\)/);
    assert.notEqual(first, second);
    assert.equal((await stat(join(first, 'import-checklist.md'))).isFile(), true);
    assert.equal((await stat(join(first, '2026-08-portraits', '.photo-recipe.json'))).isFile(), true);
    assert.match(b.stdout, new RegExp(second.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    await assert.rejects(run(['demo', '--output', first]), (error) => error.code === 2);
  } finally { await rm(base, { recursive: true, force: true }); }
});

test('@claim:recipe-write writes readable versioned mappings and folder signals', async () => {
  const base = await temp();
  try {
    await writeFile(join(base, 'frame.RAF'), 'raw fixture');
    await init(base, 'August portraits');
    const path = join(base, '.photo-recipe.json');
    const first = await readFile(path, 'utf8');
    const recipe = JSON.parse(first);
    assert.equal(recipe.schema_version, 1);
    assert.deepEqual(recipe.editor_mappings, { darktable: 'Portrait neutral', rawtherapee: 'Portrait neutral v3' });
    assert.deepEqual(recipe.heuristics.extensions, ['raf']);
    await run(['init', base, '--name', 'August portraits', '--map', 'darktable=Portrait neutral', '--map', 'rawtherapee=Portrait neutral v3', '--recommend', 'rawtherapee', '--force']);
    assert.equal(await readFile(path, 'utf8'), first);
  } finally { await rm(base, { recursive: true, force: true }); }
});

test('@claim:originals-unchanged preserves photos and sidecars through every operation', async () => {
  const base = await temp();
  try {
    const shoot = join(base, 'shoot'); await mkdir(shoot);
    const originals = [join(shoot, 'frame.RAF'), join(shoot, 'frame.xmp'), join(shoot, 'preview.jpg')];
    await Promise.all(originals.map((path, index) => writeFile(path, `fixture-${index}`)));
    const before = await Promise.all(originals.map(digest));
    await init(shoot, 'Untouched originals');
    await run(['inspect', shoot, '--json']);
    await run(['checklist', base, '--output', join(base, 'checklist.md')]);
    assert.deepEqual(await Promise.all(originals.map(digest)), before);
    assert.deepEqual((await readdir(shoot)).sort(), ['.photo-recipe.json', 'frame.RAF', 'frame.xmp', 'preview.jpg']);
  } finally { await rm(base, { recursive: true, force: true }); }
});

test('@claim:nearest-inheritance reports direct and nearest parent recipe sources', async () => {
  const base = await temp();
  try {
    const year = join(base, '2026'); const shoot = join(year, 'shoot'); const selects = join(shoot, 'selects'); await mkdir(selects, { recursive: true });
    await init(base, 'Archive default', 'Archive profile');
    let report = JSON.parse((await run(['inspect', selects, '--json'])).stdout);
    assert.equal(report.recipe.name, 'Archive default'); assert.equal(report.inherited_levels, 3);
    await init(shoot, 'Shoot override', 'Shoot profile');
    report = JSON.parse((await run(['inspect', selects, '--json'])).stdout);
    assert.equal(report.recipe.name, 'Shoot override'); assert.equal(report.inherited_levels, 1); assert.equal(report.manifest_path, join(shoot, '.photo-recipe.json'));
    const direct = JSON.parse((await run(['inspect', shoot, '--json'])).stdout); assert.equal(direct.inherited, false);
  } finally { await rm(base, { recursive: true, force: true }); }
});

test('@claim:checklist-export exports one deterministic row per recipe folder', async () => {
  const base = await temp();
  try {
    for (const name of ['b-scans', 'a-portraits']) { const folder = join(base, name); await mkdir(folder); await init(folder, name); }
    const first = JSON.parse((await run(['checklist', base, '--format', 'json'])).stdout);
    const second = JSON.parse((await run(['checklist', base, '--format', 'json'])).stdout);
    assert.equal(first.folders.length, 2); assert.deepEqual(first, second);
    assert.deepEqual(first.folders.map(({ folder }) => folder), ['a-portraits', 'b-scans']);
  } finally { await rm(base, { recursive: true, force: true }); }
});

test('@claim:cli-contract is non-interactive and returns documented exit codes', async () => {
  const base = await temp();
  try {
    const demo = join(base, 'demo'); const ok = spawnSync(binary, ['demo', '--output', demo], { input: '', timeout: 8_000 });
    assert.equal(ok.status, 0); assert.equal(ok.signal, null);
    const invalid = spawnSync(binary, ['inspect', join(base, 'missing')], { input: '', timeout: 8_000 }); assert.equal(invalid.status, 2);
    const io = spawnSync(binary, ['checklist', demo, '--output', demo, '--force'], { input: '', timeout: 8_000 }); assert.equal(io.status, 1);
  } finally { await rm(base, { recursive: true, force: true }); }
});

test('@claim:future-fields accepts unknown fields and rejects unknown schema versions', async () => {
  const base = await temp();
  try {
    const recipe = { schema_version: 1, name: 'Future sample', recommended_editor: 'darktable', editor_mappings: { darktable: 'Neutral' }, created_with: 'fixture', future_adapter: { value: 2 } };
    await writeFile(join(base, '.photo-recipe.json'), JSON.stringify(recipe));
    assert.equal((await run(['inspect', base, '--json'])).stdout.includes('Future sample'), true);
    recipe.schema_version = 2; await writeFile(join(base, '.photo-recipe.json'), JSON.stringify(recipe));
    await assert.rejects(run(['inspect', base]), (error) => error.code === 2 && /supports 1/.test(error.stderr));
  } finally { await rm(base, { recursive: true, force: true }); }
});

test('@claim:cli-offline completes with network syscalls denied', async () => {
  const base = await temp();
  try {
    const library = join(base, 'deny-network.so'); const log = join(base, 'network.log');
    const built = spawnSync('cc', ['-shared', '-fPIC', resolve(root, 'site/tests/deny-network.c'), '-o', library]); assert.equal(built.status, 0);
    const result = spawnSync(binary, ['demo', '--output', join(base, 'demo')], { env: { ...process.env, LD_PRELOAD: library, NETWORK_DENY_LOG: log }, timeout: 8_000 });
    assert.equal(result.status, 0);
    await assert.rejects(stat(log), (error) => error.code === 'ENOENT');
  } finally { await rm(base, { recursive: true, force: true }); }
});

test('@claim:build-outputs produces the release binary and deployable site', async () => {
  assert.equal((await stat(binary)).isFile(), true);
  for (const file of ['index.html', 'demo/index.html', 'privacy/index.html', 'terms/index.html', '404.html', 'sw.js']) assert.equal((await stat(join(siteRoot, file))).isFile(), true);
});

test('@claim:web-demo-isolated opens in one click, resets, and offers a real start', async () => {
  const context = await browser.newContext(); const page = await context.newPage();
  try {
    await page.goto(origin); await page.getByRole('link', { name: 'Try it with sample data' }).click();
    assert.equal(new URL(page.url()).searchParams.get('demo'), '1');
    await page.getByText('Demo — sample data, nothing is saved').waitFor();
    assert.equal(await page.locator('#recipe-output h3').textContent(), 'August portraits');
    assert.equal(await page.locator('#recipe-output .mapping-list li').count(), 2);
    await page.getByRole('button', { name: 'Reset demo' }).click();
    assert.equal(await page.locator('#recipe-output h3').textContent(), 'August portraits');
    assert.equal(await page.getByRole('link', { name: 'Start for real' }).getAttribute('href'), '/');
    assert.deepEqual(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length })), { local: 0, session: 0 });
  } finally { await context.close(); }
});

test('@claim:browser-private keeps selected recipes in memory and requests only this site', async () => {
  const context = await browser.newContext(); const page = await context.newPage(); const requests = [];
  page.on('request', (request) => requests.push(request.url()));
  try {
    await page.goto(`${origin}/?demo=1`);
    await page.locator('#manifest-file').setInputFiles({ name: '.photo-recipe.json', mimeType: 'application/json', buffer: Buffer.from('{"schema_version":1,"name":"Private","recommended_editor":"darktable","editor_mappings":{"darktable":"Neutral"},"created_with":"fixture"}') });
    await page.getByRole('heading', { name: 'Private' }).waitFor();
    assert.equal(requests.every((url) => new URL(url).origin === origin), true);
    const state = await page.evaluate(async () => {
      let opfs = 0;
      if (navigator.storage?.getDirectory) {
        const directory = await navigator.storage.getDirectory();
        for await (const _entry of directory.values()) opfs += 1;
      }
      return { local: localStorage.length, session: sessionStorage.length, cookies: document.cookie, databases: indexedDB.databases ? (await indexedDB.databases()).length : 0, opfs };
    });
    assert.deepEqual(state, { local: 0, session: 0, cookies: '', databases: 0, opfs: 0 });
  } finally { await context.close(); }
});

test('@claim:offline-demo reloads and resets the sample without a connection', async () => {
  const context = await browser.newContext(); const page = await context.newPage();
  try {
    await page.goto(`${origin}/?demo=1`); await page.waitForFunction(() => navigator.serviceWorker?.controller !== null); await context.setOffline(true); await page.reload();
    await page.getByRole('heading', { name: 'Check saved profiles in a sample shoot' }).waitFor();
    await page.getByRole('button', { name: 'Reset demo' }).click(); await page.getByRole('heading', { name: 'August portraits' }).waitFor();
  } finally { await context.setOffline(false); await context.close(); }
});

test('@claim:mit-free has an MIT license and no account or payment path', async () => {
  assert.match(await readFile(resolve(root, 'LICENSE'), 'utf8'), /MIT License/);
  const terms = await readFile(resolve(siteRoot, 'terms/index.html'), 'utf8');
  assert.match(terms, /no accounts, subscriptions, purchases, or cloud storage/i);
  assert.doesNotMatch(terms, /<form|checkout|stripe|dodo/i);
});
