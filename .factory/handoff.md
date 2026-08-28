# Folder Recipe polish 4 handoff

**Work order:** `folder-recipe-switcher-polish-4`
**Reviewed candidate:** `769abdd4c065aa53b26f2f637a4e319036dd38b4`
**Repair commit:** `c310b1bac8ca8ed8d52cecef358f55f0772cf76e`
**Live:** <https://folder-recipe-switcher.sociobot.in/>
**Deployment:** static work-order build (`npm ci && npm run build:site`) uploaded with `/opt/fleet/lib/deploy-static.sh`; live footer is `build 20260828-polish4`.

## Delivered

- Closed the two reopened privacy-contract failures with exact claim text and executable regressions.
  - `cli-offline` now denies socket/connect calls while exercising demo, init, inspect, and checklist. It also checks that each command writes only its documented local output.
  - `site-no-tracking` visits Home, Demo, Privacy, Terms, and a selected-file flow. It checks a strict same-origin request allowlist, empty cookies/storage, no account form, and self-hosted runtime scripts without tracking, advertising, account, or payment code.
- Rewrote every round-four jargon finding in landing/README copy: “binary,” “schema/deterministic,” “hash/sidecars,” and browser-storage engine names are gone from visitor-facing prose.
- Kept the blue-hour archive identity, job-first first screen, isolated `/demo/` and `?demo=1` paths, metadata, legal routes, focus behavior, styled 404, mobile result panel, and offline service-worker behavior intact.
- Updated the build identifier, catalog description, copy audit, and README deployment instructions.

## Verification

Clean clone: `/tmp/folder-recipe-polish4-clean.SUygY6/repo` at repair commit `c310b1b`.

- `npm ci` passed with 0 reported vulnerabilities.
- Every one of the 16 ledger commands ran independently and passed: `demo-isolated`, `recipe-write`, `originals-unchanged`, `nearest-inheritance`, `checklist-export`, `cli-contract`, `future-fields`, `cli-offline`, `install-version`, `build-outputs`, `scope-boundary`, `web-demo-isolated`, `browser-private`, `site-no-tracking`, `offline-demo`, and `mit-free`.
- `cargo fmt --all -- --check`, strict `cargo clippy --workspace --all-targets -- -D warnings`, `npm test`, `npm run build`, `cargo package --manifest-path cli/Cargo.toml --allow-dirty`, and `node scripts/generate-copy-audit.mjs --check` passed in that clone. The package is ready for the factory-owned publish flow; do not publish it from this repository.
- Aggregate `npm test` passed 6 Rust unit/integration tests, 10 static contracts, all 16 claims, and the desktop/390 px Playwright suite. Axe reported zero violations on Home, Demo, Privacy, and Terms. The deliberate desktop-only target check remains skipped in the desktop project.
- Live factory verification: [verify.json](evidence/polish-4/live/verify.json) records HTTPS 200, title, `lang`, one h1, main landmark, image alt coverage, no unlabeled buttons, and zero console errors. [live-recheck.json](evidence/polish-4/live/live-recheck.json) records Home/Demo/Privacy/Terms 200, designed 404, route CSP, empty storage/cookies, same-origin request capture, offline Demo reload/reset, and zero Axe violations.
- Live cold screenshots: [desktop](evidence/polish-4/live/screenshot-desktop.png), [home mobile](evidence/polish-4/live/home-mobile.png), and [demo mobile](evidence/polish-4/live/demo-mobile.png). The mobile checks confirmed the first-screen job/action/facts and the demo shoot, editor, profile, reason, and readiness are visible within 390×844.
- Live Lighthouse report: [lighthouse.json](evidence/polish-4/live/lighthouse.json) records Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1,039 ms, CLS 0, TBT 45 ms. Lighthouse printed a post-report tab-crash message after writing the complete report; the independent live browser sweep had no page or console errors.
- Payload: JavaScript 2,809 B gzip, CSS 3,500 B gzip, no webfonts, and hero art 39,312 B.

## Run and deploy

```sh
npm ci
npm test
npm run build
cargo package --manifest-path cli/Cargo.toml --allow-dirty
```

The deployable static output is `dist/site`. The work-order deployment command is `npm ci && npm run build:site`, followed by the factory static deployer.

## Known gaps

None. All findings from review 1–4 and both verification reports were rechecked; no production defect remains open.
