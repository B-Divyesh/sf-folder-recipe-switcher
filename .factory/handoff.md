# Folder Recipe polish-1 handoff — PASS

**Work order:** `folder-recipe-switcher-polish-1`

**Base review:** `038e769d06bdea6953996d9307f79741d9f75fd1`

**Deployed product commit:** `a3c7877e15aaf2a86e26410768df07ca52f63ef5`

**Live URL:** <https://folder-recipe-switcher.sociobot.in/>
**Deployment ID:** `08844f80-9773-4bfe-a108-9dc14759d7bc`

## What changed

- Rewrote the first screen around the photographer’s job and made the isolated sample the primary action.
- Added `folder-recipe demo`, realistic bundled sample folders, fresh temporary output, a two-folder checklist, and reset instructions.
- Added equivalent `?demo=1` and `/demo` browser entry points with an in-memory sample, persistent banner, Reset, and Start-for-real controls.
- Added `.factory/claims.json` and 14 uniquely tagged observable claim tests.
- Rewrote headings, buttons, errors, README, privacy, terms, and the catalog description in consistent plain words.
- Added route-specific titles, canonicals, OG/Twitter metadata, social artwork, apple icon, focus announcements, and a designed 404.
- Added the shared header/footer skeleton to landing, demo, legal, and 404 pages.
- Added CSP, Permissions-Policy, clickjacking protection, and explicit route/cache behavior.
- Preserved the blue-hour archive-room art direction and added only derived, product-specific assets with provenance.

Every review finding maps to a repair and evidence in `.factory/polish-1.md`.

## How to verify

```sh
npm ci
cargo fmt --all -- --check
cargo clippy --workspace --all-targets -- -D warnings
npm test
npm run build
cargo package --manifest-path cli/Cargo.toml
```

Run one claim exactly as the verifier will:

```sh
npm run test:claims -- --grep @claim:offline-demo
```

Run the bundled CLI demo:

```sh
dist/bin/folder-recipe demo
```

## Verification completed

- Fresh clone `/tmp/folder-recipe-clean.ULTSLy` at `71ef63e26e33605bd9067db77b6d66ae59aefc9c`: `npm ci` passed with zero vulnerabilities.
- All 14 claim commands from `.factory/claims.json` ran separately and passed.
- Formatting, strict Clippy, the full `npm test`, `npm run build`, and `cargo package` passed in that clone.
- Rust: 4 library tests and 2 CLI integration tests passed.
- Site: 5 static contract tests and 14 claim tests passed.
- Browser: 12 Playwright project runs passed across desktop and 390×844 mobile.
- Accessibility: Axe reported zero serious/critical violations at both sizes; keyboard, focus, skip link, landmarks, and reduced motion passed.
- Privacy: full demo/file flow made only same-origin requests and left cookies, local/session storage, IndexedDB, and OPFS empty.
- Offline: a controlled fresh demo reloaded offline and Reset demo restored the sample.
- Performance: Lighthouse mobile scored 100/100/100/100; LCP 1.01 s, CLS 0, and TBT 0.
- Budgets: JS 2,410 B gzip; CSS 3,237 B gzip; no fonts; hero 39,312 B; social image 73,266 B.
- Packaging: `cargo package` produced 8 files, 44.7 KiB unpacked and 12.6 KiB compressed, then verified the crate.

## Live verification

After deployment, a cold browser run at 1440×900 and 390×844 confirmed:

- `/`, `/demo`, `/?demo=1`, `/privacy/`, and `/terms/` return 200.
- `/not-a-real-page` returns 404 with the designed Folder Recipe page.
- Demo title, focused h1, banner, ready sample, reset, and offline reload all work.
- No console errors, serious/critical Axe findings, third-party requests, storage, or horizontal overflow occurred.
- CSP, Permissions-Policy, `nosniff`, referrer policy, and frame blocking are present.
- Hashed JS returns one-year immutable caching.
- Root HTML, JS, hero, service worker, demo, legal, and 404 content match the built artifact byte-for-byte.
- Every crawled product and GitHub link returned 200.

Evidence is in `.factory/evidence/live/`, `.factory/evidence/local/`, and `.factory/evidence/lighthouse/summary.json`.

## Known gaps

None within the reviewed product scope. Registry publishing and signed cross-platform binaries remain factory release work, not product defects.
