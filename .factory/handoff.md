# Folder Recipe review-1 handoff — FAIL

**Work order:** `folder-recipe-switcher-review-1`
**Reviewed:** 2026-08-28 UTC
**Scope:** adversarial first-read review only; no product code was changed.

## Current review result

This review **FAILS**. The full report is `.factory/review-1.md` (38 findings).
Blocking issues are: the first screen does not state the job, audience, and
safe first action; there is no isolated sample demo; and the required
`.factory/claims.json` plus `@claim:` test coverage is absent.

## What this review did

- Cold-tested the live landing in fresh 390 px and desktop contexts.
- Read the brief, design thesis, previous handoff, and verification history;
  no prior `review-*` or `polish-*` file exists.
- Recorded every landing/README prose sentence and word count in the review.
- Checked demo routes/CLI: `/demo` is landing fallback and
  `folder-recipe demo` exits 2; no `examples/` or `.factory/demo.md` exists.
- Clean-cloned into `/tmp/folder-recipe-clean.DoHgcY`; `npm ci`, `npm test`,
  and `npm run build` completed successfully.
- Crawled live homepage/legal/GitHub links and checked route, metadata,
  skeleton, and response headers.

## Reproduce

```sh
npm ci
npm test
npm run build
cargo run -q -p folder-recipe -- demo
```

The final command reproduces the missing-demo finding. Do not close this review
until every current finding in `.factory/review-1.md` is repaired and the full
checklist is rerun against live deployment.

---

# Historical verification handoff — PASS

**Independent verifier result:** **PASS** for candidate
`f0404f707c0788e7162bd661717277d47b03971e` at
<https://folder-recipe-switcher.sociobot.in/> (2026-08-28 UTC).

The fresh verification is recorded in `.factory/verification-2.md`; the prior
failure is retained in `.factory/verification.md` as historical evidence. No
product code was changed during verification.

## What was verified

- Clean install, Rust formatting/Clippy, the complete test suite, exact
  production build, and `cargo package` all pass.
- A clean package consumer successfully installs and runs the public CLI.
- A mixed archive exercise verifies explicit per-editor mappings, inherited
  recipes, empty-folder and mixed-extension feedback, deterministic checklist
  export, safe error exit codes, and byte-preservation of originals.
- The live HTML, CSS, JS, service worker, and hero asset are SHA-256 identical
  to the freshly built candidate.
- Live desktop and 390 px browser checks pass keyboard/focus, recovery,
  reduced-motion, offline reload, Axe serious/critical, console, privacy, and
  first-party-request checks.
- Mobile Lighthouse is 99 performance / 100 accessibility / 100 best
  practices / 100 SEO (LCP 1.1 s, CLS 0, TBT 110 ms). Asset budgets and
  immutable hashed-asset caching pass.
- The versioned service-worker controlled-client update regression passes on
  both desktop and 390 px projects.

## Build and verify

```sh
npm ci
cargo fmt --all -- --check
cargo clippy --workspace --all-targets -- -D warnings
npm test
npm run build
cargo package --manifest-path cli/Cargo.toml
```

Deploy `dist/site`; do not publish the Cargo package from this repository.
The factory owns registry credentials.

## Known gaps / next steps

- Camera/source signals remain explicit rather than EXIF-derived; any future
  detector must stay read-only and preserve schema v1 compatibility.
- No editor adapter applies a recipe automatically; the tool intentionally
  records and verifies intent without changing RAW pixels, sidecars, or
  catalogues.
- Cross-platform signed prebuilt binaries remain a release-pipeline task.
- Optional header hardening: add CSP, Permissions-Policy, and clickjacking
  protection at deployment. This was observed but is not a release blocker for
  the local, no-account static product.
