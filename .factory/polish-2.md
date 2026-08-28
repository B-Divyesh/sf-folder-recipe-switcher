# Perfection-loop polish 2 — PASS

**Work order:** `folder-recipe-switcher-polish-2`

**Reviewed candidate:** `e284c7c5e20caaef997bb99bc6d3e7a672ba7f4d`

**Review commit:** `7219648a87da98a0137962b3cbe1913907f6e52b`

**Repair commits:** `3a0e09e2e42c447063b0dee1639780ee970c2ba8`, `1d7f89ef516fd34f3b127eb790de004cf7358792`

**Deployment:** `fde52489-3148-4902-910d-9d07d429f762`

**Live URL:** <https://folder-recipe-switcher.sociobot.in/>

Every finding in both review reports, both earlier verification reports, and polish 1 is resolved and rechecked. There are no deferred minor findings.

## Round 2 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-33 | Standardized visible language to “recipe file,” “editor profile,” “saved in this folder,” and “camera, source, and file types.” Updated landing, rendered demo/error states, README, CLI help, errors, and checklist output. | Playwright `sample manifest works with keyboard…`; `.factory/copy-audit.md`; [live mobile demo](evidence/polish-2/live/demo-mobile.png); live `/?demo=1` labels captured in [cold-check.json](evidence/polish-2/live/cold-check.json). |
| F-2-1 | Changed the fact to “Runs locally without a network connection.” Updated `cli-offline` in the claims ledger and asserted the rendered location as part of the network-denied CLI demo test. | `@claim:cli-offline`; [live mobile demo](evidence/polish-2/live/demo-mobile.png); live first-screen fact ends at y=585 px in [cold-check.json](evidence/polish-2/live/cold-check.json). |
| F-2-2 | Detects `back_forward` navigation in the Vite app and static route script, then focuses and announces the route heading. Added app and legal-route Back regressions. | Playwright `first screen explains the job and demo route restores focus after Back` and `static routes restore heading focus and announcement after Back`; live app and Privacy Back checks show active `h1` plus non-empty announcements in [cold-check.json](evidence/polish-2/live/cold-check.json). |

## Cumulative review 1 findings

| Finding | Change made or retained | Evidence |
| --- | --- | --- |
| F-1-1 | Retained the job-first headline, named photographer audience, one-click sample action, outcome note, and three concrete facts. | Playwright `first screen explains the job…`; [live mobile demo](evidence/polish-2/live/demo-mobile.png); live `/` 200 with all facts above 844 px. |
| F-1-2 | Retained `?demo=1`, `/demo/`, the in-memory banner/reset/exit flow, bundled CLI sample, and unique temp output. | `@claim:demo-isolated`, `@claim:web-demo-isolated`; [live desktop demo](evidence/polish-2/live/demo-desktop.png); live `/demo/` 200. |
| F-1-3 | Retained 14 unique claims with exactly one tagged test each; revised the local-operation claim. | All 14 ledger commands passed separately in clean clone `/tmp/folder-recipe-polish2.XZ5yAG`; `npm test` passed. |
| F-1-4 | Metadata states the tested write/check/export job without vague promises. | `@claim:recipe-write`, `@claim:nearest-inheritance`, `@claim:checklist-export`; live metadata in [routes-links.json](evidence/polish-2/live/routes-links.json). |
| F-1-5 | Folder inspection reports observed file types. | `@claim:recipe-write`; live `/?demo=1` shows “Camera, source, and file types.” |
| F-1-6 | Photo safety wording remains backed by hashes across operations. | `@claim:originals-unchanged`; live `/` 200. |
| F-1-7 | No unmeasured “small” claim remains. | `@claim:recipe-write`; `.factory/copy-audit.md`; live `/` copy check. |
| F-1-8 | Copy promises named editor profiles, not arbitrary editor support. | `@claim:recipe-write`; [live demo](evidence/polish-2/live/demo-desktop.png). |
| F-1-9 | “Photos stay unchanged” remains hash-tested. | `@claim:originals-unchanged`; live `/` 200. |
| F-1-10 | The page explains whether the current folder or nearest parent supplied the recipe file. | `@claim:nearest-inheritance`; live `/#workflow` 200. |
| F-1-11 | Inspect reports and tests the supplying recipe-file path. | `@claim:nearest-inheritance`; live terminal transcript at `/`. |
| F-1-12 | Checklist copy describes editor/profile steps and sorted output. | `@claim:checklist-export`; live `/` 200. |
| F-1-13 | Browser privacy wording is precise and same-origin requests are intercepted. | `@claim:browser-private`; live `onlySameOrigin: true` in [cold-check.json](evidence/polish-2/live/cold-check.json). |
| F-1-14 | Selected files remain in memory with zero cookies, local/session storage, IndexedDB, or OPFS entries. | `@claim:browser-private`; live storage zeros in [cold-check.json](evidence/polish-2/live/cold-check.json). |
| F-1-15 | The checker accepts JSON recipe files and gives a version-specific recovery action. | Playwright `invalid recipe files produce an actionable error`; live `/?demo=1` 200. |
| F-1-16 | The demo and recipe checker remain available after an offline reload. | `@claim:offline-demo`; live offline sample and notice in [cold-check.json](evidence/polish-2/live/cold-check.json). |
| F-1-17 | The exact MIT fact and license link remain. | `@claim:mit-free`; live Terms and GitHub license checks are 200. |
| F-1-18 | README keeps the write, inheritance, inspection, and checklist jobs in separate short sentences. | `@claim:recipe-write`, `@claim:nearest-inheritance`, `@claim:checklist-export`; `.factory/copy-audit.md`. |
| F-1-19 | Photo and sidecar contents remain unchanged. | `@claim:originals-unchanged`; live Privacy 200. |
| F-1-20 | Commands remain non-interactive with closed stdin. | `@claim:cli-contract`; clean-clone `npm test`. |
| F-1-21 | Exit codes 0, 2, and 1 remain documented and exercised. | `@claim:cli-contract`; clean-clone `npm test`. |
| F-1-22 | Schema-v1 output remains deterministic byte for byte. | `@claim:recipe-write`; clean-clone `npm test`. |
| F-1-23 | Nearest-parent override remains tested across three levels. | `@claim:nearest-inheritance`; clean-clone `npm test`. |
| F-1-24 | Unknown schema-v1 fields work and schema v2 fails clearly. | `@claim:future-fields`; clean-clone `npm test`. |
| F-1-25 | The documented `npm test` command matches and passes the complete suite. | Clean clone `/tmp/folder-recipe-polish2.XZ5yAG`: `npm test` passed 6 Rust, 6 static, 14 claim, and 14 browser checks. |
| F-1-26 | Build creates the release binary and complete deployable site. | `@claim:build-outputs`; clean-clone `npm run build`; live artifacts match local SHA-256. |
| F-1-27 | CLI network, browser privacy, and account/payment scope remain separate and tested. | `@claim:cli-offline`, `@claim:browser-private`, `@claim:mit-free`; live same-origin/storage check. |
| F-1-28 | Browser copy names its in-memory behavior and storage remains empty. | `@claim:browser-private`; live storage zeros in [cold-check.json](evidence/polish-2/live/cold-check.json). |
| F-1-29 | The CLI changes only the requested recipe/checklist outputs. | `@claim:originals-unchanged`; clean-clone claim pass. |
| F-1-30 | The CLI demo completes with socket and connect calls denied. | `@claim:cli-offline`; clean-clone claim pass. |
| F-1-31 | The selected-file flow neither uploads nor persists content. | `@claim:browser-private`; live same-origin and storage evidence. |
| F-1-32 | The site remains free of analytics, ads, accounts, cookies, and third-party scripts. | `@claim:browser-private`, `@claim:mit-free`; live request/storage evidence. |
| F-1-34 | Task headings and explicit GitHub destination labels remain throughout the shared shell. | Playwright Axe/navigation checks; all live links in [routes-links.json](evidence/polish-2/live/routes-links.json). |
| F-1-35 | `/demo/` remains a real demo; unknown URLs return the designed 404. | Playwright route test; live `/demo/` 200 and `/not-a-real-page` 404 in [routes-links.json](evidence/polish-2/live/routes-links.json). |
| F-1-36 | Root, demo, legal pages, and 404 retain unique titles, descriptions, canonicals, OG/Twitter art, and icons. | Playwright `route metadata…`; live route matrix in [routes-links.json](evidence/polish-2/live/routes-links.json). |
| F-1-37 | Legal and 404 routes retain the skip link, common header/nav/footer, legal links, factory credit, and polish-2 build ID. | Playwright `route metadata…`; live route matrix in [routes-links.json](evidence/polish-2/live/routes-links.json). |
| F-1-38 | CSP, Permissions Policy, clickjacking protection, nosniff, and referrer policy remain enforced. | Static policy test; live headers checked on root, demo, legal, 404, assets, and worker. |
| Verification P1 | Revisioned service-worker caches and network-first navigation remain. | Playwright `a controlled client adopts a future shell…` on desktop/mobile; live demo offline reload passes. |
| Verification P2 | Hashed assets retain one-year immutable caching. | Static cache-policy test; live JS/CSS return `max-age=31536000, immutable`. |

## Final evidence

- Clean clone: `/tmp/folder-recipe-polish2.XZ5yAG` at repair commit `3a0e09e`; final terminology-only source changes were rerun locally and are rechecked below from final HEAD.
- Each of the 14 claim commands passed independently; the aggregate suite also passed.
- `cargo fmt --all -- --check`, strict Clippy, `npm test`, `npm run build`, and `cargo package --manifest-path cli/Cargo.toml` passed.
- Playwright: 14/14 across desktop Chromium and 390×844 mobile. Axe found zero serious or critical issues.
- Live Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100; LCP 979 ms, CLS 0, TBT 5 ms.
- Payload: JS 2,496 B gzip, CSS 3,237 B gzip, no fonts, hero 39,312 B.
- Live files for root HTML, hashed JS/CSS, hero, and service worker matched `dist/site` by SHA-256.

No finding of any severity remains unresolved.
