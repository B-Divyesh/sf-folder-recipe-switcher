# Perfection-loop polish 4 — PASS

**Work order:** `folder-recipe-switcher-polish-4`
**Reviewed candidate:** `769abdd4c065aa53b26f2f637a4e319036dd38b4`
**Repair:** `c310b1bac8ca8ed8d52cecef358f55f0772cf76e`
**Live:** <https://folder-recipe-switcher.sociobot.in/> (`build 20260828-polish4`)

Every finding in `.factory/review-1.md` through `.factory/review-4.md`, each prior polish record, and both verification reports is closed. No severity was deferred.

## Evidence key

- **Clean claims:** every one of the 16 commands in `.factory/claims.json` was invoked independently from `/tmp/folder-recipe-polish4-clean.SUygY6/repo` at `c310b1b` and passed.
- **Aggregate:** `cargo fmt --all -- --check`, strict Clippy, `npm test`, `npm run build`, `cargo package --manifest-path cli/Cargo.toml --allow-dirty`, and the generated copy-audit check all passed in that clone. `npm test` includes 6 Rust tests, 10 static contracts, 16 claim tests, and the desktop/390 px browser suite with Axe.
- **Live:** [factory verifier](evidence/polish-4/live/verify.json), [route/privacy/offline/Axe sweep](evidence/polish-4/live/live-recheck.json), [home mobile](evidence/polish-4/live/home-mobile.png), and [demo mobile](evidence/polish-4/live/demo-mobile.png). Each referenced live URL below returned the stated result during the cold recheck.

## Cumulative finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the job-first headline, named photographer audience, primary sample action, outcome note, and three plain facts. | Playwright `first screen explains the job…`; [home mobile](evidence/polish-4/live/home-mobile.png); live `/` 200. |
| F-1-2 | Kept the one-click `/demo/` and `?demo=1` entries, persistent banner, Reset, Start for real, in-memory sample, bundled command-line demo, and distinct temporary folders. | `@claim:web-demo-isolated`, `@claim:demo-isolated`; [demo mobile](evidence/polish-4/live/demo-mobile.png); live `/demo/` and `/?demo=1`. |
| F-1-3 | Expanded the ledger to 16 exact one-tag claim regressions. | Static `claim ledger has one executable tagged test…`; all 16 clean claim commands. |
| F-1-4 | Retained concrete tested write/check/export metadata. | `@claim:recipe-write`, `@claim:nearest-inheritance`, `@claim:checklist-export`; live `/` source. |
| F-1-5 | Retained recording of file types. | `@claim:recipe-write`; live `/demo/` result. |
| F-1-6 | Retained photo-safety wording only with hash coverage. | `@claim:originals-unchanged`; live `/`. |
| F-1-7 | Kept unmeasured “small” wording removed. | Generated copy audit; live `/`. |
| F-1-8 | Kept explicit named editor-profile mappings. | `@claim:recipe-write`; live `/demo/`. |
| F-1-9 | Kept the unchanged-photo fact with regression coverage. | `@claim:originals-unchanged`; live `/`. |
| F-1-10 | Kept current-folder and nearest-parent recipe resolution. | `@claim:nearest-inheritance`; live `/#workflow`. |
| F-1-11 | Kept inspection of the supplying recipe-file path. | `@claim:nearest-inheritance`; live `/demo/`. |
| F-1-12 | Kept deterministic sorted checklist export. | `@claim:checklist-export`; live `/`. |
| F-1-13 | Kept same-origin browser processing. | `@claim:browser-private`; live request capture in [live recheck](evidence/polish-4/live/live-recheck.json). |
| F-1-14 | Kept selected recipe files in memory only. | `@claim:browser-private`; live zero storage/cookies. |
| F-1-15 | Kept JSON-only input and version-specific recovery. | Playwright `recipe file actions…`; live `/demo/`. |
| F-1-16 | Kept controlled Demo reload and Reset offline. | `@claim:offline-demo`; live offline Demo recheck. |
| F-1-17 | Kept exact MIT/no-account fact. | `@claim:mit-free`; live `/terms/` 200. |
| F-1-18 | Kept short README explanations of write, inheritance, and checklist jobs. | Generated copy audit; clean write/inheritance/checklist claims. |
| F-1-19 | Kept original photos and editor sidecar files unchanged. | `@claim:originals-unchanged`; live `/privacy/`. |
| F-1-20 | Kept non-interactive command behavior. | `@claim:cli-contract`; clean aggregate suite. |
| F-1-21 | Kept documented 0/2/1 exit behavior. | `@claim:cli-contract`; clean aggregate suite. |
| F-1-22 | Kept repeatable version-1 recipe text. | `@claim:recipe-write`; clean aggregate suite. |
| F-1-23 | Kept nearer-parent override coverage. | `@claim:nearest-inheritance`; clean aggregate suite. |
| F-1-24 | Kept extra-field tolerance and clear non-version-1 recovery. | `@claim:future-fields`; clean aggregate suite. |
| F-1-25 | Kept the current aggregate test instruction. | Clean `npm test`; README. |
| F-1-26 | Kept release binary and static-site build artifacts. | `@claim:build-outputs`; clean `npm run build`; live `/`. |
| F-1-27 | Replaced the partial promise with the exact ledger claim “sends no usage data and runs without a network connection.” The regression denies networking across demo, init, inspect, and checklist and checks their write boundary. | `@claim:cli-offline`; live `/privacy/` 200 and current copy. |
| F-1-28 | Expanded the browser claim to assert selected-file memory behavior, same-origin requests, and a public-only cache. | `@claim:browser-private`; live zero storage/cookies. |
| F-1-29 | Kept the requested-output-only boundary. | `@claim:originals-unchanged` and strengthened `@claim:cli-offline`; live `/privacy/`. |
| F-1-30 | Kept complete command-line demo coverage with denied socket/connect calls. | `@claim:cli-offline`; clean clone. |
| F-1-31 | Kept no-upload/no-persistence selected-file flow. | `@claim:browser-private`; live request/storage sweep. |
| F-1-32 | Added exact `site-no-tracking` ledger claim and regression across Home, Demo, Privacy, Terms, and selected-file flow with explicit request allowlist, empty cookies, no account form, and self-hosted tracking-free runtime scripts. | `@claim:site-no-tracking`; live [recheck](evidence/polish-4/live/live-recheck.json). |
| F-1-33 | Kept one visitor vocabulary and regenerated copy audit. | Static copy-audit contract; `.factory/copy-audit.md`; live `/demo/`. |
| F-1-34 | Kept task-specific headings and destination-specific external links. | Playwright navigation/Axe checks; live `/`. |
| F-1-35 | Kept real Demo route and styled HTTP 404. | Playwright route check; live `/demo/` 200 and `/not-a-real-page` 404. |
| F-1-36 | Kept complete route-specific ordinary, canonical, OG, and Twitter metadata. | Static metadata contracts; live `/`, `/demo/`, `/privacy/`, `/terms/`, and 404 source. |
| F-1-37 | Kept shared skip/header/footer/legal shell and updated its build identifier to polish 4. | Playwright route shell check; live legal/404 routes. |
| F-1-38 | Kept CSP, Permissions Policy, frame denial, nosniff, and referrer policy. | Static header contract; live CSP in [recheck](evidence/polish-4/live/live-recheck.json). |
| F-2-1 | Kept the local/offline first-screen fact and claim coverage. | `@claim:cli-offline`; [home mobile](evidence/polish-4/live/home-mobile.png). |
| F-2-2 | Kept history restoration heading focus and live announcement. | Playwright Back-navigation checks; live app/legal routes. |
| F-3-1 | Kept the visible 3 px amber proxy focus ring on file selection. | Playwright `recipe file actions…`; live keyboard focus check. |
| F-3-2 | Kept a Reset regression that changes a file first and then clicks Start for real. | `@claim:web-demo-isolated`; live Reset/exit recheck. |
| F-3-3 | Kept two bare command-line demos under one temporary parent. | `@claim:demo-isolated`; clean clone. |
| F-3-4 | Kept fresh-prefix install/version coverage. | `@claim:install-version`; clean clone. |
| F-3-5 | Kept camera, source, and file-type assertions. | `@claim:recipe-write`; live `/demo/`. |
| F-3-6 | Kept the non-overstated aggregate quality instruction. | Generated copy audit; clean `npm test`. |
| F-3-7 | Kept the README safety statement scoped to tested operations. | `@claim:originals-unchanged`; README. |
| F-3-8 | Kept 44×44 px mobile header/footer targets. | Playwright mobile target test; live 390 px sweep. |
| F-3-9 | Kept the labelled figure in place of nested complementary landmark. | Axe zero-violation suite; live Axe route sweep. |
| F-3-10 | Kept visitor-facing command-line wording instead of unexplained CLI. | Generated copy audit; live `/` and `/privacy/`. |
| F-3-11 | Kept plain recipe-file status/recovery wording. | Playwright recovery test; live `/demo/`. |
| F-3-12 | Kept generated copy audit with one whitespace counter and rendered strings. | Static copy-audit contract; `.factory/copy-audit.md`. |
| Verification P1 | Kept revisioned worker, network-first navigation, and controlled future-shell adoption. | Playwright `controlled client adopts a future shell…`; live offline Demo reload. |
| Verification P2 | Kept immutable hashed-asset caching. | Static cache-policy test; live asset headers. |
| F-4-1 | Replaced “Build the single Rust binary from source” with “Build the Folder Recipe command from its Rust source” on landing and README. | Generated copy audit; live `/#install`. |
| F-4-2 | Replaced schema/deterministic prose with the plain result: version-1 files produce the same text and ignore extra fields. | Generated copy audit; `@claim:recipe-write`, `@claim:future-fields`. |
| F-4-3 | Replaced hash/sidecar test jargon with the unchanged-outcome sentence. | Generated copy audit; `@claim:originals-unchanged`. |
| F-4-4 | Replaced browser-engine names with “cookies or any browser storage.” | Generated copy audit; `@claim:browser-private`; live `/`. |

## Final production check

The factory static deployer uploaded `dist/site` after `npm ci && npm run build:site`. The cold live check found build `20260828-polish4`, zero console errors, all expected title/lang/main/alt checks, no mobile overflow, no storage/cookies, no off-origin requests, zero Axe violations, working offline Demo reload/reset, and a designed 404. [Lighthouse](evidence/polish-4/live/lighthouse.json) reported 100/100/100/100 for Performance/Accessibility/Best Practices/SEO (LCP 1,039 ms, CLS 0, TBT 45 ms).
