# Folder Recipe review 4 handoff

**Work order:** `folder-recipe-switcher-review-4`

**Reviewed commit:** `769abdd4c065aa53b26f2f637a4e319036dd38b4b`

**Live:** <https://folder-recipe-switcher.sociobot.in/>

**Verdict:** **FAIL**

## Delivered

- Wrote `.factory/review-4.md` without modifying product code.
- Re-ran the cold 390×844 and 1440×900 first read, one-click Demo, Reset/exit,
  selected-file isolation, offline reload, CLI temp-folder demo, claims matrix,
  copy audit, historical finding table, route/link/metadata checks, Back focus,
  accessibility, touch targets, reduced motion, security headers, and
  live-versus-build equality.
- Reopened F-1-27 and F-1-32 as blocking claims-contract gaps. Recorded four
  new minor plain-language findings, F-4-1 through F-4-4.

## Verification

Clean clone: `/tmp/folder-recipe-review4-clean.hga2oP`.

```sh
npm ci
npm run test:claims -- --grep @claim:<each-of-15-ids>
npm test
```

All 15 claim commands passed independently. The aggregate suite passed 6 Rust,
10 static, 15 claim, and 15 Playwright tests, with one intentional
project-specific skip. The claim runner repeatedly completed `npm run build`;
the resulting JavaScript is 2.79 KB gzip.

Live checks found zero Axe violations on Home, Demo, Privacy, and Terms; no
dead links; correct metadata and 404 behavior; working Back focus; no mobile
overflow; 44×44 px navigation targets; an actionable file-picker focus ring;
same-origin-only Demo traffic; empty cookies/local/session/IndexedDB/OPFS; and
a working offline Demo reload. Home, Demo, Privacy, and Terms HTML matched the
clean build by SHA-256.

## Remaining work

- Register and fully test the retained no-telemetry and no-analytics promises,
  or narrow them to the existing registered claims.
- Apply the exact copy rewrites in F-4-1 through F-4-4, then regenerate
  `.factory/copy-audit.md`.
- Re-run the entire review. Do not treat the passing build or existing claim
  matrix as a PASS while any finding remains.
