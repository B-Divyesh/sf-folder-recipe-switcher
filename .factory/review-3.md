# Adversarial first-read review 3 — FAIL

**Product:** Folder Recipe

**Reviewed commit:** `2ecfb535e1c9d251e33dbccb9148b6f29a59ac8f`

**Reviewed:** 2026-08-28 UTC

**Live URL:** <https://folder-recipe-switcher.sociobot.in/>

## Verdict

**FAIL.** The landing page is clear on a cold first read and every listed claim
command passes. The result is still not perfect: the mobile demo does not show
an actual profile result in its first viewport, two earlier copy/metadata
findings are only partly fixed, and the real-file picker has no visible keyboard
focus. There are also claim-coverage, touch-target, landmark, jargon, and audit
accuracy findings. A PASS requires zero findings.

## Cold first read

I opened separate fresh Chromium contexts at 390×844 and 1440×900 and recorded
the visible text before scrolling.

- **What does it do?** It saves photo-editor profile choices beside photo
  folders.
- **For whom?** Photographers who mix shoots and editors.
- **What should I click first?** **“Try it with sample data.”** The adjacent
  sentence says **“Opens a sample shoot and shows its saved editor profiles.”**

All three answers are present in both first viewports. The headline has six
words, the audience sentence has fourteen, the primary action is visible, and
all three facts end above 694 px on the 390 px view. There was no horizontal
overflow or initial console/page error. The cold landing screen passes.

## Blocking findings

### F-1-2 — BLOCKING — the mobile demo still does not show the promised result in its first viewport

**Earlier finding reopened.** The one-click entry, banner, reset, exit, and
sample now exist, but the required first demo screen is only partly repaired at
390×844.

**Exact location/quote:** click landing **“Try it with sample data”** at 390×844.
The resulting viewport shows **“Check saved profiles in a sample shoot”**, the
same landing actions/facts, and only the recipe-card path/status at y=751–788.
The first actual editor value, **“RawTherapee,”** starts at y=842 and ends at
y=862. **“Portrait neutral v3,” “Protect warm skin tones,”** and **“Sample
ready · 2 folders · 2 profiles”** are below 844 px. The full checked result
**“August portraits”** is much farther down the page.

**Why:** on a phone the click visibly changes the banner and headline, but it
does not yet show the profile choice or result that demonstrates the product.
The pre-click page already had the same recipe-card shell. This is a weak demo
under the explicit first-screen requirement, so it is blocking.

**Concrete fix:** in demo mode, put a compact checked-result panel immediately
after the demo heading and before repeated install/actions. Within 390×844 it
must show the shoot, editor, profile, reason, and **“Sample ready.”** Add a
Playwright assertion that each sample value's bounding-box bottom is at most
844 after the one landing click.

### F-1-33 — BLOCKING — the earlier terminology repair has regressed

**Earlier finding reopened.** The live landing uses **“file counts and types”**
and **“Camera, source, and file types.”** README line 42 calls the same stored
concept **“observed file extensions.”** `.factory/claims.json` also calls it
**“observed extensions.”**

**Why:** the plain-words rule requires one visitor term per concept. “File
types” and “file extensions” are close, but they are not interchangeable to a
nontechnical photographer. Polish 2 explicitly claimed that this concept had
been standardized to **“camera, source, and file types,”** so the README is a
regression of the same finding.

**Concrete fix:** use **“file types”** in visitor copy, for example: **“The
command also records the file types it finds and the camera or source notes you
provide.”** If “extension” is needed for CLI flags or JSON fields, explain it
once as the technical field name rather than as a second visitor term. Regenerate
the copy audit from rendered states and README.

### F-1-36 — BLOCKING — the primary demo URL still serves landing-page metadata

**Earlier finding reopened.** The primary action and README use
`/?demo=1`. After JavaScript runs, its title is **“Demo — Folder Recipe”** and
its canonical is `/demo/`, but live inspection still returns:

```text
meta description: Save editor profiles beside photo folders, check inherited recipe files, and export an import checklist.
og:title: Folder Recipe — Save photo editor profiles
og:url: https://folder-recipe-switcher.sociobot.in/
```

The server-rendered `/demo/` fixes the OG title/URL but still retains the
landing meta description. `site/src/main.ts` updates only `document.title` and
the canonical; `scripts/build-site.mjs` does not replace the ordinary meta
description.

**Why:** the actual one-click/copyable demo entry advertises itself as the
landing page to social crawlers and link previews, which do not execute the
client script. The Demo route therefore still lacks a complete route-specific
metadata set.

**Concrete fix:** point the landing CTA, README, catalog, and verifiers to
`/demo/`. Generate a demo-specific ordinary description as well as OG/Twitter
title, description, URL, and canonical in the HTML response. Add an HTTP-source
test for those values rather than inspecting only the hydrated DOM.

### F-3-1 — BLOCKING — keyboard focus disappears on the real recipe-file action

**Exact location:** live recipe checker, **“Choose recipe file”** control;
`site/index.html:71` and `site/src/style.css:88`.

**Evidence:** when the file input is focused at 390 px, the active element is
`#manifest-file`, but its rectangle is 1×1 px and `opacity: 0`. The amber 3 px
outline is computed on that invisible input. The visible label has
`outline: none` and does not match `:focus` or `:focus-visible`.

**Why:** a keyboard user reaches the product's real-data action but receives no
visible indication of where focus went. This fails the explicit visible-focus
quality gate on a core control.

**Concrete fix:** style the visible label with a focus-within/`:has()` selector
or arrange the markup for an adjacent selector so focus on the input draws the
designed amber ring on the visible label/drop zone. Add a keyboard regression
that Tabs to the input and asserts a visible proxy outline with at least 3:1
contrast.

## Major findings

### F-3-2 — the web-demo claim test can pass when Reset and Start for real are broken

**Location:** `.factory/claims.json` claim `web-demo-isolated` and
`site/tests/claims.test.mjs:186-198`.

**Exact claim:** **“The first-screen browser demo loads sample profiles in one
click, saves nothing, resets, and offers a real start.”**

**Why:** the test clicks Reset while the unchanged default sample is already
loaded, then checks that the same sample remains. A no-op Reset passes. It only
checks that Start for real has `href="/"`; it never clicks it or verifies that
demo state is discarded. The live behavior passed an independent stronger
exercise, but the required regression does not prove its own listed claim.

**Concrete fix:** first load a different selected-file fixture, click Reset,
and assert the bundled shoot and both profiles return. Then click Start for
real and assert `/`, a hidden banner, an empty checker, and empty
local/session/IndexedDB/OPFS state.

### F-3-3 — the CLI demo test does not exercise the documented automatic temporary-folder path

**Exact quote/location:** README, **“Each run uses a new folder and prints its
path.”** Claim `demo-isolated` says the demo creates a new isolated folder, but
`site/tests/claims.test.mjs:61-64` supplies `--output one` and `--output two`.

**Why:** choosing two different paths in the test cannot prove that the
documented bare `folder-recipe demo` command chooses a fresh path each time or
prints that path. Two independent manual bare runs did work, but there is no
claim regression for this behavior.

**Concrete fix:** run the bare demo twice with `TMPDIR` set to one fresh parent,
parse both **“Demo folder:”** lines, assert distinct new children under that
parent, assert complete samples, and remove them after the test.

### F-3-4 — unlisted README install/version claim

**Exact quote/location:** README line 27, **“Folder Recipe starts at version
`0.1.0` and installs the `folder-recipe` binary.”**

**Why:** no `.factory/claims.json` entry covers installation or the reported
version. `build-outputs` asserts that a copied release file exists; it does not
install the crate or execute `--version`. A manual fresh-prefix install passed,
but the sentence remains outside the mandatory claims ledger.

**Concrete fix:** add an `install-version` claim whose test installs the packed
crate or Git revision into a fresh prefix, executes the installed binary, and
asserts `folder-recipe 0.1.0`; or remove the sentence.

### F-3-5 — unlisted and partly untested camera/source claim

**Exact quote/location:** README line 42, **“The command also records observed
file extensions and your supplied camera or source notes.”**

**Why:** `recipe-write` names profiles and observed extensions, but not camera
or source data. Its helper passes neither `--camera` nor `--source`, and its
assertions do not check either field. The sentence is therefore only partly
covered.

**Concrete fix:** revise the ledger claim to include camera and source fields;
run `init` with both flags and assert their exact JSON values. Use the plain
rewrite from F-1-33 in the README.

### F-3-6 — unlisted README quality-suite claim

**Exact quote/location:** README line 81, **“`npm test` runs Rust, site, claim,
browser, mobile, offline, privacy, and accessibility checks.”**

**Why:** this is a concrete maintainer-facing promise and has no claims entry.
The command passed in this review, but the claims ledger cannot detect later
removal of one named class of check.

**Concrete fix:** add a `quality-suite` claim/test that statically asserts the
script composition and named Playwright projects/tags, or replace the list with
the non-claim instruction **“Run all checks with `npm test`.”**

### F-3-7 — “every operation” overstates the originals test

**Exact quote/location:** README line 91, **“Tests hash photos and sidecars
before and after every operation.”**

**Why:** `originals-unchanged` creates the demo before taking hashes, then
checks `init`, `inspect`, and `checklist`. It does not hash the bundled source
fixtures around `demo`, so “every operation” is broader than the assertion.

**Concrete fix:** either hash the shipped examples before and after `demo` and
cover every command path, or write the exact evidence: **“Tests hash sample
photos and sidecars around init, inspect, and checklist.”**

### F-3-8 — two navigation targets are narrower than the required 44 px

**Exact locations:** at 390 px, header **“Demo”** is 28.9×44 px and footer
**“Terms”** is 42.2×44 px. `site/src/style.css:39` sets only `min-height`.

**Why:** the product contract requires 44 px touch targets in both dimensions.
Spacing around the links does not make the actual hit area 44 px wide.

**Concrete fix:** give header/footer navigation links at least 44 px inline
size or sufficient inline padding. Add a 390 px test that checks every visible
header/footer link's bounding box is at least 44×44.

## Minor findings

### F-3-9 — Axe reports a complementary-landmark violation on landing and demo

**Exact location:** `aside.manifest-peek` inside the hero `section` at
`site/index.html:48`.

**Evidence:** Axe reports `landmark-complementary-is-top-level` with moderate
impact on both `/` and `/demo/`.

**Why:** the sample recipe is directly related to the hero rather than an
independent complementary region, so the nested `aside` gives an inaccurate
landmark to screen-reader navigation.

**Concrete fix:** use a labelled `figure` or `div`, or move a genuinely
complementary `aside` to the top level. Make the Axe regression require zero
violations, not only zero serious/critical violations.

### F-3-10 — “CLI” is unexplained jargon in visitor copy

**Exact locations:** landing label **“Bundled CLI demo”**; README opening
**“Folder Recipe is a local CLI…”** and **“reset the CLI demo”**; Privacy
heading **“The CLI stays local.”**

**Why:** a photographer should not need to know the acronym before deciding
whether this is an app or a terminal tool.

**Concrete rewrite:** use **“command-line tool”** on first mention,
**“Bundled command-line demo,”** **“reset the demo,”** and **“The command-line
tool stays on your computer.”**

### F-3-11 — “schema v1” exposes implementation jargon in the browser result

**Exact locations:** demo result **“Valid schema v1”** and error **“Schema
version 2 is not supported. Use version 1.”**

**Why:** “schema” describes the implementation, not the visitor's recovery
task. The raw JSON field can remain in diagnostic detail without leading the
status message.

**Concrete rewrite:** **“Valid recipe file · version 1”** and **“This recipe
file uses version 2. Choose a version 1 recipe file.”**

### F-3-12 — the repository copy audit is incomplete and contains wrong counts

**Exact location:** `.factory/copy-audit.md`.

**Evidence:** it omits the first-screen facts and multiple possible validation
messages. It counts **“The demo and recipe file checker remain available”** as
7 words (8), **“Check this recipe file”** as 5 (4), and the recovery sentence
ending **“to diagnose it”** as 13 (14) under its stated whitespace rule.

**Why:** the claimed proof of plain copy cannot catch regressions if it omits
rendered strings and miscounts them.

**Concrete fix:** generate the audit from static HTML, README, and exported
render/error strings; include metadata, facts, headings, actions, empty/error
states, and use one tested whitespace-count function.

## Copy audit

Counts are whitespace-delimited. Code spans containing spaces count as
multiple words. Terminal periods are added below where the rendered copy is a
heading, alt text, label, or list item without punctuation. No sentence exceeds
22 words and no banned marketing adjective appears. The flags are F-1-33 and
F-3-10–F-3-12.

### Landing and metadata sentences

| Words | Sentence |
| ---: | --- |
| 15 | Save editor profiles beside photo folders, check inherited recipe files, and export an import checklist. |
| 12 | Keep each photo folder’s chosen editor profile in a readable recipe file. |
| 9 | A blue-hour photo archive leads toward one amber-marked folder. |
| 6 | Save photo editor profiles beside folders. |
| 14 | For photographers mixing shoots and editors, keep the chosen profile with each photo folder. |
| 10 | Opens a sample shoot and shows its saved editor profiles. |
| 6 | Runs locally without a network connection. |
| 4 | Does not change photos. |
| 5 | Free under the MIT License. |
| 13 | A folder uses its own recipe file or the nearest one above it. |
| 9 | Inspect shows the source before you open an editor. |
| 11 | Name each editor profile and record why it fits the shoot. |
| 16 | See whether this folder or a parent saved the recipe file, beside file counts and types. |
| 12 | Create editor and profile steps for every folder with a recipe file. |
| 4 | Choose a `.photo-recipe.json` file. |
| 9 | Your browser checks it without uploading or storing it. |
| 5 | Accepts a JSON recipe file. |
| 12 | Use the sample to see two editor profiles and the folder note. |
| 8 | This transcript comes from the bundled sample command. |
| 9 | It creates a temporary archive and prints its location. |
| 8 | Run the command again for a clean sample. |
| 6 | Delete its printed folder to reset. |
| 7 | Build the single Rust binary from source. |
| 4 | No account is needed. |
| 12 | It does not edit photos, apply profiles, or manage an editor catalogue. |
| 8 | It records your choices in files you control. |
| 8 | Folder Recipe saves editor profiles beside photo folders. |
| 1 | Offline. |
| 8 | The demo and recipe file checker remain available. |

### Rendered demo, empty, error, and status sentences

| Words | Sentence |
| ---: | --- |
| 7 | Check saved profiles in a sample shoot. |
| 7 | Demo — sample data, nothing is saved. |
| 4 | No folder note recorded. |
| 7 | No camera, source, or file types recorded. |
| 5 | Could not read recipe file. |
| 4 | Check this recipe file. |
| 7 | This file is not a JSON object. |
| 6 | Schema version 2 is not supported. |
| 3 | Use version 1. |
| 7 | The recipe file needs a non-empty “name”. |
| 6 | The recipe file needs a “recommended_editor”. |
| 10 | The recipe file needs a saved editor profile in “editor_mappings”. |
| 7 | There is no saved profile for “rawtherapee”. |
| 14 | Choose a version 1 recipe file or run `folder-recipe inspect --json` to diagnose it. |
| 15 | The file is larger than 1 MB, which is unusually large for a folder recipe. |
| 6 | The file could not be parsed. |
| 7 | Demo reset to the bundled portrait sample. |
| 2 | Demo loaded. |
| 5 | Sample recipe profiles are ready. |
| 6 | Select the command above to copy. |

### README sentences

| Words | Sentence |
| ---: | --- |
| 12 | Folder Recipe is a local CLI for photographers who use several editors. |
| 9 | It writes a recipe file beside each photo folder. |
| 6 | The recipe file is named `.photo-recipe.json`. |
| 9 | It stores named editor profiles in readable, versioned JSON. |
| 7 | The command creates an isolated temporary archive. |
| 11 | It inspects an inherited recipe and exports a two-folder import checklist. |
| 10 | Each run uses a new folder and prints its path. |
| 8 | Delete that folder to reset the CLI demo. |
| 6 | The browser demo is at <https://folder-recipe-switcher.sociobot.in/?demo=1>. |
| 10 | Its sample stays in memory and never touches selected files. |
| 6 | Build the single binary from source: |
| 11 | Folder Recipe starts at version `0.1.0` and installs the `folder-recipe` binary. |
| 5 | Each editor profile is explicit. |
| 14 | The command also records observed file extensions and your supplied camera or source notes. |
| 13 | Inspect reports whether this folder or its nearest parent supplied the recipe file. |
| 8 | It shows which file supplied the editor profile. |
| 13 | The checklist contains one sorted row for each folder with a recipe file. |
| 10 | Run `folder-recipe --help` or `folder-recipe <command> --help` for every option. |
| 6 | Commands do not ask interactive questions. |
| 3 | Success exits `0`. |
| 8 | Invalid input or an unsafe overwrite exits `2`. |
| 7 | An input or output failure exits `1`. |
| 9 | Schema version `1` is deterministic and accepts unknown fields. |
| 7 | Other schema versions return a clear error. |
| 4 | Requirements: Rust and Node. |
| 13 | `npm test` runs Rust, site, claim, browser, mobile, offline, privacy, and accessibility checks. |
| 11 | `npm run build` creates `dist/bin/folder-recipe` and the deployable website in `dist/site`. |
| 6 | Do not publish from this repository. |
| 5 | The factory owns publishing credentials. |
| 8 | The CLI has no telemetry or network code. |
| 8 | It works while network system calls are denied. |
| 12 | Folder Recipe changes only the recipe file or checklist path you request. |
| 10 | Tests hash photos and sidecars before and after every operation. |
| 7 | The browser checker requests only this site. |
| 14 | It does not store selected recipe files in cookies, browser storage, IndexedDB, or OPFS. |
| 10 | Folder Recipe does not edit photos or apply editor profiles. |
| 10 | It records choices for you to use in your editor. |
| 8 | Folder Recipe is free under the [MIT License](LICENSE). |

### Headings, actions, and terminology

- The headline is six words and job-first. Section headings make sense out of
  context. No heading skip was found.
- **“Try it with sample data,” “Install Folder Recipe,” “Choose recipe file,”
  “Try the sample recipe file,” “Reset demo,” “Start for real,”** and **“Copy
  install command”** begin with verbs and name an outcome. No action-copy
  finding is recorded.
- *Recipe file*, *editor profile*, *inherited recipe*, *saved in this folder*,
  *import checklist*, and *demo* are otherwise consistent. The file
  type/extension conflict is F-1-33. The unexplained *CLI* and *schema* terms
  are F-3-10 and F-3-11.

## Demo and sandbox evidence

- One click from `/` opened `/?demo=1`, set title **“Demo — Folder Recipe,”**
  focused the h1, displayed the persistent banner, and loaded **“August
  portraits”** with two profiles in memory.
- After selecting a fixture named **“Private fixture,”** Reset restored
  **“August portraits.”** Start for real returned to `/`, hid the banner, and
  restored the empty checker.
- The complete live demo/selected-file flow made 15 requests, all to the
  product origin. Afterwards: localStorage 0, sessionStorage 0, cookies empty,
  IndexedDB 0, OPFS 0.
- A controlled `/demo/` client reloaded offline, retained the demo heading,
  reset the bundled sample, and displayed the offline notice.
- `dist/bin/folder-recipe demo --output` ran inside
  `/tmp/folder-recipe-cli3.gkBprG/sample`, created two recipe files plus the
  checklist, and left the clean clone unchanged. Two bare demo runs also
  printed distinct `/tmp/folder-recipe-demo-*` paths.
- The demo's functional isolation passes. F-1-2 is specifically the mobile
  first-viewport presentation failure.

## Claims matrix

I cloned commit `2ecfb535e1c9d251e33dbccb9148b6f29a59ac8f`
without local hardlinks to `/tmp/folder-recipe-review3.QoeCEX`, ran `npm ci`,
and executed every `test` string from `.factory/claims.json` separately.

| Claim ID | Result |
| --- | --- |
| `demo-isolated` | PASS |
| `recipe-write` | PASS |
| `originals-unchanged` | PASS |
| `nearest-inheritance` | PASS |
| `checklist-export` | PASS |
| `cli-contract` | PASS |
| `future-fields` | PASS |
| `cli-offline` | PASS |
| `build-outputs` | PASS |
| `scope-boundary` | PASS |
| `web-demo-isolated` | PASS |
| `browser-private` | PASS |
| `offline-demo` | PASS |
| `mit-free` | PASS |

No listed command failed. F-3-2 and F-3-3 explain why two passing tests do not
assert their entire sentence. F-3-4 through F-3-7 identify unlisted or
overbroad README claims. All other claim-like landing and README sentences map
to the write, originals, inheritance, checklist, CLI contract, future-fields,
offline, build, scope, browser privacy/isolation, or MIT entries.

The aggregate `npm test` also passed: 6 Rust tests, 6 static tests, 14 claim
tests, and 14 Playwright tests across desktop and 390 px. The advertised
`cargo install --git …` command installed a fresh-prefix binary, and
`folder-recipe --version` returned `0.1.0`.

## Earlier finding recheck

I read `.factory/review-1.md`, `.factory/review-2.md`,
`.factory/polish-1.md`, `.factory/polish-2.md`, `.factory/handoff.md`, and both
verification reports. Each item below was checked against the live site and
current source rather than accepted from its status label.

| Earlier item | Round 3 result |
| --- | --- |
| F-1-1 | Fixed: job, audience, primary sample action, outcome, and three facts are visible at both widths. |
| F-1-2 | **Half-fixed; reopened above:** demo mechanics pass, but its mobile first viewport does not expose the promised profile result. |
| F-1-3 | Fixed: 14 ledger entries exist and all 14 commands pass independently. |
| F-1-4 | Fixed: metadata job claims map to write, inheritance, checklist, and offline tests. |
| F-1-5 | Fixed: observed file data is produced and asserted. |
| F-1-6 | Fixed: photo/sidecar hashes are asserted around init, inspect, and checklist. |
| F-1-7 | Fixed: unmeasured “small” copy is absent. |
| F-1-8 | Fixed: named editor profiles and two explicit mappings are tested. |
| F-1-9 | Fixed: the unchanged-photo statement has hash coverage. |
| F-1-10 | Fixed: current-folder, parent, and nearer-parent resolution pass. |
| F-1-11 | Fixed: inspect reports the source path. |
| F-1-12 | Fixed: two sorted checklist rows are asserted. |
| F-1-13 | Fixed: the complete browser flow was same-origin only. |
| F-1-14 | Fixed: selected contents did not enter browser persistence. |
| F-1-15 | Fixed: valid JSON and version-specific recovery render. |
| F-1-16 | Fixed: controlled demo reload/reset works offline. |
| F-1-17 | Fixed: MIT/no-payment behavior is listed and tested. |
| F-1-18 | Fixed: the README opening is split into short sentences. |
| F-1-19 | Fixed: photo and sidecar contents remain unchanged in the tested operations. |
| F-1-20 | Fixed: closed-stdin behavior passes. |
| F-1-21 | Fixed: exit codes 0, 2, and 1 pass. |
| F-1-22 | Fixed: repeated schema-v1 output is byte-identical. |
| F-1-23 | Fixed: nearer-parent override is asserted. |
| F-1-24 | Fixed: unknown fields work and version 2 fails clearly. |
| F-1-25 | Fixed for current behavior: the documented aggregate command passed; ledger status is separately F-3-6. |
| F-1-26 | Fixed: binary and deployable route artifacts are built. |
| F-1-27 | Fixed: CLI network denial, browser privacy, and account/payment scope pass. |
| F-1-28 | Fixed: selected-file state stays in memory. |
| F-1-29 | Fixed for init/inspect/checklist; the README's broader “every operation” wording is F-3-7. |
| F-1-30 | Fixed: the CLI demo completes with socket/connect denial. |
| F-1-31 | Fixed: selected-file traffic/storage checks pass live and locally. |
| F-1-32 | Fixed: no analytics, account, payment, cookie, or third-party runtime path was found. |
| F-1-33 | **Regressed; reopened above:** README “file extensions” conflicts with landing “file types.” |
| F-1-34 | Fixed: task headings and GitHub destination labels are understandable. |
| F-1-35 | Fixed: `/demo/` is real and an unknown URL returns a designed HTTP 404. |
| F-1-36 | **Half-fixed; reopened above:** `/demo/` exists, but the published `?demo=1` entry serves landing OG metadata and demo meta description is not specific. |
| F-1-37 | Fixed: shared skip/header/footer/legal shell is present on every checked route. |
| F-1-38 | Fixed: CSP, Permissions Policy, frame denial, nosniff, and referrer policy are live. |
| F-2-1 | Fixed: the local/offline fact exactly matches `cli-offline` and its landing location. |
| F-2-2 | Fixed: app and legal Back navigation focus and announce their h1. |
| Verification P1 | Fixed: revisioned worker/update tests pass and the live demo reloads offline. |
| Verification P2 | Fixed: live hashed assets use `max-age=31536000, immutable`; the worker uses `no-cache`. |

## Structure, accessibility, and live integrity

- `/`, `/demo/`, `/privacy/`, and `/terms/` return 200. An unknown route
  returns the designed 404 with Home and Demo actions.
- Every checked route has `lang=en`, one h1, one main, a canonical, description,
  favicon, apple-touch icon, OG image, Twitter card, and consistent shell.
  Titles follow the required route pattern. The demo metadata defect is
  F-1-36.
- All unique internal and GitHub links returned their expected status. The
  404 page's same-document skip link naturally remains on the 404 response and
  works as a fragment link.
- Browser Back restored h1 focus and a non-empty live announcement on both the
  app and legal route.
- The factory URL verifier passed title, lang, h1, main, image alt, button
  labels, and zero console errors on `/`.
- Axe had no serious/critical violations. Its one moderate violation on landing
  and demo is F-3-9. Manual keyboard/touch checks found F-3-1 and F-3-8.
- Reduced-motion CSS is present. The mobile page has no horizontal overflow.
  The built JS is 5,801 bytes raw / about 2.47 KB gzip, below the 150 KB limit.
- Live root, demo, legal pages, 404 file, worker, hero, and hashed JS/CSS are
  byte-identical to the clean build.
- The blue-hour archive artwork, amber safe-light palette, serif/monospace
  pairing, recipe rail, and squared controls match `.factory/design.md`. This
  is a distinct product identity, not a generic SaaS template.
- `robots.txt` and `sitemap.xml` list the public routes. No runtime AI, provider
  key, analytics, third-party font, or third-party script was found.

## Missed leverage

The brief's obvious adjacent feature is checklist export; it exists in the CLI
and is demonstrated. A sync layer would conflict with the local plain-file
model, and an AI step would add no necessary value to deterministic profile
selection. No missed-leverage or decorative-AI finding is recorded.

## What would make this perfect

Show the actual sample profile result within the first 390×844 demo viewport;
restore one visitor term for file types; serve complete demo metadata from the
URL the product publishes; expose visible focus and 44×44 targets; remove the
invalid complementary landmark; replace CLI/schema jargon; and make every
README promise both listed and fully asserted. Regenerate the copy audit from
all rendered states. After those changes, rerun every claim command, the full
suite, live offline/storage interception, keyboard and touch checks, route
crawl, metadata source checks, and the complete earlier-finding table.
