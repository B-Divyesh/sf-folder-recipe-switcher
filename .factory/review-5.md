# Adversarial first-read review 5 — PASS

**Product:** Folder Recipe

**Reviewed commit:** `65e1bf388aa71a08ce4240fdb00e1085c009214a`

**Reviewed:** 2026-08-28 UTC

**Live URL:** <https://folder-recipe-switcher.sociobot.in/>

## Verdict

**PASS.** Zero findings remain, no listed claim is untested, and no earlier
finding is unfixed, half-fixed, or regressed.

## Cold first read

I opened separate fresh Chromium contexts at 390×844 and 1440×900 and recorded
the first viewport before scrolling.

- **What does it do?** It saves photo-editor profiles beside photo folders.
- **For whom?** Photographers who mix shoots and editors.
- **What should I click first?** **“Try it with sample data.”** The nearby
  sentence says **“Opens a sample shoot and shows its saved editor profiles.”**

At 390 px, the headline ends at 263 px, the audience sentence at 362 px, the
sample action at 431 px, and all three facts at 642 px. Desktop shows the same
answers without scrolling. Neither view has horizontal overflow or a console
error. The exact first-screen copy is concrete and passes.

## Copy audit

Counts below are whitespace-delimited. Headings, facts, alt text, actions, and
rendered states are included even when they are fragments. No row exceeds 22
words. No banned marketing adjective, inconsistent visitor term, unexplained
jargon, contextless heading, or non-result-naming action remains.

### Landing page, metadata, and persistent states

| Words | Exact copy | Result |
| ---: | --- | --- |
| 15 | Save editor profiles beside photo folders, check inherited recipe files, and export an import checklist. | Pass |
| 12 | Keep each photo folder’s chosen editor profile in a readable recipe file. | Pass |
| 9 | A blue-hour photo archive leads toward one amber-marked folder | Pass; purposeful alt text |
| 6 | Save photo editor profiles beside folders | Pass; job-first h1 |
| 14 | For photographers mixing shoots and editors, keep the chosen profile with each photo folder. | Pass |
| 10 | Opens a sample shoot and shows its saved editor profiles. | Pass |
| 6 | Runs locally without a network connection | Pass; `cli-offline` |
| 4 | Does not change photos | Pass; `originals-unchanged` |
| 5 | Free under the MIT License | Pass; `mit-free` |
| 13 | A folder uses its own recipe file or the nearest one above it. | Pass |
| 9 | Inspect shows the source before you open an editor. | Pass |
| 11 | Name each editor profile and record why it fits the shoot. | Pass |
| 14 | See whether this folder or a parent saved the recipe file, beside file types. | Pass |
| 12 | Create editor and profile steps for every folder with a recipe file. | Pass |
| 4 | Choose a `.photo-recipe.json` file. | Pass; exact required filename |
| 9 | Your browser checks it without uploading or storing it. | Pass; `browser-private` |
| 5 | Accepts a JSON recipe file. | Pass |
| 12 | Use the sample to see two editor profiles and the folder note. | Pass |
| 8 | This transcript comes from the bundled sample command. | Pass |
| 9 | It creates a temporary archive and prints its location. | Pass |
| 8 | Run the command again for a clean sample. | Pass |
| 6 | Delete its printed folder to reset. | Pass |
| 9 | Build the Folder Recipe command from its Rust source. | Pass; concrete install requirement |
| 4 | No account is needed. | Pass; `mit-free` |
| 12 | It does not edit photos, apply profiles, or manage an editor catalogue. | Pass; `scope-boundary` |
| 8 | It records your choices in files you control. | Pass |
| 8 | Folder Recipe saves editor profiles beside photo folders. | Pass |
| 1 | Offline. | Pass |
| 8 | The demo and recipe file checker remain available. | Pass; `offline-demo` |

### Demo, empty, success, and error states

| Words | Exact copy | Result |
| ---: | --- | --- |
| 7 | Demo — sample data, nothing is saved | Pass; required banner |
| 7 | Check saved profiles in a sample shoot | Pass; demo h1 |
| 7 | Demo loaded. Sample recipe profiles are ready. | Pass |
| 7 | Demo reset to the bundled portrait sample. | Pass |
| 7 | This file is not a JSON object. | Pass |
| 6 | This recipe file uses version `{version}`. | Pass |
| 6 | Choose a version 1 recipe file. | Pass |
| 7 | The recipe file needs a non-empty “name”. | Pass |
| 6 | The recipe file needs a “recommended_editor”. | Pass; exact field recovery |
| 10 | The recipe file needs a saved editor profile in “editor_mappings”. | Pass; exact field recovery |
| 7 | There is no saved profile for “`{editor}`”. | Pass |
| 6 | Valid recipe file · version 1 | Pass |
| 4 | No folder note recorded | Pass |
| 7 | No camera, source, or file types recorded | Pass |
| 5 | Could not read recipe file | Pass |
| 4 | Check this recipe file | Pass |
| 14 | Choose a version 1 recipe file or run `folder-recipe inspect --json` to diagnose it. | Pass |
| 15 | The file is larger than 1 MB, which is unusually large for a folder recipe. | Pass |
| 6 | The file could not be parsed. | Pass |
| 6 | Select the command above to copy | Pass |

### README sentences

| Words | Exact sentence | Result |
| ---: | --- | --- |
| 13 | Folder Recipe is a local command-line tool for photographers who use several editors. | Pass |
| 9 | It writes a recipe file beside each photo folder. | Pass |
| 6 | The recipe file is named `.photo-recipe.json`. | Pass |
| 9 | It stores named editor profiles in readable, versioned JSON. | Pass |
| 7 | The command creates an isolated temporary archive. | Pass |
| 11 | It inspects an inherited recipe and exports a two-folder import checklist. | Pass |
| 10 | Each run uses a new folder and prints its path. | Pass |
| 7 | Delete that folder to reset the demo. | Pass |
| 6 | The browser demo is at <https://folder-recipe-switcher.sociobot.in/demo/>. | Pass |
| 10 | Its sample stays in memory and never touches selected files. | Pass |
| 9 | Build the Folder Recipe command from its Rust source: | Pass |
| 5 | This installs `folder-recipe` version `0.1.0`. | Pass |
| 5 | Each editor profile is explicit. | Pass |
| 13 | The command also records file types and your supplied camera or source notes. | Pass |
| 13 | Inspect reports whether this folder or its nearest parent supplied the recipe file. | Pass |
| 8 | It shows which file supplied the editor profile. | Pass |
| 13 | The checklist contains one sorted row for each folder with a recipe file. | Pass |
| 10 | Run `folder-recipe --help` or `folder-recipe <command> --help` for every option. | Pass |
| 6 | Commands do not ask interactive questions. | Pass |
| 3 | Success exits `0`. | Pass |
| 8 | Invalid input or an unsafe overwrite exits `2`. | Pass |
| 7 | An input or output failure exits `1`. | Pass |
| 14 | Version 1 recipe files produce the same text each time and ignore extra fields. | Pass |
| 11 | Other recipe file versions return an error that names version 1. | Pass |
| 4 | Requirements: Rust and Node. | Pass |
| 6 | Run all checks with `npm test`. | Pass |
| 11 | `npm run build` creates `dist/bin/folder-recipe` and the deployable website in `dist/site`. | Pass |
| 6 | Do not publish from this repository. | Pass |
| 5 | The factory owns publishing credentials. | Pass |
| 14 | Run `npm run build`, then deploy the generated `dist/site` directory as a static site. | Pass |
| 5 | The factory handles production deployment. | Pass |
| 13 | The command-line tool sends no usage data and runs without a network connection. | Pass |
| 12 | Folder Recipe changes only the recipe file or checklist path you request. | Pass |
| 16 | Tests verify that sample photos and editor sidecar files stay unchanged during init, inspect, and checklist. | Pass |
| 7 | The browser checker requests only this site. | Pass |
| 13 | It does not save selected recipe files in cookies or any browser storage. | Pass |
| 10 | Folder Recipe does not edit photos or apply editor profiles. | Pass |
| 10 | It records choices for you to use in your editor. | Pass |
| 8 | Folder Recipe is free under the MIT License. | Pass |

### Headings, labels, buttons, and terminology

The standalone headings **“How recipe files work,” “Check a photo folder’s
recipe,” “See the sample workflow,” “Install Folder Recipe,”** and **“What
Folder Recipe does not do”** identify their sections. Actions **“Try it with
sample data,” “Install Folder Recipe,” “Choose recipe file,” “Try the sample
recipe file,” “Reset demo,” “Start for real,”** and **“Copy install command”**
start with verbs and name the next result; “Start for real” is also the required
sandbox exit wording. Visitor concepts consistently use *recipe file*, *editor
profile*, *file types*, *inherited recipe*, *import checklist*, and *demo*.
Technical names appear only where a filename, field, command, format, or build
requirement must be exact.

## Demo and sandbox

- One click from the cold landing page opens `/demo/`, title **“Demo — Folder
  Recipe,”** and the persistent **“Demo — sample data, nothing is saved”**
  banner.
- The first 390×844 demo viewport already shows **“August portraits,”
  “RawTherapee,” “Portrait neutral v3,” “Protect warm skin tones,”** and
  **“Sample ready · 2 folders · 2 profiles.”**
- I selected a private fixture named **“Private night shoot.”** Reset removed
  it and restored the bundled August sample and both profiles. Start for real
  returned to `/`, hid the banner, and restored the empty checker.
- Real-data sentinels in local and session storage survived entry, Reset, and
  exit unchanged. Source inspection confirms demo state is page memory and
  does not read browser storage.
- Every browser request in the demo/file flow was same-origin. A controlled
  client reloaded `/demo/` offline, kept the sample available, and Reset still
  worked.
- From `/tmp/folder-recipe-review5-cli.65V1gN`, bare `folder-recipe demo`
  created one new temporary sample containing two recipe files, three harmless
  image-name fixtures, and `import-checklist.md`. The clean clone remained
  unchanged.

## Claims

I cloned the reviewed commit without hardlinks to
`/tmp/folder-recipe-review5.3KBws8/repo`, ran `npm ci`, and invoked every test
string in `.factory/claims.json` independently.

| Claim ID | Result | Observable evidence |
| --- | --- | --- |
| `demo-isolated` | PASS | Two bare demos use distinct complete temporary folders. |
| `recipe-write` | PASS | Repeat version-1 output, mappings, file types, camera, and source match. |
| `originals-unchanged` | PASS | Photo and editor-sidecar hashes remain unchanged. |
| `nearest-inheritance` | PASS | Current, parent, and nearer-parent sources are reported. |
| `checklist-export` | PASS | One sorted deterministic row is produced per recipe folder. |
| `cli-contract` | PASS | Closed-stdin commands return the documented 0/2/1 exits. |
| `future-fields` | PASS | Extra version-1 fields work; version 2 fails clearly. |
| `cli-offline` | PASS | All commands pass with connection calls denied and emit only documented outputs. |
| `install-version` | PASS | Fresh-prefix installation reports `folder-recipe 0.1.0`. |
| `build-outputs` | PASS | Release command and all deployable site artifacts exist. |
| `scope-boundary` | PASS | Recording commands exist; editing/applying/catalogue commands do not. |
| `web-demo-isolated` | PASS | One-click entry, changed-data Reset, real exit, and empty demo storage pass. |
| `browser-private` | PASS | Selected recipes stay in memory; requests/cache stay on public site files. |
| `site-no-tracking` | PASS | Explicit request allowlist, no cookies, accounts, ads, analytics, or third-party scripts. |
| `offline-demo` | PASS | Controlled demo reload, sample check, and Reset work offline. |
| `mit-free` | PASS | MIT text exists and no account or payment path exists. |

All landing, README, Privacy, and Terms claim-like copy maps to these entries.
There is no unlisted claim and no failing or untested claim.

## Earlier finding recheck

I read every earlier review, polish record, and the prior handoff. Live HTML for
Home, Demo, Privacy, Terms, and 404 is byte-identical to the final clean build,
so the live and source checks below cover the same artifact.

| Earlier item | Round 5 verification |
| --- | --- |
| F-1-1 | Fixed: the job, photographer audience, sample action, outcome, and three facts are in both cold first viewports. |
| F-1-2 | Fixed: browser and command-line demos are immediate, realistic, resettable, isolated, and complete on mobile. |
| F-1-3 | Fixed: 16 unique ledger entries each have one independently passing tagged test. |
| F-1-4 | Fixed: save/check/export metadata maps to write, inheritance, and checklist tests. |
| F-1-5 | Fixed: recorded file types are visible and asserted. |
| F-1-6 | Fixed: photo and sidecar hashes remain unchanged. |
| F-1-7 | Fixed: the unmeasured “small” wording is absent. |
| F-1-8 | Fixed: named editor profiles and explicit mappings are demonstrated and tested. |
| F-1-9 | Fixed: unchanged-photo copy has hash coverage. |
| F-1-10 | Fixed: current-folder and nearest-parent resolution pass. |
| F-1-11 | Fixed: Inspect reports the supplying recipe-file path. |
| F-1-12 | Fixed: checklist export is sorted, deterministic, and complete. |
| F-1-13 | Fixed: the selected-file flow is same-origin only. |
| F-1-14 | Fixed: selected files remain in memory, outside browser persistence. |
| F-1-15 | Fixed: JSON input and version errors provide a specific recovery action. |
| F-1-16 | Fixed: the demo and checker reload and reset offline. |
| F-1-17 | Fixed: the exact MIT/no-payment fact is listed and tested. |
| F-1-18 | Fixed: README jobs are separated into short sentences. |
| F-1-19 | Fixed: tested photos and editor sidecars remain unchanged. |
| F-1-20 | Fixed: commands complete with stdin closed. |
| F-1-21 | Fixed: exit codes 0, 2, and 1 are asserted. |
| F-1-22 | Fixed: repeated version-1 text is byte-identical. |
| F-1-23 | Fixed: nearer-parent override is asserted. |
| F-1-24 | Fixed: extra fields work and unsupported versions fail clearly. |
| F-1-25 | Fixed: the documented aggregate command passes from the clean clone. |
| F-1-26 | Fixed: the build produces the release command and complete static site. |
| F-1-27 | Fixed: the exact no-usage-data/offline promise is registered and passes network denial. |
| F-1-28 | Fixed: browser-selected files are not persisted. |
| F-1-29 | Fixed: only requested recipe/checklist outputs are written. |
| F-1-30 | Fixed: the command-line demo succeeds with connection calls denied. |
| F-1-31 | Fixed: selected-file content is neither uploaded nor persisted. |
| F-1-32 | Fixed: the exact no-tracking sentence has its own strict allowlist regression. |
| F-1-33 | Fixed: visitor terminology is consistent in live copy, README, output, and the generated audit. |
| F-1-34 | Fixed: headings and GitHub links name their section or destination. |
| F-1-35 | Fixed: `/demo/` is real and unknown routes return a designed HTTP 404. |
| F-1-36 | Fixed: every route has complete route-specific source metadata. |
| F-1-37 | Fixed: every route uses the common skip/header/footer/legal shell. |
| F-1-38 | Fixed: CSP, Permissions Policy, frame denial, nosniff, and referrer policy are live. |
| F-2-1 | Fixed: the first-screen local/offline fact exactly matches `cli-offline`. |
| F-2-2 | Fixed: Back focuses and announces the restored h1 on app and static routes. |
| F-3-1 | Fixed: keyboard focus draws a visible 3 px amber ring on the file-picker control. |
| F-3-2 | Fixed: the demo regression changes data before Reset and clicks Start for real. |
| F-3-3 | Fixed: the demo claim exercises two bare automatic temporary-folder runs. |
| F-3-4 | Fixed: fresh-prefix install/version behavior is registered and tested. |
| F-3-5 | Fixed: camera, source, and file types are in the claim and assertions. |
| F-3-6 | Fixed: README gives the accurate plain instruction to run `npm test`. |
| F-3-7 | Fixed: unchanged-file wording is scoped to init, inspect, and checklist. |
| F-3-8 | Fixed: all visible mobile header/footer targets are at least 44×44 px. |
| F-3-9 | Fixed: the sample is a labelled figure and Axe reports zero violations. |
| F-3-10 | Fixed: visitor copy uses “command-line tool,” not unexplained “CLI.” |
| F-3-11 | Fixed: browser status and recovery copy uses recipe-file language. |
| F-3-12 | Fixed: the generated audit covers static and rendered strings with correct counts. |
| F-4-1 | Fixed: install copy names the Folder Recipe command and Rust source. |
| F-4-2 | Fixed: README describes repeat text and extra fields without schema/deterministic jargon. |
| F-4-3 | Fixed: README states the unchanged-file outcome without hash jargon. |
| F-4-4 | Fixed: README says “cookies or any browser storage,” without engine names. |
| Verification P1 | Fixed: revisioned service-worker adoption passes; live Demo reloads offline. |
| Verification P2 | Fixed: hashed JS/CSS retain one-year immutable caching. |

## Structure, accessibility, and live integrity

- `/`, `/demo/`, `/privacy/`, and `/terms/` return 200. An unknown URL returns
  the designed 404 with Home and Demo actions.
- Home, Demo, Privacy, Terms, and 404 each have `lang=en`, one h1, one main,
  route-specific title/description/canonical/OG/Twitter metadata, SVG favicon,
  apple-touch icon, skip link, common header, and common footer.
- The complete unique-link crawl returns 200 for every internal route, the
  repository, and the linked license. `robots.txt` and `sitemap.xml` are live.
- Browser Back restores focus to `h1#hero-title` and announces the restored
  heading. Direct Demo entry focuses and announces its h1.
- Live Axe scans report zero violations on Home, Demo, Privacy, Terms, and 404.
  The factory verifier also reports zero console errors, one h1, a main
  landmark, complete alt text, and no unlabelled buttons.
- `npm test`, `npm run build`, and
  `node scripts/generate-copy-audit.mjs --check` pass in the clean clone. The
  aggregate suite contains 6 Rust tests, 10 static contracts, all 16 claims,
  and 15 executed Playwright tests across desktop and 390 px.
- Built JavaScript is 6.92 KB raw / 2.79 KB gzip. Reduced-motion rules, visible
  focus, 44 px touch targets, and security headers are present.
- The blue-hour archive room, amber safe-light controls, serif/monospace type,
  film-strip rail, and squared folder shapes follow `.factory/design.md` and
  are visually specific to this product, not a generic SaaS template.

## Missed leverage

The brief's obvious adjacent value is import-checklist export, and the command
ships and demonstrates it. Sync would conflict with the local plain-file model.
Profile choice is deliberate user input, so an AI step would add cost and data
exposure without solving an implied job. No missing-leverage or decorative-AI
finding applies, and no provider key or AI endpoint is present.

## What would make this perfect

Nothing remains to change in the reviewed scope. Preserve the current claim
matrix, one-click browser and command-line demos, sentence audit, route crawl,
offline exercise, accessibility checks, and full history recheck on future
changes.
