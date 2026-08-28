# Folder Recipe v0.1.0 handoff

## What shipped

- A Rust single-binary CLI with a documented, typed manifest API and three non-interactive commands:
  - `init` writes only `.photo-recipe.json`, records explicit editor/profile mappings plus camera, source and extension clues, infers source/extensions when omitted, and refuses overwrite unless `--force` is explicit.
  - `inspect` resolves the direct or nearest inherited manifest, reports its provenance and recommendation, scans immediate folder file count/size/extensions, and emits actionable mismatch/empty-state warnings. `--json` is stable for scripts.
  - `checklist` walks a mixed archive and exports deterministic Markdown or JSON steps for every manifested folder, with safe overwrite behavior.
- Rust tests cover the README workflow, inheritance, invalid JSON exit behavior, overwrite safety, deterministic checklist order, schema validation, and proof that inspection does not change an original.
- A static Vite documentation site with a local-only manifest inspector, useful empty/error states, offline service-worker shell, keyboard feedback, 390 px responsive layout, and privacy/terms pages.
- An original 1536×1024 cinematic archive hero, generated with the required factory image deployment and optimized to a 39 KB WebP. Prompt and deployment metadata live in `.factory/design.md` and `.factory/provenance/archive-room.json`.
- MIT license, README/API usage, changelog, visual thesis, robots/sitemap, and a publishable Cargo package.

## Build and deploy

```sh
npm install
npm test
npm run build
```

The exact static deploy root is `dist/site` with `dist/site/index.html`. The release binary is copied to `dist/bin/folder-recipe` on Linux. The factory can prepare the registry artifact without publishing by running:

```sh
cargo package --manifest-path cli/Cargo.toml
```

## Verification completed (2026-08-27 UTC)

- `npm test`: pass — 4 Rust unit tests, 2 Rust CLI integration tests, 3 static-site contract tests, and 6 Playwright scenarios (desktop Chromium + Chromium at 390×844).
- Playwright axe scan: 0 serious or critical violations in both viewport projects.
- Browser workflow: sample manifest, invalid upload recovery, keyboard activation, privacy route, service-worker offline reload, and console monitoring all pass; 0 console/page errors.
- `/opt/fleet/lib/verify-url.sh`: HTTP 200; title present; `lang=en`; exactly one `h1`; main landmark present; 0 missing image alts; 0 unlabeled buttons; 0 console errors; observed local load 544 ms.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.0 s, CLS 0, TBT 0 ms.
- Production payload: 4.32 KB JS, 9.38 KB CSS, 39 KB hero WebP; no fonts and no third-party runtime resources. All are comfortably inside the 200/50/120/300 KB budgets.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- `npm run build`: pass; `dist/site/index.html` and `dist/bin/folder-recipe` created.
- `cargo package --manifest-path cli/Cargo.toml --allow-dirty`: pass; packaged 8 files and verified a clean compile.

## Known gaps and next steps

- Camera model data is intentionally explicit rather than extracted from EXIF; the zero/low-dependency v1 infers sources from extensions and file sizes only. A future optional adapter can add read-only EXIF detection without changing schema v1.
- No cross-platform prebuilt binaries are committed. The factory release pipeline should build/sign binaries from the verified Cargo package.
- Checklist discovery includes folders that own a manifest; inherited child folders remain visible through `inspect` but are not guessed as import jobs. This avoids treating arbitrary archive subdirectories as shoots.
- No editor adapter applies a profile automatically. That is a stated non-goal: v1 records and verifies intent without touching RAW pixels, sidecars, or editor catalogues.
