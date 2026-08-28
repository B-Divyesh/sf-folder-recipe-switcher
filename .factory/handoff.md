# Folder Recipe polish 3 handoff

**Work order:** `folder-recipe-switcher-polish-3`
**Final commits:** `5ea2cb0`, `45c0084`
**Deployment:** `a9790f74-3c3d-4752-b3f1-6da01588007c`
**Live:** <https://folder-recipe-switcher.sociobot.in/>

## Delivered

- Repaired every finding from reviews 1–3, both prior polish reports, and both
  verification reports. The complete finding map is in `.factory/polish-3.md`.
- Made `/demo/` the published first-click demo URL with complete server-source
  metadata. `?demo=1` remains an isolated compatible entry. Both show the
  persistent no-save banner, Reset demo, and Start for real.
- Put the actual sample result in the first 390×844 demo viewport, including
  shoot, editor, profile, reason, and readiness.
- Added a visible proxy focus ring for the real file picker, 44×44 navigation
  targets, zero-violation Axe coverage, full 404 social metadata, consistent
  visitor terminology, and generated copy-audit enforcement.
- Expanded the claims ledger to 15 independently runnable tests. New coverage
  proves bare temporary CLI demos, reset/exit behavior, camera/source fields,
  and a fresh-prefix documented installation/version.

## Run and verify

```sh
npm ci
npm test
npm run build
cargo package --manifest-path cli/Cargo.toml --allow-dirty
```

`npm run audit:copy` regenerates `.factory/copy-audit.md`. The deployable site
is `dist/site`; the release binary is `dist/bin/folder-recipe`.

Final clean-clone evidence is `/tmp/folder-recipe-polish3-final.MwEFsB/clean`:
all 15 ledger commands passed separately, followed by formatting, strict
Clippy, aggregate `npm test`, build, package verification, and copy-audit
check. The aggregate suite passed 6 Rust tests, 10 static tests, 15 claim
tests, and 15 executed browser tests across desktop and 390×844 mobile.

## Live evidence

`.factory/evidence/polish-3/live/` contains the cold verifier report,
mobile/desktop screenshots, route and privacy recheck, Lighthouse report, and
artifact SHA-256 equality report. The live cold check found zero console errors,
zero Axe violations, no browser persistence, only same-origin requests, working
offline demo reload, and no mobile overflow. Lighthouse scored 99 performance,
100 accessibility, 100 best practices, and 100 SEO (LCP 1.546 s, CLS 0, TBT 0).

## Known gaps / next steps

None. Do not publish the crate from this repository; use the factory-owned
release process when publishing is intended.
