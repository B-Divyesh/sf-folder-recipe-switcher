# Perfection-loop polish 3 — PASS

**Work order:** `folder-recipe-switcher-polish-3`
**Reviewed base:** `2ecfb535e1c9d251e33dbccb9148b6f29a59ac8f`
**Review:** `5ff03a989e2f3120892a7b21d8916b153cbd9337`
**Repair commits:** `5ea2cb0`, `45c0084`
**Deployment:** `a9790f74-3c3d-4752-b3f1-6da01588007c`
**Live URL:** <https://folder-recipe-switcher.sociobot.in/>

All current and historical findings are closed. Evidence paths below are under
`.factory/evidence/polish-3/live/`; `live-recheck-final.json` is a cold live
browser check, and `artifact-equality.json` proves the deployed response bytes
match the final local build.

## Review 3 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-2 | Added a compact demo-result panel directly below the demo heading on phones. It shows the shoot, editor, profile, reason, and readiness before repeated landing controls. | Playwright `first screen explains the job and demo route restores focus after Back`; [live mobile demo](evidence/polish-3/live/demo-mobile.png); live values end at 314–483 px in `live-recheck-final.json`. |
| F-1-33 | Used **file types** in visitor copy, README, ledger, rendered output, and the generated terminology table. Technical `extensions` remains only as a field/flag name. | `copy audit is generated from current copy…`; `.factory/copy-audit.md`; live `/` and `/demo/` check. |
| F-1-36 | The CTA, README, and demo documentation use `/demo/`. The generated demo HTML has its own ordinary, canonical, OG, and Twitter metadata; the 404 now has a complete `og:url` too. `?demo=1` remains a working compatibility entry. | `the generated demo response has its own complete source metadata`; `the 404 route has complete route metadata`; live `/demo/` and 404 source records in `live-recheck-final.json`. |
| F-3-1 | Nested the real file input inside its visible label and styled `.file-picker:focus-within` with the amber 3 px ring. | Playwright `recipe file actions keep an actionable visible focus…`; live Tab result `rgb(255, 180, 84) solid 3px` in `live-recheck-final.json`. |
| F-3-2 | The web-demo claim first loads a different file, proves Reset restores the bundled profiles, clicks Start for real, and verifies the empty checker plus empty browser storage. | `@claim:web-demo-isolated` from the final clean clone; live demo banner/sample in `live-recheck-final.json`. |
| F-3-3 | The CLI demo claim now runs bare `folder-recipe demo` twice under one fresh `TMPDIR`, parses both printed paths, and asserts distinct complete samples plus inherited inspection. | `@claim:demo-isolated` from the final clean clone. |
| F-3-4 | Added the `install-version` ledger entry and a fresh-prefix `cargo install --path cli` regression that executes `folder-recipe --version`. | `@claim:install-version` from the final clean clone. |
| F-3-5 | `recipe-write` now passes `--camera` and `--source`, asserts both JSON fields, and names file types consistently. | `@claim:recipe-write` from the final clean clone; README and live demo copy check. |
| F-3-6 | Replaced the over-specific quality-suite promise with the plain instruction “Run all checks with `npm test`.” | Generated `.factory/copy-audit.md`; final clean-clone `npm test`. |
| F-3-7 | Rewrote the README to name exactly the checked operations: init, inspect, and checklist. | `@claim:originals-unchanged` from the final clean clone. |
| F-3-8 | Header and footer links now have a 44 px minimum inline and block size on landing and legal routes. | Playwright `mobile header and footer navigation targets are at least 44 pixels`; live 390 px sweep. |
| F-3-9 | Replaced the nested complementary landmark with a labelled `figure`; Axe now requires zero violations on both home and demo. | Playwright `sample manifest works with keyboard and has no accessibility violations`; live `axeHome` and `axeDemo` are empty. |
| F-3-10 | Replaced visitor-facing “CLI” with “command-line tool” or “command-line demo.” | `.factory/copy-audit.md`; live landing and Privacy checks. |
| F-3-11 | Replaced browser-facing schema status/error jargon with “Valid recipe file · version 1” and a plain recovery message. | Playwright `recipe file actions keep an actionable visible focus…`; browser regression in the final clean clone. |
| F-3-12 | Added `scripts/generate-copy-audit.mjs`; it reads static HTML, metadata, README prose, image alt text, actions, facts, and exported rendered/error strings using one whitespace counter. | Static test `copy audit is generated from current copy and has no unresolved flags`; generated `.factory/copy-audit.md`. |

## Cumulative review 1, review 2, and verification findings

| Finding | Change made or retained | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the job-first headline, named photographer audience, first-screen sample action, outcome note, and three plain facts. | Playwright `first screen explains…`; live 390 px fact bottoms 585, 613, and 642. |
| F-1-2 | Kept both isolated browser entry points, banner, Reset/Start-for-real, bundled command-line sample, and separate temporary CLI folders; repaired the mobile result order above. | `@claim:web-demo-isolated`, `@claim:demo-isolated`; [live demo](evidence/polish-3/live/demo-mobile.png). |
| F-1-3 | Ledger now contains 15 unique claims with exactly one tagged executable regression each. | Static test `claim ledger has one executable tagged test…`; all 15 final-clean-clone commands passed. |
| F-1-4 | Concrete metadata describes the tested save/check/export job. | `@claim:recipe-write`, `@claim:nearest-inheritance`, `@claim:checklist-export`; live root source check. |
| F-1-5 | The tool records file types it finds. | `@claim:recipe-write`; live rendered “Camera, source, and file types.” |
| F-1-6 | Retained the photo-safety fact only with hash coverage. | `@claim:originals-unchanged`. |
| F-1-7 | Unmeasured “small” language remains absent. | Generated copy audit has no flags. |
| F-1-8 | Named, explicit editor profiles are demonstrated and tested. | `@claim:recipe-write`; live sample has RawTherapee and darktable profiles. |
| F-1-9 | “Does not change photos” is backed by hashes. | `@claim:originals-unchanged`; live first-screen fact. |
| F-1-10 | Current-folder and nearest-parent recipe resolution remain implemented. | `@claim:nearest-inheritance`. |
| F-1-11 | Inspection reports the supplying recipe-file path. | `@claim:nearest-inheritance`. |
| F-1-12 | Checklist export creates sorted recipe-folder rows. | `@claim:checklist-export`. |
| F-1-13 | Browser processing remains same-origin only. | `@claim:browser-private`; `onlySameOrigin: true` live. |
| F-1-14 | Selected recipe files remain memory-only. | `@claim:browser-private`; live storage values are all zero/empty. |
| F-1-15 | The checker accepts JSON files and gives an actionable version recovery. | Playwright recipe-file focus/recovery test. |
| F-1-16 | Controlled demo reload works offline after first visit. | `@claim:offline-demo`; live offline demo heading check. |
| F-1-17 | MIT/no-account wording and Terms remain exact. | `@claim:mit-free`; live `/terms/` 200. |
| F-1-18 | README uses short, one-purpose sentences for the tool’s jobs. | Generated copy audit; write/inheritance/checklist claim tests. |
| F-1-19 | Sample photo and sidecar hashes remain unchanged around tested operations. | `@claim:originals-unchanged`. |
| F-1-20 | Commands remain non-interactive. | `@claim:cli-contract`. |
| F-1-21 | Documented success/invalid/I-O exit behavior remains tested. | `@claim:cli-contract`. |
| F-1-22 | Version-1 recipe output remains deterministic. | `@claim:recipe-write`. |
| F-1-23 | Nearer-parent override remains asserted. | `@claim:nearest-inheritance`. |
| F-1-24 | Unknown version-1 fields remain tolerated and version 2 fails clearly. | `@claim:future-fields`. |
| F-1-25 | The documented aggregate check is current and passes. | Final-clean-clone `npm test`. |
| F-1-26 | Build still produces the binary and all deployable routes. | `@claim:build-outputs`; final-clean-clone `npm run build`. |
| F-1-27 | Local CLI operation, browser privacy, and no-account scope stay separately proved. | `@claim:cli-offline`, `@claim:browser-private`, `@claim:mit-free`. |
| F-1-28 | Browser-selected files are not persisted. | `@claim:browser-private`; live storage check. |
| F-1-29 | Only requested recipe/checklist outputs are written. | `@claim:originals-unchanged`. |
| F-1-30 | The command-line demo succeeds with network calls denied. | `@claim:cli-offline`. |
| F-1-31 | Browser demo/file flow does not upload or persist content. | `@claim:browser-private`; live same-origin/storage report. |
| F-1-32 | No analytics, payment, account, cookie, or third-party script path remains. | `@claim:browser-private`, `@claim:mit-free`; live request capture. |
| F-1-33 | Visitor terminology is now consistent; see the review-3 row. | Copy-audit terminology table and live demo. |
| F-1-34 | Headings and GitHub links remain task/destination specific. | Playwright accessibility/navigation checks; live link source check. |
| F-1-35 | `/demo/` is real and unknown routes return the designed HTTP 404. | Live route statuses in `live-recheck-final.json`. |
| F-1-36 | All routes now have complete route-specific metadata; see the review-3 row. | Live route source matrix, including 404 `og:url`. |
| F-1-37 | Shared skip link, header/nav, legal footer, Factory credit, and build ID remain on legal and 404 routes. | Playwright `route metadata, shared shell…`; live route checks. |
| F-1-38 | CSP, Permissions Policy, clickjacking protection, nosniff, and referrer policy remain enforced. | Live header check on root, demo, legal routes, and 404. |
| F-2-1 | The local/offline first-screen fact exactly matches its ledger claim. | `@claim:cli-offline`; live first-screen fact. |
| F-2-2 | Back/forward focus and live announcement remain covered for app and legal routes. | Playwright `first screen explains…` and `static routes restore heading focus…`. |
| Verification P1 | Revisioned worker caches, network-first navigation, and controlled future-shell adoption remain covered. | Playwright `a controlled client adopts a future shell…`; live offline reload. |
| Verification P2 | Hashed Vite assets retain immutable one-year caching. | Static cache-policy test; `artifact-equality.json` records immutable JS/CSS headers. |

## Final verification

- Final clean clone: `/tmp/folder-recipe-polish3-final.MwEFsB/clean` at `45c0084`.
- Each of the 15 `.factory/claims.json` commands passed independently there:
  `demo-isolated`, `recipe-write`, `originals-unchanged`,
  `nearest-inheritance`, `checklist-export`, `cli-contract`, `future-fields`,
  `cli-offline`, `install-version`, `build-outputs`, `scope-boundary`,
  `web-demo-isolated`, `browser-private`, `offline-demo`, and `mit-free`.
- `cargo fmt --all -- --check`, strict Clippy, `npm test`, `npm run build`, and
  `cargo package --manifest-path cli/Cargo.toml --allow-dirty` passed in that
  clone. The aggregate suite has 6 Rust, 10 static, 15 claim, and 15 executed
  Playwright tests across desktop and 390×844 mobile (one desktop-only target
  check is intentionally skipped on desktop).
- Live verifier: zero console errors; title/lang/h1/main/alt/button checks
  pass in `verify.json`.
- Live browser sweep: no overflow, all demo values above 844 px, same-origin
  traffic only, zero local/session/cookie/IndexedDB/OPFS data, visible file
  picker focus, offline controlled reload, and zero Axe violations in
  `live-recheck-final.json`.
- Live Lighthouse report: Performance 99, Accessibility 100, Best Practices
  100, SEO 100; LCP 1.546 s, CLS 0, TBT 0 in `lighthouse.json`. Lighthouse
  emitted a post-report tab-crash exit after writing this complete JSON report.
- Live artifacts for root, demo, legal routes, 404, worker, hero, social card,
  and hashed JS/CSS are byte-identical to `dist/site` in
  `artifact-equality.json`.

No finding of any severity remains unresolved.
