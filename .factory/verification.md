# Verification report — FAIL

**Work order:** `folder-recipe-switcher-verify-1`  
**Candidate:** `dc22c845aab808a6d695c669cc376b200b6f980a` (`main`)  
**Live URL:** <https://folder-recipe-switcher.sociobot.in/>  
**Verified:** 2026-08-28 UTC  
**Scope:** independent clean-checkout QA; no product-source changes made.

## Result

**FAIL.** The CLI and the currently deployed site are functional and the live payload exactly matches the candidate, but the PWA cannot reliably receive a normal future deployment after it has been controlled once. This fails the required service-worker update check.

## Release-blocking defects

### P1 — controlled clients can be stuck on an old site shell indefinitely

`site/public/sw.js` uses the fixed cache name `folder-recipe-v1`, precaches `/`, and serves every cached GET request cache-first. A content-only release changes Vite asset names and `index.html`, but does not change `sw.js`; the installed worker therefore is not updated, and its cached `/` continues to be returned before the network is consulted. The new HTML/asset graph is never discovered by those clients.

Evidence: the worker defines `const CACHE = 'folder-recipe-v1'`; install only adds to that cache; fetch is `caches.match(event.request).then((cached) => cached || fetch(...))`. A live controlled browser did correctly reload offline, which confirms the cache-first path, but the corresponding update path is absent. Use a build-revisioned cache and update the navigation strategy (for example network-first with an offline fallback) so a new deployment replaces the shell.

### P2 — hashed static assets are not given immutable long-lived HTTP caching

Live `HEAD` responses for `/assets/index-CYrgvcOE.css`, `/assets/index-D8wvgL8_.js`, and `/archive-room.webp` all returned `cache-control: public, must-revalidate, max-age=30`. The two hashed assets should be cached long-lived and immutable. This misses the stated static/PWA caching policy and needlessly revalidates the tiny static shell on normal visits.

## Evidence that passed

### Clean checkout, quality gates, and package

- `npm ci`: passed; audit reported 0 vulnerabilities.
- `cargo fmt --all -- --check`: passed.
- `cargo clippy --workspace --all-targets -- -D warnings`: passed.
- `npm test`: passed: 4 Rust library tests, 2 Rust CLI integration tests, 3 static-site tests, and 6 Playwright tests across desktop Chromium and 390×844 mobile.
- `npm run build`: passed; release CLI and `dist/site` were produced.
- `cargo package --manifest-path cli/Cargo.toml --allow-dirty`: passed; 8 files, 40.7 KiB unpacked / 11.8 KiB compressed, including Cargo verification.
- A crate extracted from that package installed into a fresh `cargo install --root` prefix; its `folder-recipe 0.1.0 --version` and helpful `--help` succeeded.

### Independent CLI acceptance exercise

Using the release binary on a fresh mixed archive:

- Created explicit RawTherapee/darktable portraits, a darktable scan folder, and an empty incoming folder.
- Verified a descendant inherited the parent recipe at exactly one level and warned about unexpected `jpg`; verified the empty folder warned that it was ready for future inherited files.
- Exported a deterministic JSON checklist containing the three manifested folders.
- Original `.RAF`, `.jpg`, and `.TIFF` test files retained their exact contents.
- Safe/error paths all exited `2`: existing-manifest overwrite without `--force`, multiple mappings without `--recommend`, malformed `=profile` mapping, and schema version `2` inspection. Unsupported schema feedback was actionable.

### Live deployment identity, browser, privacy, and accessibility

- Downloaded live `index.html`, CSS, JS, WebP, and `sw.js`; each was byte-identical to `dist/site` (SHA-256 equality). The live deployment is the candidate, not a deployment-only variation.
- Desktop and 390 px Playwright smoke tests: one `h1`, one `main`, title and `lang=en`; no horizontal overflow; keyboard Tab lands on the skip link with a visible `rgb(255, 180, 84)` 3 px outline; Enter loads the sample recipe; invalid manifest recovery works; no console or page errors.
- Axe on both viewports: 0 serious/critical findings. `prefers-reduced-motion: reduce` reduced animation and transition durations to `1e-05s`.
- Browser request capture found no third-party runtime requests. Source inspection found no analytics, cookie/local/session/IndexedDB persistence, beacon, or upload path; selected manifest data is parsed locally.
- Privacy and terms routes returned 200. Offline event feedback worked and an offline controlled reload retained a `main` landmark.
- Root response: HTTPS 200, HSTS, `nosniff`, and strict-origin-when-cross-origin referrer policy. No CSP, frame-ancestors/X-Frame-Options, Permissions-Policy, or long-lived immutable asset cache policy was observed; the first three are hardening opportunities, while caching is recorded above as P2.

### Budget and performance evidence

- Production artifacts: JS 4.32 KB raw / 1.94 KB gzip; CSS 9.38 KB raw / 2.90 KB gzip; no webfonts; WebP hero 39,312 bytes. All are within 200 KB JS, 50 KB CSS, 120 KB font, and 300 KB hero budgets.
- Live mobile Lighthouse (simulated throttling): Performance 99, Accessibility 100, Best Practices 100, SEO 100; LCP 1,077 ms, CLS 0, TBT 92 ms. Lighthouse exited non-zero only after report generation because its headless tab crashed during final screenshot/BFCache collection; the JSON report was written and the independent browser checks above had no crash or console error.

## Retest required

1. Build a versioned service-worker/cache update mechanism and prove a previously controlled browser receives a changed shell and changed asset graph without clearing site data.
2. Configure immutable long-lived cache headers for content-hashed assets, retaining a short/revalidating policy only for HTML and the service worker.
3. Re-run `npm test`, `npm run build`, the release CLI mixed-archive exercise, and the live controlled-client update test.
