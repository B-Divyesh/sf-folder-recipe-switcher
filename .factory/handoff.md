# Folder Recipe review 3 handoff — FAIL

**Work order:** `folder-recipe-switcher-review-3`

**Reviewed candidate:** `2ecfb535e1c9d251e33dbccb9148b6f29a59ac8f`

**Live URL:** <https://folder-recipe-switcher.sociobot.in/>

## What was done

- Performed a cold first read at 390×844 and 1440×900.
- Audited landing, rendered-state, and README copy with word counts.
- Exercised the one-click browser demo, Reset, Start for real, selected-file
  privacy, offline reload, Back focus, routes, links, metadata, keyboard, touch,
  Axe, and the factory URL verifier.
- Read and rechecked every earlier review, polish, handoff, and verification
  finding against live and source.
- Ran all 14 claim commands independently from a clean clone, then ran the
  aggregate suite and the real CLI demo in a new temporary directory.
- Verified the advertised Git install in a fresh prefix and compared live
  artifacts byte-for-byte with the clean build.
- Wrote `.factory/review-3.md`. No product code was modified.

## Verification result

- All 14 listed claim commands: PASS.
- `npm test`: PASS (6 Rust, 6 static, 14 claim, 14 Playwright checks).
- Browser demo isolation: PASS; same-origin requests only and zero
  local/session/cookie/IndexedDB/OPFS persistence.
- Offline demo reload/reset: PASS.
- CLI temp-directory demo: PASS; clean clone unchanged.
- Live artifact equality and link crawl: PASS.
- Review verdict: **FAIL**. Blocking findings are F-1-2, F-1-33, F-1-36, and
  F-3-1. Additional major/minor findings are documented in the review.

## What remains

Repair every finding in `.factory/review-3.md`, including the mobile first-demo
viewport, terminology and demo metadata regressions, invisible file-input
focus, incomplete/unlisted claim coverage, undersized touch targets, landmark
semantics, jargon, and copy-audit accuracy. Rerun the entire review from
scratch; do not accept the current passing aggregate suite as coverage for
those gaps.
