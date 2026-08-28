import assert from 'node:assert/strict';
import { execFile as execFileCallback, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { mkdtemp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { promisify } from 'node:util';
import { after, before, test } from 'node:test';
import { chromium } from 'playwright';

const execFile = promisify(execFileCallback);
const root = resolve(import.meta.dirname, '../..');
const siteRoot = resolve(root, 'dist/site');
const binary = resolve(root, `dist/bin/folder-recipe${process.platform === 'win32' ? '.exe' : ''}`);
const contentTypes = { '.css': 'text/css', '.html': 'text/html', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.xml': 'application/xml' };
const publicSitePath = /^\/(?:|demo\/?|privacy\/?|terms\/?|404\.html|assets\/[A-Za-z0-9._-]+\.(?:js|css)|(?:archive-room|social-card)\.(?:webp|jpg)|(?:folder-mark\.svg|apple-touch-icon\.png|legal\.css|route\.js|sw\.js))$/;
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
async function fileMap(folder) {
  const entries = {};
  async function visit(path) {
    for (const entry of await readdir(path, { withFileTypes: true })) {
      const child = join(path, entry.name);
      if (entry.isDirectory()) await visit(child);
      else if (entry.isFile()) entries[relative(folder, child)] = await digest(child);
    }
  }
  await visit(folder);
  return Object.fromEntries(Object.entries(entries).sort(([a], [b]) => a.localeCompare(b)));
}
function changedPaths(before, after) {
  return [...new Set([...Object.keys(before), ...Object.keys(after)])]
    .filter((path) => before[path] !== after[path])
    .sort();
}
async function init(folder, name, profile = 'Portrait neutral v3') {
  return run(['init', folder, '--name', name, '--map', `rawtherapee=${profile}`, '--map', 'darktable=Portrait neutral', '--recommend', 'rawtherapee', '--camera', 'Fujifilm X-T5', '--source', 'camera-raw', '--note', 'Protect warm skin tones']);
}

test('@claim:demo-isolated creates a disposable complete sample', async () => {
  const base = await temp();
  try {
    const tempParent = join(base, 'demo-parent');
    await mkdir(tempParent);
    const environment = { ...process.env, TMPDIR: tempParent };
    const a = await run(['demo'], { env: environment });
    const b = await run(['demo'], { env: environment });
    const first = a.stdout.match(/^Demo folder: (.+)$/m)?.[1];
    const second = b.stdout.match(/^Demo folder: (.+)$/m)?.[1];
    assert.ok(first, 'the bare demo prints its folder');
    assert.ok(second, 'the second bare demo prints its folder');
    assert.equal(dirname(first), tempParent);
    assert.equal(dirname(second), tempParent);
    assert.match(a.stdout, /Nothing here reads or writes your real photo folders/);
    assert.match(a.stdout, /Wrote 2 folder recipe\(s\)/);
    assert.notEqual(first, second);
    assert.equal((await stat(join(first, 'import-checklist.md'))).isFile(), true);
    assert.equal((await stat(join(first, '2026-08-portraits', '.photo-recipe.json'))).isFile(), true);
    const inspection = JSON.parse((await run(['inspect', join(first, '2026-08-portraits', 'selects'), '--json'])).stdout);
    assert.equal(inspection.inherited, true);
    assert.equal(inspection.recipe.name, 'August window-light portraits');
    assert.match(b.stdout, new RegExp(second.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  } finally { await rm(base, { recursive: true, force: true }); }
});

test('@claim:recipe-write writes readable versioned mappings and folder signals', async () => {
  const base = await temp();
  try {
    await run(['demo', '--output', join(base, 'demo')]);
    const shoot = join(base, 'write-check'); await mkdir(shoot); await writeFile(join(shoot, 'frame.RAF'), 'raw fixture');
    await init(shoot, 'August portraits');
    const path = join(shoot, '.photo-recipe.json');
    const first = await readFile(path, 'utf8');
    const recipe = JSON.parse(first);
    assert.equal(recipe.schema_version, 1);
    assert.deepEqual(recipe.editor_mappings, { darktable: 'Portrait neutral', rawtherapee: 'Portrait neutral v3' });
    assert.deepEqual(recipe.heuristics.extensions, ['raf']);
    assert.deepEqual(recipe.heuristics.camera_models, ['Fujifilm X-T5']);
    assert.deepEqual(recipe.heuristics.sources, ['camera-raw']);
    assert.equal(recipe.note, 'Protect warm skin tones');
    await run(['init', shoot, '--name', 'August portraits', '--map', 'darktable=Portrait neutral', '--map', 'rawtherapee=Portrait neutral v3', '--recommend', 'rawtherapee', '--camera', 'Fujifilm X-T5', '--source', 'camera-raw', '--note', 'Protect warm skin tones', '--force']);
    assert.equal(await readFile(path, 'utf8'), first);
  } finally { await rm(base, { recursive: true, force: true }); }
});

test('@claim:originals-unchanged preserves photos and sidecars around init, inspect, and checklist', async () => {
  const base = await temp();
  try {
    const demo = join(base, 'demo'); await run(['demo', '--output', demo]);
    const shoot = join(demo, '2026-08-portraits');
    const sidecar = join(shoot, 'DSCF1842.xmp'); await writeFile(sidecar, 'sidecar fixture');
    const originals = [join(shoot, 'DSCF1842.RAF'), join(shoot, 'selects', 'DSCF1842.jpg'), sidecar, join(demo, 'family-negatives', 'roll-07-frame-12.tiff')];
    const before = await Promise.all(originals.map(digest));
    await run(['init', shoot, '--name', 'Untouched originals', '--map', 'rawtherapee=Portrait neutral v3', '--force']);
    await run(['inspect', join(shoot, 'selects'), '--json']);
    await run(['checklist', demo, '--output', join(base, 'checklist.md')]);
    assert.deepEqual(await Promise.all(originals.map(digest)), before);
    assert.deepEqual((await readdir(shoot)).sort(), ['.photo-recipe.json', 'DSCF1842.RAF', 'DSCF1842.xmp', 'selects']);
  } finally { await rm(base, { recursive: true, force: true }); }
});

test('@claim:nearest-inheritance reports direct and nearest parent recipe sources', async () => {
  const base = await temp();
  try {
    const demo = join(base, 'demo'); await run(['demo', '--output', demo]);
    const shoot = join(demo, '2026-08-portraits'); const selects = join(shoot, 'selects'); const deep = join(selects, 'final'); await mkdir(deep);
    let report = JSON.parse((await run(['inspect', deep, '--json'])).stdout);
    assert.equal(report.recipe.name, 'August window-light portraits'); assert.equal(report.inherited_levels, 2);
    await init(selects, 'Selects override', 'Selects profile');
    report = JSON.parse((await run(['inspect', deep, '--json'])).stdout);
    assert.equal(report.recipe.name, 'Selects override'); assert.equal(report.inherited_levels, 1); assert.equal(report.manifest_path, join(selects, '.photo-recipe.json'));
    const direct = JSON.parse((await run(['inspect', selects, '--json'])).stdout); assert.equal(direct.inherited, false);
  } finally { await rm(base, { recursive: true, force: true }); }
});

test('@claim:checklist-export exports one deterministic row per recipe folder', async () => {
  const base = await temp();
  try {
    const demo = join(base, 'demo'); await run(['demo', '--output', demo]);
    const first = JSON.parse((await run(['checklist', demo, '--format', 'json'])).stdout);
    const second = JSON.parse((await run(['checklist', demo, '--format', 'json'])).stdout);
    assert.equal(first.folders.length, 2); assert.deepEqual(first, second);
    assert.deepEqual(first.folders.map(({ folder }) => folder), ['2026-08-portraits', 'family-negatives']);
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
    await run(['demo', '--output', join(base, 'demo')]);
    const recipe = { schema_version: 1, name: 'Future sample', recommended_editor: 'darktable', editor_mappings: { darktable: 'Neutral' }, created_with: 'fixture', future_adapter: { value: 2 } };
    await writeFile(join(base, '.photo-recipe.json'), JSON.stringify(recipe));
    assert.equal((await run(['inspect', base, '--json'])).stdout.includes('Future sample'), true);
    recipe.schema_version = 2; await writeFile(join(base, '.photo-recipe.json'), JSON.stringify(recipe));
    await assert.rejects(run(['inspect', base]), (error) => error.code === 2 && /supports 1/.test(error.stderr));
  } finally { await rm(base, { recursive: true, force: true }); }
});

test('@claim:cli-offline sends no usage data and runs without a network connection', async () => {
  const base = await temp();
  try {
    const library = join(base, 'deny-network.so'); const log = join(base, 'network.log');
    const built = spawnSync('cc', ['-shared', '-fPIC', resolve(root, 'site/tests/deny-network.c'), '-o', library]); assert.equal(built.status, 0);
    const environment = { ...process.env, LD_PRELOAD: library, NETWORK_DENY_LOG: log };
    const demo = join(base, 'demo');
    const shoot = join(demo, '2026-08-portraits');
    const selects = join(shoot, 'selects');
    const command = (args) => spawnSync(binary, args, { env: environment, timeout: 8_000, encoding: 'utf8' });

    const demoResult = command(['demo', '--output', demo]);
    assert.equal(demoResult.status, 0, demoResult.stderr);
    const afterDemo = await fileMap(demo);
    assert.equal(afterDemo['2026-08-portraits/DSCF1842.RAF'] !== undefined, true);
    assert.equal(afterDemo['family-negatives/roll-07-frame-12.tiff'] !== undefined, true);

    const initResult = command(['init', shoot, '--name', 'Network-denied portraits', '--map', 'rawtherapee=Portrait neutral v3', '--recommend', 'rawtherapee', '--force']);
    assert.equal(initResult.status, 0, initResult.stderr);
    const afterInit = await fileMap(demo);
    assert.deepEqual(changedPaths(afterDemo, afterInit), ['2026-08-portraits/.photo-recipe.json']);

    const inspectResult = command(['inspect', selects, '--json']);
    assert.equal(inspectResult.status, 0, inspectResult.stderr);
    assert.deepEqual(await fileMap(demo), afterInit);

    const beforeChecklist = await fileMap(base);
    const checklist = join(base, 'import-checklist.md');
    const checklistResult = command(['checklist', demo, '--output', checklist]);
    assert.equal(checklistResult.status, 0, checklistResult.stderr);
    assert.deepEqual(changedPaths(beforeChecklist, await fileMap(base)), ['import-checklist.md']);
    assert.match(await readFile(checklist, 'utf8'), /2026-08-portraits/);
    await assert.rejects(stat(log), (error) => error.code === 'ENOENT');
    const runtimeSource = `${await readFile(resolve(root, 'cli/src/main.rs'), 'utf8')}\n${await readFile(resolve(root, 'cli/src/lib.rs'), 'utf8')}\n${await readFile(resolve(root, 'cli/Cargo.toml'), 'utf8')}`;
    assert.doesNotMatch(runtimeSource, /reqwest|ureq|telemetry|analytics|std::net/i);
    assert.match(await readFile(resolve(siteRoot, 'index.html'), 'utf8'), /Runs locally without a network connection/);
  } finally { await rm(base, { recursive: true, force: true }); }
});

test('@claim:install-version installs the documented release version into a fresh prefix', async () => {
  const base = await temp();
  try {
    const prefix = join(base, 'prefix');
    const install = spawnSync('cargo', ['install', '--path', resolve(root, 'cli'), '--root', prefix, '--force'], { cwd: root, encoding: 'utf8', timeout: 60_000 });
    assert.equal(install.status, 0, install.stderr);
    const installed = join(prefix, 'bin', `folder-recipe${process.platform === 'win32' ? '.exe' : ''}`);
    assert.equal((await stat(installed)).isFile(), true);
    const version = await execFile(installed, ['--version']);
    assert.equal(version.stdout.trim(), 'folder-recipe 0.1.0');
  } finally { await rm(base, { recursive: true, force: true }); }
});

test('@claim:build-outputs produces the release binary and deployable site', async () => {
  const base = await temp();
  try { await run(['demo', '--output', join(base, 'demo')]); } finally { await rm(base, { recursive: true, force: true }); }
  assert.equal((await stat(binary)).isFile(), true);
  assert.deepEqual(await readdir(resolve(root, 'dist/bin')), [`folder-recipe${process.platform === 'win32' ? '.exe' : ''}`]);
  for (const file of ['index.html', 'demo/index.html', 'privacy/index.html', 'terms/index.html', '404.html', 'sw.js']) assert.equal((await stat(join(siteRoot, file))).isFile(), true);
});

test('@claim:scope-boundary exposes recording tools but no photo-editing or catalogue command', async () => {
  const base = await temp();
  try { await run(['demo', '--output', join(base, 'demo')]); } finally { await rm(base, { recursive: true, force: true }); }
  const help = (await run(['--help'])).stdout;
  for (const command of ['demo', 'init', 'inspect', 'checklist']) assert.match(help, new RegExp(`\\b${command}\\b`));
  assert.doesNotMatch(help, /\b(edit|apply|catalogue|catalog)\b/i);
});

test('@claim:web-demo-isolated opens in one click, resets, and offers a real start', async () => {
  const context = await browser.newContext(); const page = await context.newPage();
  try {
    await page.goto(origin); await page.getByRole('link', { name: 'Try it with sample data' }).click();
    assert.equal(new URL(page.url()).pathname, '/demo/');
    await page.getByText('Demo — sample data, nothing is saved').waitFor();
    assert.equal(await page.locator('#recipe-output h3').textContent(), 'August portraits');
    assert.equal(await page.locator('#recipe-output .mapping-list li').count(), 2);
    await page.locator('#manifest-file').setInputFiles({ name: '.photo-recipe.json', mimeType: 'application/json', buffer: Buffer.from('{"schema_version":1,"name":"Private fixture","recommended_editor":"darktable","editor_mappings":{"darktable":"Neutral"}}') });
    assert.equal(await page.locator('#recipe-output h3').textContent(), 'Private fixture');
    await page.getByRole('button', { name: 'Reset demo' }).click();
    assert.equal(await page.locator('#recipe-output h3').textContent(), 'August portraits');
    assert.equal(await page.locator('#recipe-output .mapping-list li').count(), 2);
    await page.getByRole('link', { name: 'Start for real' }).click();
    assert.equal(new URL(page.url()).pathname, '/');
    assert.equal(await page.locator('#demo-banner').isHidden(), true);
    assert.equal(await page.locator('#recipe-output h3').textContent(), 'Your checked recipe appears here');
    assert.deepEqual(await page.evaluate(async () => ({
      local: localStorage.length,
      session: sessionStorage.length,
      cookies: document.cookie,
      databases: indexedDB.databases ? (await indexedDB.databases()).length : 0,
      opfs: await (async () => {
        if (!navigator.storage?.getDirectory) return 0;
        let count = 0; for await (const _entry of (await navigator.storage.getDirectory()).values()) count += 1;
        return count;
      })(),
    })), { local: 0, session: 0, cookies: '', databases: 0, opfs: 0 });
    await page.goto(`${origin}/?demo=1`);
    assert.equal(await page.title(), 'Demo — Folder Recipe');
    assert.equal(await page.locator('#demo-banner').isVisible(), true);
    assert.equal(await page.locator('#recipe-output h3').textContent(), 'August portraits');
  } finally { await context.close(); }
});

test('@claim:browser-private keeps selected recipes in memory and requests only this site', async () => {
  const context = await browser.newContext(); const page = await context.newPage(); const requests = [];
  page.on('request', (request) => requests.push(request.url()));
  try {
    await page.goto(`${origin}/demo/`);
    await page.locator('#manifest-file').setInputFiles({ name: '.photo-recipe.json', mimeType: 'application/json', buffer: Buffer.from('{"schema_version":1,"name":"Private","recommended_editor":"darktable","editor_mappings":{"darktable":"Neutral"},"created_with":"fixture"}') });
    await page.getByRole('heading', { name: 'Private' }).waitFor();
    assert.equal(requests.every((url) => new URL(url).origin === origin), true);
    const state = await page.evaluate(async () => {
      let opfs = 0;
      if (navigator.storage?.getDirectory) {
        const directory = await navigator.storage.getDirectory();
        for await (const _entry of directory.values()) opfs += 1;
      }
      const cached = (await caches.keys()).flatMap(() => []);
      for (const key of await caches.keys()) cached.push(...(await (await caches.open(key)).keys()).map((request) => request.url));
      return { local: localStorage.length, session: sessionStorage.length, cookies: document.cookie, databases: indexedDB.databases ? (await indexedDB.databases()).length : 0, opfs, cached };
    });
    assert.deepEqual({ ...state, cached: undefined }, { local: 0, session: 0, cookies: '', databases: 0, opfs: 0, cached: undefined });
    assert.equal(state.cached.every((url) => new URL(url).origin === origin && publicSitePath.test(new URL(url).pathname) && !url.includes('Private')), true);
  } finally { await context.close(); }
});

test('@claim:site-no-tracking has no analytics, ads, cookies, accounts, or third-party scripts', async () => {
  const context = await browser.newContext(); const page = await context.newPage(); const requests = [];
  page.on('request', (request) => requests.push(request.url()));
  try {
    for (const path of ['/', '/demo/', '/privacy/', '/terms/']) {
      await page.goto(`${origin}${path}`);
      await page.waitForLoadState('domcontentloaded');
      const scripts = await page.locator('script').evaluateAll((elements) => elements.map((element) => ({ src: element.src, inline: element.textContent?.trim() ?? '' })));
      for (const script of scripts) {
        assert.equal(new URL(script.src).origin, origin, `script must be self-hosted: ${script.src}`);
        assert.equal(script.inline, '', 'the site has no inline tracking script');
      }
      assert.equal(await page.locator('form').count(), 0, 'the site has no account or payment form');
      assert.equal(await page.locator('input:not([type="file"])').count(), 0, 'the site has no account input');
    }
    await page.goto(`${origin}/demo/`);
    await page.locator('#manifest-file').setInputFiles({ name: '.photo-recipe.json', mimeType: 'application/json', buffer: Buffer.from('{"schema_version":1,"name":"Private","recommended_editor":"darktable","editor_mappings":{"darktable":"Neutral"}}') });
    await page.getByRole('heading', { name: 'Private' }).waitFor();

    assert.ok(requests.length > 0, 'the browser flow made the expected first-party requests');
    for (const url of requests) {
      const request = new URL(url);
      assert.equal(request.origin, origin, `unexpected third-party request: ${url}`);
      assert.match(request.pathname, publicSitePath, `unexpected first-party request: ${request.pathname}`);
    }
    assert.deepEqual(await context.cookies(), []);
    assert.equal(await page.evaluate(() => document.cookie), '');

    const runtimeScripts = await page.locator('script[src]').evaluateAll((elements) => elements.map((element) => new URL(element.src).pathname));
    const runtimeSource = await Promise.all(runtimeScripts.map((path) => readFile(resolve(siteRoot, path.slice(1)), 'utf8')));
    assert.doesNotMatch(runtimeSource.join('\n'), /google-analytics|gtag\(|plausible|fathom|matomo|mixpanel|hotjar|segment|amplitude|sendBeacon|\/(?:collect|analytics|ads|tracking)(?:[/'"]|$)|\b(?:login|sign.?up|auth|checkout|payment)\b/i);
  } finally { await context.close(); }
});

test('@claim:offline-demo reloads and resets the sample without a connection', async () => {
  const context = await browser.newContext(); const page = await context.newPage();
  try {
    await page.goto(`${origin}/demo/`); await page.waitForFunction(() => navigator.serviceWorker?.controller !== null); await context.setOffline(true); await page.reload();
    await page.getByRole('heading', { name: 'Check saved profiles in a sample shoot' }).waitFor();
    await page.getByRole('button', { name: 'Reset demo' }).click(); await page.getByRole('heading', { name: 'August portraits' }).waitFor();
  } finally { await context.setOffline(false); await context.close(); }
});

test('@claim:mit-free has an MIT license and no account or payment path', async () => {
  const base = await temp();
  try { await run(['demo', '--output', join(base, 'demo')]); } finally { await rm(base, { recursive: true, force: true }); }
  assert.match(await readFile(resolve(root, 'LICENSE'), 'utf8'), /MIT License/);
  const terms = await readFile(resolve(siteRoot, 'terms/index.html'), 'utf8');
  assert.match(terms, /no accounts, subscriptions, purchases, or cloud storage/i);
  assert.doesNotMatch(terms, /<form|checkout|stripe|dodo/i);
});
