# Perfection-loop polish 1 — PASS

**Work order:** `folder-recipe-switcher-polish-1`

**Reviewed base:** `038e769d06bdea6953996d9307f79741d9f75fd1`

**Deployed repair:** `a3c7877e15aaf2a86e26410768df07ca52f63ef5`

**Live URL:** <https://folder-recipe-switcher.sociobot.in/>
**Cold re-check:** 2026-08-28 11:35 UTC

Every finding in `.factory/review-1.md` is resolved. There were no earlier `review-*` or `polish-*` reports. The two historical verification findings are also rechecked below.

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Replaced the metaphorical hero with “Save photo editor profiles beside folders,” named photographers, and made the sample the primary action with an outcome note and three facts. | Playwright `first screen explains the job…`; [mobile first screen](evidence/live/screenshot-mobile.webp); live `/` 200. |
| F-1-2 | Added `folder-recipe demo`, bundled `examples/`, unique temporary output, `/demo`, `?demo=1`, persistent banner, Reset, and Start-for-real controls. | `@claim:demo-isolated`, `@claim:web-demo-isolated`; [mobile demo](evidence/live/demo-mobile.webp); live `/demo` 200 with demo title. |
| F-1-3 | Added `.factory/claims.json`, 14 unique `@claim:` tests, and a runner supporting each ledger command. | Every ledger command ran separately from clean clone `6e5400e`; all 14 passed. |
| F-1-4 | Replaced vague metadata with the concrete write/check/export job and listed its observable behavior. | `@claim:recipe-write`, `@claim:cli-offline`; live root metadata check. |
| F-1-5 | Reworded as observed file counts/extensions and verified real folder scanning. | `@claim:recipe-write`. |
| F-1-6 | Retained “Does not change photos” only with full hash coverage. | `@claim:originals-unchanged`. |
| F-1-7 | Removed the unmeasured word “small”; the recipe file is now described as readable JSON. | `@claim:recipe-write`; `.factory/copy-audit.md`. |
| F-1-8 | Replaced “any editor” with “named editor profiles” and tests two explicit mappings. | `@claim:recipe-write`. |
| F-1-9 | Replaced the slogan with “Photos stay unchanged.” | `@claim:originals-unchanged`. |
| F-1-10 | Explained direct versus nearest-parent behavior in plain words. | `@claim:nearest-inheritance` checks distant, nearest, and direct cases. |
| F-1-11 | Inspect now promises and reports the supplying recipe path. | `@claim:nearest-inheritance`. |
| F-1-12 | Rewrote the checklist copy and verifies one sorted row per manifested folder. | `@claim:checklist-export`. |
| F-1-13 | Replaced “Nothing uploads” with a precise in-browser statement. | `@claim:browser-private` intercepts the complete selected-file flow. |
| F-1-14 | The checker keeps selected contents in memory only. | `@claim:browser-private` asserts zero cookies, local/session storage, IndexedDB, OPFS, and third-party requests. |
| F-1-15 | Replaced jargon with “Accepts a JSON recipe file” and actionable invalid-schema feedback. | Playwright `invalid manifests produce an actionable error`; `@claim:browser-private`. |
| F-1-16 | Offline wording now matches the demo and checker behavior. | `@claim:offline-demo` reloads and resets while the context is offline. |
| F-1-17 | Replaced “Free and open source” with the exact MIT license fact and linked the license. | `@claim:mit-free`; live Terms and repository links 200. |
| F-1-18 | Split the long README introduction into one-purpose write and recipe-file sentences. | `@claim:recipe-write`, `@claim:nearest-inheritance`, `@claim:checklist-export`; copy audit PASS. |
| F-1-19 | Retained the safety statement with photo and sidecar hashes across init, inspect, and checklist. | `@claim:originals-unchanged`. |
| F-1-20 | Reworded non-interactivity plainly and tests closed stdin plus timeouts. | `@claim:cli-contract`. |
| F-1-21 | Split exit-code copy into three short sentences and exercises codes 0, 2, and 1. | `@claim:cli-contract`. |
| F-1-22 | Replaced “stable” with deterministic schema-v1 JSON and verifies byte-for-byte repeat output. | `@claim:recipe-write`. |
| F-1-23 | Kept nearest-parent behavior with a three-level override fixture. | `@claim:nearest-inheritance`. |
| F-1-24 | Kept forward-field tolerance and tests an unknown object plus rejected schema v2. | `@claim:future-fields`. |
| F-1-25 | Updated the suite description to the exact commands now executed. | Clean-clone `npm test` passed Rust, static, 13 claim, and 12 browser-project tests. |
| F-1-26 | Kept exact build paths and asserts the release binary plus every deployable route artifact. | `@claim:build-outputs`; clean-clone `npm run build` passed. |
| F-1-27 | Split CLI network behavior, browser privacy, and account/payment scope into testable statements. | `@claim:cli-offline`, `@claim:browser-private`, `@claim:mit-free`. |
| F-1-28 | The browser privacy statement now names storage types. | `@claim:browser-private` also checks that cached requests contain only public same-origin URLs. |
| F-1-29 | The write boundary remains explicit and is checked by directory snapshot plus content hashes. | `@claim:originals-unchanged`. |
| F-1-30 | Runs the complete CLI demo with `socket` and `connect` denied by a preload shim. | `@claim:cli-offline` records zero attempted network syscalls. |
| F-1-31 | Selected recipe contents are checked in a fresh browser without upload or persistence. | `@claim:browser-private`; live cold check shows zero third-party requests/storage. |
| F-1-32 | Privacy copy is narrower and the complete flow is intercepted. | `@claim:browser-private`, `@claim:mit-free`, `@claim:scope-boundary`; live privacy section in `evidence/live/cold-check.json`. |
| F-1-33 | Standardized “recipe file,” “editor profile,” “inherited recipe,” and “import checklist”; rewrote all long/jargon copy. | `.factory/copy-audit.md` has no sentence over 22 words and no terminology or banned-word flag. |
| F-1-34 | Replaced every context-free heading and link with task language; GitHub links name the destination. | Playwright heading/link and Axe tests; [desktop demo](evidence/live/demo-desktop.webp). |
| F-1-35 | Added generated `/demo` HTML, direct `/demo` rewrite, route focus/announcement, and styled 404 response override. | Playwright `route metadata…`; live `/demo` = 200 and `/not-a-real-page` = 404; [404](evidence/local/not-found.webp). |
| F-1-36 | Added the required landing title, route metadata, canonicals, OG/Twitter tags, 1200×630 art, and 180 px icon. | Static contract and Playwright route tests; live cold route results in `evidence/live/cold-check.json`. |
| F-1-37 | Legal and 404 pages now share the skip link, header/nav, one-liner, Privacy/Terms links, factory credit, and build ID. | Playwright `route metadata, shared shell…`; live `/privacy/` and `/terms/` 200. |
| F-1-38 | Added enforceable CSP, Permissions-Policy, `frame-ancestors 'none'`, and `X-Frame-Options: DENY`. | Static config test; live response header capture on `/`, `/demo`, legal pages, and 404. |
| Historical P1 | Kept revisioned service-worker caches and network-first navigation, now including demo/404/social assets. | Playwright `controlled client adopts a future shell…` passes desktop and mobile; live offline cold check passes. |
| Historical P2 | Kept one-year immutable caching for hashed assets. | Static config test; live hashed JS returns `max-age=31536000, immutable`. |

## Verification evidence

- Clean clone: `/tmp/folder-recipe-claims-final.9raOVI`, commit `6e5400e89dd430431f5189a132e6a8cd96166c5b`.
- Each of the 13 `.factory/claims.json` commands passed separately from that clone.
- `cargo fmt --all -- --check`, strict Clippy, `npm test`, `npm run build`, and `cargo package` all passed there.
- Browser matrix: 12 Playwright checks passed across desktop Chromium and 390×844 mobile; Axe found zero serious/critical issues.
- Lighthouse mobile: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.01 s, CLS 0, TBT 0.
- Payload: JS 2,410 B gzip, CSS 3,237 B gzip, no fonts, hero 39,312 B, social image 73,266 B.
- Deployment ID: `08844f80-9773-4bfe-a108-9dc14759d7bc`.
- Live cold check: both viewports had zero console errors, zero overflow, focus on the demo h1, three facts inside 844 px, and no third-party requests.
- Live artifact checks: root HTML, JS, hero, service worker, demo, legal pages, and 404 were byte-identical to `dist/site`.

No finding of any severity remains open.
