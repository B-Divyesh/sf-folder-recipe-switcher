# Folder Recipe polish 2 handoff — PASS

**Work order:** `folder-recipe-switcher-polish-2`

**Repair commits:** `3a0e09e2e42c447063b0dee1639780ee970c2ba8`, `1d7f89ef516fd34f3b127eb790de004cf7358792`

**Deployment ID:** `fde52489-3148-4902-910d-9d07d429f762`

**Live URL:** <https://folder-recipe-switcher.sociobot.in/>

## What changed

- Replaced the four inconsistent visitor terms from review 2 and removed related “direct/manifest/mapping/clue” wording from user-facing site, README, and CLI output.
- Revised the first-screen local-operation fact and its `cli-offline` ledger entry so the exact promise, location, and network-denied test align.
- Restored heading focus and live-region announcements after browser Back in the app and static legal/404 routes.
- Added desktop and 390 px regressions for app and legal-route Back behavior.
- Updated the route build ID, changelog, copy audit, catalog description, and complete finding map.
- Preserved the single-binary Rust artifact, static Vite deployment, in-memory browser demo, and blue-hour archive visual system.

## Exact verification

Clean clone `/tmp/folder-recipe-polish2.XZ5yAG` at `3a0e09e`:

```sh
npm ci
# Every `test` command in .factory/claims.json, run separately: 14/14 passed
cargo fmt --all -- --check
cargo clippy --workspace --all-targets -- -D warnings
npm test
npm run build
cargo package --manifest-path cli/Cargo.toml
```

- `npm ci`: 0 vulnerabilities.
- Rust: 4 library tests and 2 CLI integration tests passed.
- Static contracts: 6 passed.
- Claims: 14 unique ledger entries, exactly one tagged test each, 14 passed.
- Browser: 14 passed across desktop Chromium and 390×844 mobile.
- Accessibility: Playwright Axe found zero serious/critical issues; the factory URL verifier found one title, `lang=en`, one `h1`, one `main`, all image alt attributes, and zero console errors.
- Privacy: full demo/selected-file flow contacted only the product origin; local/session storage, cookies, IndexedDB, and OPFS remained empty.
- Offline: controlled `/demo/` reloaded offline and reset the bundled sample.
- Package: `cargo package` produced and verified 8 files, 44.8 KiB unpacked and 12.6 KiB compressed.
- Performance: live Lighthouse scored 100 performance, 100 accessibility, 100 best practices, and 100 SEO; LCP 979 ms, CLS 0, TBT 5 ms.
- Payload: 2,496 B gzip JS, 3,237 B gzip CSS, no fonts, 39,312 B hero.

## Live recheck

- `/`, `/demo/`, `/privacy/`, and `/terms/` return 200 with unique titles, one heading/main, canonical, description, social card, icons, and shared shell.
- `/not-a-real-page` returns the designed 404 with Home and Demo links.
- `/?demo=1` loads the sample in one click, focuses its heading, shows the persistent banner, resets, and exits without retaining sample data.
- Browser Back restores `#hero-title` and announces “Save photo editor profiles beside folders.” Privacy-route Back focuses and announces its `h1`.
- At 390×844 all three first-screen facts end above y=642 px, with no horizontal overflow.
- Root HTML, hashed JS/CSS, hero, and service worker match local `dist/site` by SHA-256.
- Live headers include CSP with `frame-ancestors 'none'`, Permissions Policy, `DENY`, nosniff, strict referrer policy, no-cache service worker, and immutable hashed assets.

Evidence is under `.factory/evidence/polish-2/`; the per-finding map is `.factory/polish-2.md`.

## Known gaps and next steps

None. No review finding, failed gate, TODO, stub, deployment mismatch, or deferred severity remains.
