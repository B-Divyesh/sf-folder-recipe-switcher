# Folder Recipe review-2 handoff — FAIL

**Work order:** `folder-recipe-switcher-review-2`
**Scope:** independent adversarial review; no product code changed.
**Live URL:** <https://folder-recipe-switcher.sociobot.in/>

## What was done

- Wrote the full review in `.factory/review-2.md`.
- Read all prior review, polish, handoff, and verification reports; rechecked every earlier finding against code and the live product.
- Ran live cold checks at 390×844 and 1440×900; demo/reset/real-exit/privacy/offline checks; route metadata and link checks; and the CLI demo in a temporary archive.
- Created clean clone `/tmp/folder-recipe-review2.q1XfzB`; ran all 14 claim commands independently, then `npm test` and `npm run build`. All passed.

## Findings left

The review is **FAIL** with three findings:

1. Reopened **F-1-33**: landing/demo labels still mix *settings*, *direct*, *clues*, and *mappings* with the promised *recipe file* / *editor profile* terminology.
2. **F-2-1**: the first-screen claim “Runs on your computer” lacks a matching claims-ledger entry/location.
3. **F-2-2**: browser Back from Demo to home leaves focus on `body` and leaves the route announcer empty.

See `.factory/review-2.md` for quoted evidence, reproduction, and concrete repairs. The repository remains buildable. This handoff and the review report are the only files changed by this work order.
