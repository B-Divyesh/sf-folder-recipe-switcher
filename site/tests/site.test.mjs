import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);

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
    assert.match(html, /<main>/);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  }
});

test('reduced motion and focus treatment are explicit', async () => {
  const css = await readFile(new URL('src/style.css', root), 'utf8');
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /:focus-visible/);
});
