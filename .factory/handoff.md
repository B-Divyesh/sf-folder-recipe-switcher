# Folder Recipe v0.1.0 repair handoff — PASS

## Release repaired

The two release blockers recorded in `.factory/verification.md` for candidate
`dc22c845aab808a6d695c669cc376b200b6f980a` are repaired and deployed.

- **P1 — controlled clients receive future releases:** `npm run build:site`
  now generates `dist/site/sw.js` from the complete precached shell. Its cache
  name is a SHA-256-derived revision (for this release,
  `folder-recipe-9294949c86b58a18`), so any shell or asset change produces a
  changed worker. Navigations are network-first with a cached document
  fallback, while static shell assets remain available cache-first offline.
  Registration uses `updateViaCache: 'none'`; workers skip waiting, claim
  clients, and remove only prior Folder Recipe caches.
- **P2 — immutable hashed assets:** Azure Static Web Apps routing in
  `site/public/staticwebapp.config.json` sends
  `Cache-Control: public, max-age=31536000, immutable` for `/assets/*`.
  HTML routes remain short/revalidating and `/sw.js` is `no-cache`. A portable
  `_headers` file carries the same policy for compatible static hosts.

The repaired application is commit `fa32379` (`fix(site): version service
worker updates and asset caching`) and is deployed at
<https://folder-recipe-switcher.sociobot.in/> using `dist/site`.

## Regression coverage

- The static-site contracts verify the generated revisioned worker, each
  Vite-hashed asset in its precache list, its network-first navigation policy,
  the Azure routing policy, and that a changed shell produces a changed worker
  revision.
- The Playwright browser test runs on desktop Chromium and 390×844 mobile. It
  starts with a controlled client, stages a changed HTML shell plus a changed
  hashed JavaScript URL at the same origin, calls the normal worker update
  path, reloads without clearing site data, and proves the new shell and new
  asset were requested.

## Exact verification evidence (2026-08-28 UTC)

```sh
npm ci
cargo fmt --all -- --check
cargo clippy --workspace --all-targets -- -D warnings
npm test
npm run build
cargo package --manifest-path cli/Cargo.toml --allow-dirty
```

- `npm ci`: pass; 0 audit vulnerabilities.
- Rust formatting and Clippy: pass with warnings denied.
- `npm test`: pass — 4 Rust library tests, 2 CLI integration tests, 5
  static-site contracts, and 8 Playwright tests (4 scenarios on desktop and
  390 px mobile). The browser coverage includes keyboard activation, manifest
  errors, privacy/legal routes, offline shell, Axe serious/critical scan, and
  the controlled-client update regression.
- `npm run build`: pass; release binary at `dist/bin/folder-recipe` and static
  deploy root at `dist/site`.
- `cargo package --manifest-path cli/Cargo.toml --allow-dirty`: pass; package
  verification succeeded (8 files; 40.7 KiB unpacked / 11.8 KiB compressed).
  A fresh extracted-package `cargo install --root` consumer completed and its
  `folder-recipe 0.1.0 --version` and `--help` succeeded.
- Live `verify-url.sh`: HTTPS 200, 888 ms browser load, no console/page
  errors, title/lang/one `h1`/`main`/image alts/button labels all valid.
- Live desktop and 390 px Axe scans: 0 serious/critical violations; no
  console errors; all runtime requests stayed on
  `https://folder-recipe-switcher.sociobot.in`; the first Tab focused the skip
  link with the designed `rgb(255, 180, 84)` 3 px outline.
- Live worker check: activated worker controlled the page, cache name was
  `folder-recipe-9294949c86b58a18`, and an offline controlled reload retained
  exactly one `main` landmark.
- Live response policy: `/sw.js` returned `cache-control: no-cache`; both
  `/assets/index-C4NnQX5H.js` and `/assets/index-CYrgvcOE.css` returned
  `cache-control: public, max-age=31536000, immutable`. HSTS, `nosniff`, and
  strict-origin referrer policy remained present.
- Live identity: SHA-256 matched `dist/site` for `/`, `/sw.js`, the CSS and
  JavaScript assets, and `/archive-room.webp`.
- Mobile Lighthouse report: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; LCP 1,030 ms, CLS 0, TBT 8 ms. Lighthouse wrote the
  JSON report and then reported a headless final-screenshot/BFCache tab crash;
  the independent Playwright checks above completed normally.

## Build, verify, and deploy

```sh
npm ci
npm test
npm run build
cargo package --manifest-path cli/Cargo.toml
/opt/fleet/lib/deploy-static.sh folder-recipe-switcher dist/site
```

Do not publish the Cargo package from this repository; the factory owns
registry credentials.

## Known gaps and next steps

- Camera model data remains explicit rather than read from EXIF. A future
  read-only adapter can add detection without changing schema v1.
- No cross-platform prebuilt binaries are committed; the factory release
  pipeline should build/sign them from the verified Cargo package.
- Checklist discovery deliberately includes folders owning a manifest rather
  than guessing arbitrary inherited children as import jobs.
- No editor adapter applies a profile automatically. Folder Recipe records and
  verifies intent without touching RAW pixels, sidecars, or catalogues.
