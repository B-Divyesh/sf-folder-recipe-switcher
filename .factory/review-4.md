# Adversarial first-read review 4 — FAIL

**Product:** Folder Recipe

**Reviewed commit:** `769abdd4c065aa53b26f2f637a4e319036dd38b4b`

**Reviewed:** 2026-08-28 UTC

**Live URL:** <https://folder-recipe-switcher.sociobot.in/>

## Verdict

**FAIL.** The first screen, demo, routes, accessibility, build, and every listed
claim test pass. Two earlier privacy/telemetry promises are still broader than
their registered claim text, and four technical phrases fail the required
plain-words audit. A PASS requires zero findings.

## Cold first read

I opened separate fresh Chromium contexts at 390×844 and 1440×900 before
scrolling.

- **What does it do?** It saves photo-editor profile choices beside photo
  folders.
- **For whom?** Photographers who mix shoots and editors.
- **What should I click first?** **“Try it with sample data.”** The nearby
  sentence says **“Opens a sample shoot and shows its saved editor profiles.”**

The answer to all three questions is visible at both widths. On mobile, the
headline ends at 263 px, the audience sentence at 362 px, the sample action at
431 px, and all three facts by 642 px. There is no horizontal overflow or
initial console error. This step passes.

## Findings

### F-1-27 — BLOCKING — the no-telemetry promise is still absent from the claims ledger

**Earlier finding reopened.**

**Exact quotes/locations:** README line 89, **“The command-line tool has no
telemetry or network code.”** Privacy line 11 says **“The command-line tool has
no telemetry and makes no network requests.”**

**Why:** `.factory/claims.json` contains no claim with the word *telemetry*.
`cli-offline` registers only **“Folder Recipe runs locally without a network
connection.”** Its implementation happens to scan source text for several
library names, but the visitor-facing telemetry promise is not the registered
claim. The claims contract requires the promise itself in the ledger. This is
the same incomplete repair as F-1-27, so the history rule makes it blocking.

**Concrete fix:** either remove both no-telemetry sentences and use the exact
registered offline sentence, or change the ledger claim to **“The command-line
tool sends no usage data and runs without a network connection.”** Keep the
network-denial check and add an assertion that every command writes only its
documented local outputs.

### F-1-32 — BLOCKING — the no-analytics/privacy promise is broader than its registered test

**Earlier finding reopened.**

**Exact quote/location:** Privacy line 12, **“The site has no analytics, ads,
cookies, accounts, or third-party scripts.”**

**Why:** no claim entry names analytics, ads, or third-party scripts.
`browser-private` promises only that selected files stay in memory and requests
remain same-origin. Its test accepts every same-origin request, so a future
same-origin `/collect` analytics call would pass. `mit-free` checks account and
payment UI, not analytics or ads. The live flow currently has no tracking, but
the retained sentence lacks the required regression and ledger entry. This is
the same claim originally recorded as F-1-32.

**Concrete fix:** add a `site-no-tracking` claim with this exact copy and one
test that checks an explicit request allowlist across Home, Demo, Privacy, and
the selected-file flow; asserts no cookies, beacon calls, analytics/ad/account
code, or third-party scripts; and verifies the built HTML. Alternatively,
replace the sentence with only the narrower behaviors already registered and
tested.

### F-4-1 — Minor — “binary” is unexplained installation jargon

**Exact quotes/locations:** landing installation section, **“Build the single
Rust binary from source.”** README line 21, **“Build the single binary from
source:”**

**Why:** a photographer should not have to translate *binary* to the command
they are installing.

**Concrete rewrite:** **“Build the Folder Recipe command from its Rust
source.”** Use the same sentence on the landing page and in README.

### F-4-2 — Minor — the recipe-format sentence uses two unexplained implementation terms

**Exact quote/location:** README line 68, **“Schema version `1` is deterministic
and accepts unknown fields.”**

**Why:** *schema* and *deterministic* describe implementation mechanics, not
the result a user gets.

**Concrete rewrite:** **“Version 1 recipe files produce the same text each time
and ignore extra fields.”** Rewrite the next sentence as **“Other recipe file
versions return an error that names version 1.”**

### F-4-3 — Minor — the safety evidence uses test jargon instead of the outcome

**Exact quote/location:** README line 91, **“Tests hash sample photos and
sidecars around init, inspect, and checklist.”**

**Why:** *hash* is an internal verification method, and *sidecars* is not
introduced as an editor file. The sentence makes users decode the test instead
of stating what it proves.

**Concrete rewrite:** **“Tests verify that sample photos and editor sidecar
files stay unchanged during init, inspect, and checklist.”**

### F-4-4 — Minor — browser storage engine names obscure the privacy result

**Exact quote/location:** README line 93, **“It does not store selected recipe
files in cookies, browser storage, IndexedDB, or OPFS.”**

**Why:** *IndexedDB* and *OPFS* are browser implementation names that the user
does not need to understand.

**Concrete rewrite:** **“It does not save selected recipe files in cookies or
any browser storage.”** Keep the detailed storage matrix in the claim test and
`.factory/demo.md`.

## Copy audit

Counts are whitespace-delimited. Code blocks and terminal commands are audited
as executable instructions, not prose sentences. No sentence exceeds 22
words, no banned marketing adjective appears, terminology is otherwise
consistent, headings make sense out of context, and every action begins with a
result-naming verb. Flagged rows link to findings above.

### Landing-page and rendered-state sentences

| Words | Sentence | Result |
| ---: | --- | --- |
| 15 | Save editor profiles beside photo folders, check inherited recipe files, and export an import checklist. | Pass |
| 12 | Keep each photo folder’s chosen editor profile in a readable recipe file. | Pass |
| 9 | A blue-hour photo archive leads toward one amber-marked folder. | Pass |
| 6 | Save photo editor profiles beside folders. | Pass |
| 14 | For photographers mixing shoots and editors, keep the chosen profile with each photo folder. | Pass |
| 10 | Opens a sample shoot and shows its saved editor profiles. | Pass |
| 6 | Runs locally without a network connection. | Pass |
| 4 | Does not change photos. | Pass |
| 5 | Free under the MIT License. | Pass |
| 13 | A folder uses its own recipe file or the nearest one above it. | Pass |
| 9 | Inspect shows the source before you open an editor. | Pass |
| 11 | Name each editor profile and record why it fits the shoot. | Pass |
| 14 | See whether this folder or a parent saved the recipe file, beside file types. | Pass |
| 12 | Create editor and profile steps for every folder with a recipe file. | Pass |
| 4 | Choose a `.photo-recipe.json` file. | Pass; required filename |
| 9 | Your browser checks it without uploading or storing it. | Pass |
| 5 | Accepts a JSON recipe file. | Pass; names the required format |
| 12 | Use the sample to see two editor profiles and the folder note. | Pass |
| 8 | This transcript comes from the bundled sample command. | Pass |
| 9 | It creates a temporary archive and prints its location. | Pass |
| 8 | Run the command again for a clean sample. | Pass |
| 6 | Delete its printed folder to reset. | Pass |
| 7 | Build the single Rust binary from source. | **F-4-1** |
| 4 | No account is needed. | Pass |
| 12 | It does not edit photos, apply profiles, or manage an editor catalogue. | Pass |
| 8 | It records your choices in files you control. | Pass |
| 8 | Folder Recipe saves editor profiles beside photo folders. | Pass |
| 1 | Offline. | Pass |
| 8 | The demo and recipe file checker remain available. | Pass |
| 7 | Demo — sample data, nothing is saved. | Pass |
| 7 | Check saved profiles in a sample shoot. | Pass |
| 2 | Demo loaded. | Pass |
| 5 | Sample recipe profiles are ready. | Pass |
| 7 | Demo reset to the bundled portrait sample. | Pass |
| 7 | This file is not a JSON object. | Pass |
| 6 | This recipe file uses version `{version}`. | Pass |
| 6 | Choose a version 1 recipe file. | Pass |
| 7 | The recipe file needs a non-empty “name”. | Pass |
| 6 | The recipe file needs a “recommended_editor”. | Pass; exact field recovery |
| 10 | The recipe file needs a saved editor profile in “editor_mappings”. | Pass; exact field recovery |
| 7 | There is no saved profile for “`{editor}`”. | Pass |
| 6 | Valid recipe file · version 1. | Pass |
| 4 | No folder note recorded. | Pass |
| 7 | No camera, source, or file types recorded. | Pass |
| 5 | Could not read recipe file. | Pass |
| 4 | Check this recipe file. | Pass |
| 14 | Choose a version 1 recipe file or run `folder-recipe inspect --json` to diagnose it. | Pass |
| 15 | The file is larger than 1 MB, which is unusually large for a folder recipe. | Pass |
| 6 | The file could not be parsed. | Pass |
| 6 | Select the command above to copy. | Pass |

### README sentences

| Words | Sentence | Result |
| ---: | --- | --- |
| 13 | Folder Recipe is a local command-line tool for photographers who use several editors. | Pass |
| 9 | It writes a recipe file beside each photo folder. | Pass |
| 6 | The recipe file is named `.photo-recipe.json`. | Pass |
| 9 | It stores named editor profiles in readable, versioned JSON. | Pass; the prior sentence grounds the file format |
| 7 | The command creates an isolated temporary archive. | Pass |
| 11 | It inspects an inherited recipe and exports a two-folder import checklist. | Pass |
| 10 | Each run uses a new folder and prints its path. | Pass |
| 7 | Delete that folder to reset the demo. | Pass |
| 6 | The browser demo is at `https://folder-recipe-switcher.sociobot.in/demo/`. | Pass |
| 10 | Its sample stays in memory and never touches selected files. | Pass |
| 6 | Build the single binary from source. | **F-4-1** |
| 5 | This installs `folder-recipe` version `0.1.0`. | Pass |
| 5 | Each editor profile is explicit. | Pass |
| 13 | The command also records file types and your supplied camera or source notes. | Pass |
| 13 | Inspect reports whether this folder or its nearest parent supplied the recipe file. | Pass |
| 8 | It shows which file supplied the editor profile. | Pass |
| 13 | The checklist contains one sorted row for each folder with a recipe file. | Pass |
| 10 | Run `folder-recipe --help` or `folder-recipe <command> --help` for every option. | Pass |
| 6 | Commands do not ask interactive questions. | Pass |
| 3 | Success exits `0`. | Pass; command contract |
| 8 | Invalid input or an unsafe overwrite exits `2`. | Pass; command contract |
| 7 | An input or output failure exits `1`. | Pass; command contract |
| 9 | Schema version `1` is deterministic and accepts unknown fields. | **F-4-2** |
| 7 | Other schema versions return a clear error. | **F-4-2** |
| 4 | Requirements: Rust and Node. | Pass |
| 6 | Run all checks with `npm test`. | Pass |
| 11 | `npm run build` creates `dist/bin/folder-recipe` and the deployable website in `dist/site`. | Pass |
| 6 | Do not publish from this repository. | Pass |
| 5 | The factory owns publishing credentials. | Pass |
| 9 | The command-line tool has no telemetry or network code. | **F-1-27** |
| 8 | It works while network system calls are denied. | Pass |
| 12 | Folder Recipe changes only the recipe file or checklist path you request. | Pass |
| 11 | Tests hash sample photos and sidecars around init, inspect, and checklist. | **F-4-3** |
| 7 | The browser checker requests only this site. | Pass |
| 14 | It does not store selected recipe files in cookies, browser storage, IndexedDB, or OPFS. | **F-4-4** |
| 10 | Folder Recipe does not edit photos or apply editor profiles. | Pass |
| 10 | It records choices for you to use in your editor. | Pass |
| 8 | Folder Recipe is free under the MIT License. | Pass |

### Headings, labels, and actions

- Headings **“How recipe files work,” “Check a photo folder’s recipe,” “See
  the sample workflow,” “Install Folder Recipe,”** and **“What Folder Recipe
  does not do”** identify their sections without surrounding context.
- Actions **“Try it with sample data,” “Install Folder Recipe,” “Choose recipe
  file,” “Try the sample recipe file,” “Reset demo,” “Start for real,”** and
  **“Copy install command”** begin with verbs and identify their result. The
  required sandbox wording **“Start for real”** is retained.
- Visitor terms remain consistent: *recipe file*, *editor profile*, *file
  types*, *inherited recipe*, *import checklist*, and *demo*. RawTherapee,
  darktable, Rust, and `.photo-recipe.json` are concrete product/file names,
  not competing terminology.

## Demo and sandbox

- One click from `/` opens `/demo/` with title **“Demo — Folder Recipe”** and
  persistent **“Demo — sample data, nothing is saved”** banner.
- At 390×844, the first result screen shows **“August portraits,”**
  **“RawTherapee,” “Portrait neutral v3,” “Protect warm skin tones,”** and
  **“Sample ready · 2 folders · 2 profiles”** by 483 px.
- I loaded a private fixture, then clicked Reset. The private shoot/profile
  disappeared and the bundled two-profile sample returned.
- Start for real points to `/`. Existing `real:` local/session-storage
  sentinels were unchanged by entering or resetting Demo.
- Across the selected-file flow, all ten live requests were same-origin;
  cookies, localStorage, sessionStorage, IndexedDB, and OPFS remained empty.
- After network interception switched the context offline, `/demo/` reloaded,
  showed its offline notice, retained its sample, and Reset still worked.
- In a fresh temporary parent, bare `folder-recipe demo` created a unique
  child with two recipe files and `import-checklist.md`, printed that path, and
  left the clean clone unchanged.

The demo itself passes. The privacy copy-contract failures are F-1-27 and
F-1-32.

## Claims matrix

I cloned the reviewed commit without hardlinks to
`/tmp/folder-recipe-review4-clean.hga2oP`, ran `npm ci`, and executed every
`test` command from `.factory/claims.json` independently.

| Claim | Result |
| --- | --- |
| `demo-isolated` | PASS |
| `recipe-write` | PASS |
| `originals-unchanged` | PASS |
| `nearest-inheritance` | PASS |
| `checklist-export` | PASS |
| `cli-contract` | PASS |
| `future-fields` | PASS |
| `cli-offline` | PASS |
| `install-version` | PASS |
| `build-outputs` | PASS |
| `scope-boundary` | PASS |
| `web-demo-isolated` | PASS |
| `browser-private` | PASS |
| `offline-demo` | PASS |
| `mit-free` | PASS |

No listed claim test failed and no listed claim remains untested. F-1-27 and
F-1-32 concern promises that are not stated in the ledger, not failures of the
15 registered commands.

## Earlier finding recheck

I read every `.factory/review-*.md`, `.factory/polish-*.md`, and the prior
handoff. Each item below was checked against both current source and the live
deployment. The four main live HTML files are byte-identical to the clean
build.

| Earlier item | Round 4 result |
| --- | --- |
| F-1-1 | Fixed: job, audience, sample action, outcome, and three facts are visible at both widths. |
| F-1-2 | Fixed: browser and CLI demos are realistic, immediate, resettable, and isolated. |
| F-1-3 | Fixed: 15 unique ledger entries have 15 independently passing commands. |
| F-1-4 | Fixed: metadata job statements map to write, inheritance, and checklist tests. |
| F-1-5 | Fixed: recorded file types are asserted. |
| F-1-6 | Fixed: photo and sidecar hashes remain unchanged. |
| F-1-7 | Fixed: the unmeasured “small” claim is absent. |
| F-1-8 | Fixed: named editor mappings are explicit and tested. |
| F-1-9 | Fixed: unchanged-photo copy has hash coverage. |
| F-1-10 | Fixed: current and nearest-parent recipe resolution pass. |
| F-1-11 | Fixed: inspect reports the source recipe path. |
| F-1-12 | Fixed: checklist export is sorted and deterministic. |
| F-1-13 | Fixed: selected-file traffic is same-origin. |
| F-1-14 | Fixed: selected data does not enter browser persistence. |
| F-1-15 | Fixed: JSON and version errors name a recovery step. |
| F-1-16 | Fixed: controlled Demo reload and Reset work offline. |
| F-1-17 | Fixed: the MIT/no-payment statement is listed and tested. |
| F-1-18 | Fixed: the README opening is split into short sentences. |
| F-1-19 | Fixed: tested photos and sidecars remain unchanged. |
| F-1-20 | Fixed: commands complete with stdin closed. |
| F-1-21 | Fixed: exit codes 0, 2, and 1 pass. |
| F-1-22 | Fixed: repeated version-1 output is byte-identical. |
| F-1-23 | Fixed: nearer-parent override is asserted. |
| F-1-24 | Fixed: extra fields work and unsupported versions fail. |
| F-1-25 | Fixed: the documented aggregate suite passes. |
| F-1-26 | Fixed: build output contains the binary and all deployable routes. |
| F-1-27 | **Half-fixed; reopened above:** offline behavior is listed, but the retained no-telemetry promise is not. |
| F-1-28 | Fixed: selected-file state stays in memory. |
| F-1-29 | Fixed: requested recipe/checklist outputs are isolated from photos and sidecars. |
| F-1-30 | Fixed: the CLI demo passes with socket/connect denied. |
| F-1-31 | Fixed: selected-file upload/persistence checks pass live and locally. |
| F-1-32 | **Half-fixed; reopened above:** same-origin/no-storage tests do not register or prove the full no-analytics sentence. |
| F-1-33 | Fixed: visitor terms use recipe file, editor profile, and file types consistently. |
| F-1-34 | Fixed: headings and GitHub links name their section or destination. |
| F-1-35 | Fixed: `/demo/` is real and unknown paths return a designed HTTP 404. |
| F-1-36 | Fixed: route-specific metadata is present in server responses. |
| F-1-37 | Fixed: all checked routes share the header/footer/legal shell. |
| F-1-38 | Fixed: CSP, Permissions Policy, frame denial, nosniff, and referrer policy are live. |
| F-2-1 | Fixed: the local/offline fact exactly matches `cli-offline`. |
| F-2-2 | Fixed: Back focuses and announces the restored h1. |
| F-3-1 | Fixed: the visible file-picker label receives a 3 px amber focus ring. |
| F-3-2 | Fixed: the demo test changes data before Reset and clicks Start for real. |
| F-3-3 | Fixed: the CLI claim runs bare Demo twice under one temp parent. |
| F-3-4 | Fixed: fresh-prefix installation and version are registered and tested. |
| F-3-5 | Fixed: camera and source fields are asserted. |
| F-3-6 | Fixed: the README uses the non-overstated aggregate-test instruction. |
| F-3-7 | Fixed: the README names only init, inspect, and checklist for photo hashes. |
| F-3-8 | Fixed: every visible mobile header/footer target is at least 44×44 px. |
| F-3-9 | Fixed: live Axe reports zero violations on Home and Demo. |
| F-3-10 | Fixed: visitor-facing “CLI” is replaced by “command-line tool.” |
| F-3-11 | Fixed: browser status/recovery copy says recipe file and version. |
| F-3-12 | Fixed: the generated audit includes rendered strings and correct whitespace counts; its semantic jargon check is extended by F-4-1–F-4-4. |
| Verification P1 | Fixed: revisioned worker behavior passes and live Demo reloads offline. |
| Verification P2 | Fixed: hashed assets retain immutable caching. |

The previous handoff's build, deployment-equality, and verification statements
remain true. Its **“Known gaps: None”** conclusion is superseded by the six
findings in this review.

## Structure, accessibility, and live integrity

- `/`, `/demo/`, `/privacy/`, and `/terms/` return 200. An unknown path
  returns the designed HTTP 404 with Home and Demo actions.
- Every checked route has `lang=en`, one h1, one main, its required title,
  description, canonical, OG/Twitter metadata, SVG favicon, and apple-touch
  icon. Titles are **“Folder Recipe — Save photo editor profiles,” “Demo —
  Folder Recipe,” “Privacy — Folder Recipe,” “Terms — Folder Recipe,”** and
  **“Page not found — Folder Recipe.”**
- The internal/external link crawl found no dead link. Browser Back restores
  h1 focus and a non-empty live announcement.
- Axe returned zero violations on Home, Demo, Privacy, and Terms. The real file
  picker exposes the amber 3 px proxy ring. Every visible 390 px header/footer
  link is at least 44×44 px. Reduced motion resolves transitions to effectively
  instant and disables smooth scrolling.
- The aggregate clean-clone `npm test` passed 6 Rust tests, 10 static tests, 15
  claim tests, and 15 Playwright tests; one project-specific case was
  intentionally skipped. `npm run build`, invoked by the claim runner, produced
  `dist/bin/folder-recipe` and `dist/site`. Built JavaScript is 6.92 KB raw and
  2.79 KB gzip.
- Live Home, Demo, Privacy, and Terms HTML SHA-256 values match the clean build.
  Live responses include CSP, Permissions Policy, `X-Frame-Options: DENY`,
  nosniff, and strict-origin referrer policy.
- The blue-hour archive art, safe-light amber, darkroom palette, serif/monospace
  pairing, and film-strip recipe rail are product-specific and match
  `.factory/design.md`; this is not a generic SaaS template.

No structure, routing, accessibility, payload, or visual-identity finding is
recorded.

## Missed leverage

The brief's obvious adjacent function is checklist export, and the CLI ships
and demonstrates it. Sync would contradict the local plain-file model. Profile
selection is a deterministic user choice, so an AI step would add cost and
privacy exposure without solving an implied job. No missing-leverage or
decorative-AI finding is recorded, and no provider key or AI endpoint exists.

## What would make this perfect

Make the two broad privacy promises exact ledger entries with regressions that
prove the whole sentence, or narrow the copy to the behavior already
registered. Replace *binary*, *schema/deterministic*, *hash/sidecars*, and
*IndexedDB/OPFS* with the proposed plain result language. Then regenerate the
copy audit and rerun all 15 claim commands, the aggregate suite, live
offline/storage interception, route crawl, and complete history table. Only a
round with zero remaining findings can pass.
