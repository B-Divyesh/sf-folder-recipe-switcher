# Independent verification 2 — PASS

**Work order:** `folder-recipe-switcher-verify-2`  
**Candidate tested:** `f0404f707c0788e7162bd661717277d47b03971e` (`main`)  
**Live URL:** <https://folder-recipe-switcher.sociobot.in/>  
**Verified:** 2026-08-28 UTC  
**Scope:** clean-checkout, independent CLI/PWA/static-site QA. No product-source files were modified.

## Result

**PASS.** The candidate builds and packages successfully, fulfils the researched CLI job-to-be-done, and the live deployment is byte-identical to the freshly built candidate. The earlier service-worker/caching failure is repaired: the generated release-update regression passes on desktop and 390 px mobile, and a live controlled client can reload offline.

## Clean-checkout quality gates

All commands below completed with exit status 0 from the pinned checkout:

```sh
npm ci
cargo fmt --all -- --check
cargo clippy --workspace --all-targets -- -D warnings
npm test
npm run build
cargo package --manifest-path cli/Cargo.toml
```

- `npm ci`: installed 21 packages; audit reported 0 vulnerabilities.
- `npm test`: passed Rust unit/integration coverage, static-site contracts, and the Playwright desktop/390 px suite.
- `npm run build`: produced `dist/bin/folder-recipe` and deploy root `dist/site`.
- There is no separate lint/typecheck script beyond Rust formatting/Clippy; Vite production compilation completed successfully.
- `cargo package` completed successfully. The resulting crate was extracted into a new temporary consumer, installed with `cargo install --path … --root … --force`, and its installed binary reported `folder-recipe 0.1.0` and helpful command/subcommand help.

## Independent CLI acceptance exercise

Using `dist/bin/folder-recipe` against a newly created mixed archive:

- Created an explicit RawTherapee/darktable portrait recipe, a darktable scan recipe, and an empty incoming folder. The generated manifests were readable versioned JSON with explicit editor-to-profile mappings.
- A direct child correctly reported the portrait recipe as inherited **one level** above and warned about an unexpected `tiff` extension. An empty folder reported that the recipe remains ready for future files.
- JSON checklist export contained exactly the three manifested folders and their recommended editor/profile pairs.
- SHA-256 values for representative `.RAF`, `.jpg`, and `.TIFF` originals were unchanged before and after all CLI operations.
- Unsafe/invalid recovery paths each exited **2** and gave actionable output: existing manifest without `--force`, multiple mappings without `--recommend`, malformed `--map broken`, and a manifest with `schema_version: 2`.

## Live deployment, browser, privacy, and accessibility

- Fresh downloads of `/`, `/assets/index-C4NnQX5H.js`, `/assets/index-CYrgvcOE.css`, `/sw.js`, and `/archive-room.webp` had SHA-256 equality with the fresh `dist/site` build. This confirms the live deployment is the candidate, not a deployment-only variant.
- Desktop (1440 px) and mobile (390×844) Playwright runs found one `h1`, one `main`, `lang=en`, the correct title, no horizontal overflow, and no console/page/request errors.
- Keyboard-only use: the first Tab reaches the skip link. After transition settlement it has a visible `rgb(255, 180, 84)` 3 px outline; Enter activates the sample manifest. A schema-v2 selected manifest displays the actionable recovery state.
- Axe on both viewports: **0 serious/critical** violations. Under `prefers-reduced-motion: reduce`, animation duration was `1e-05s` (0.01 ms) and no layout overflow occurred.
- Browser request capture recorded only the product origin. Fresh browser contexts had `localStorage` and `sessionStorage` length 0; source audit found no analytics, beacon, cookie, IndexedDB, upload, or third-party-script path. `/privacy/` and `/terms/` both returned 200.
- Live PWA: a controlled client used revisioned cache `folder-recipe-9294949c86b58a18`; an offline reload retained the `main` landmark. The generated controlled-client future-shell/future-asset update regression was re-run separately and passed on both configured projects (desktop and 390 px) without clearing site data.

## Performance, caching, and response policy

- Production files: JavaScript **4,346 B raw / 1,980 B gzip**, CSS **9,376 B raw / 2,904 B gzip**, no webfonts, hero WebP **39,312 B**. All stated budgets pass.
- Fresh mobile Lighthouse: **Performance 99, Accessibility 100, Best Practices 100, SEO 100**; LCP **1.1 s**, CLS **0**, TBT **110 ms**.
- Live headers: HTML uses `public, max-age=0, must-revalidate`; `/sw.js` uses `no-cache`; both hashed assets use `public, max-age=31536000, immutable`. HSTS, `X-Content-Type-Options: nosniff`, and `Referrer-Policy: strict-origin-when-cross-origin` are present.

## Defects by severity

No release-blocking, high, medium, or low product defects were found.

**Informational hardening opportunity:** the root response does not currently send CSP, Permissions-Policy, or clickjacking protection (`frame-ancestors`/`X-Frame-Options`). This is not an acceptance-contract failure for this local, no-account static CLI documentation site, but deployment configuration can add those policies in a future hardening pass.

