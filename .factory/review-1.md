# Adversarial first-read review 1 — FAIL

**Product:** Folder Recipe
**Reviewed:** 2026-08-28 UTC
**Live URL:** <https://folder-recipe-switcher.sociobot.in/>
**Verdict:** **FAIL** — blocking first-read, demo, and claims-contract failures remain.

## Cold first read

I opened separate fresh Chromium contexts at 390×844 and 1440×900 without
scrolling. In both, I could infer photography only from `rawtherapee`, a
profile name, and the archive image. I could not answer all required questions:

- **What does it do?** Not plainly. The heading is **“The right recipe,
  waiting in the folder.”** It does not say that the CLI writes a file beside a
  photo folder, records editor-profile choices, or checks inheritance.
- **For whom?** Not stated. The only apparent audience clue is the unexplained
  sample editor name `rawtherapee`.
- **What should I click first?** The primary action is **“Install the CLI”**;
  this asks for setup before showing a result. **“Inspect a manifest”** is not
  visible as a sample-data path and requires scrolling to use.

## Blocking findings

### F-1-1 — The first screen does not state the job, audience, or safe first action

**Location/quote:** live landing `<h1>`, **“The right recipe, waiting in the
folder.”**; lead, **“Stop carrying processing intent in your head.”**; primary
button, **“Install the CLI”**.

**Why:** “recipe” and “processing intent” are undefined metaphors. No sentence
names photographers or their mixed-folder/editor problem. Installing software
is not a tryable first action. This failed on the 390 px and desktop first
viewport.

**Fix:** use **“Save photo editor profiles beside folders”** and **“For
photographers mixing shoots and editors, keep the chosen profile with each
photo folder.”** Make **“Try it with sample data”** primary, alongside
**“Opens a sample shoot and shows its saved editor profiles.”**

### F-1-2 — No required one-click, isolated CLI demo exists

**Evidence:** the first screen has no **“Try it with sample data”** action.
`GET /demo` returns the landing page (200, title `Folder Recipe — Keep every
photo folder’s intent`) rather than a demo. `cargo run -q -p folder-recipe --
demo` exits 2 with **“unrecognized subcommand 'demo'”**. The repository has no
`examples/` directory or `.factory/demo.md`.

**Why:** the below-the-fold **“Or load the portrait sample”** inspector does not
demonstrate the CLI’s main job over a sample archive. It lacks the persistent
**“Demo — sample data, nothing is saved”** banner, **Reset demo**, **Start for
real**, a resettable isolated namespace, and a verifier entry point.

**Fix:** ship realistic sample folders in `examples/`; add `folder-recipe demo`
(or `--demo`) that creates a temp directory, runs init/inspect/checklist, and
prints its output location. Add a self-hosted terminal recording and first-view
**“Try it with sample data”** link. Document the command, sample,
reset/discard behavior, and isolation in `.factory/demo.md`. If retaining a web
demo, implement `/demo` or `?demo=1`, separate `demo:` storage, banner, Reset,
and Start-for-real controls.

### F-1-3 — The required claims ledger and tagged claim tests are absent

**Evidence:** `.factory/claims.json` does not exist and `rg` found no
`@claim:` tag. The clean clone therefore had no listed claim test to run.

**Why:** the site and README promise safety, privacy, offline behavior, and
output, but none has a claim ID, clean-sandbox command, or observable
assertion. A general `npm test` pass is not a claims test.

**Fix:** add `.factory/claims.json` with one entry per retained claim, each
pointing to exactly one `@claim:<id>` test. Start each at the demo entry point;
privacy tests must intercept the complete flow and assert only same-origin
traffic, and offline tests must set the demo context offline after first load.
Remove promises that cannot be proven.

## Unlisted claim findings

Each row is an individual unlisted claim-like sentence or fact. Add the stated
claim/sandbox test or remove it. These are major findings and cannot be
accepted while F-1-3 remains unresolved.

| ID | Exact quote and location | Concrete test/fix |
| --- | --- | --- |
| F-1-4 | Meta: **“Portable, inspectable processing recipes for photo folders. A free local-first CLI.”** | Test write/inspect and no-network behavior, or use non-claim copy. |
| F-1-5 | Hero: **“Reads folder metadata.”** | Exercise a sample folder and assert what is read. |
| F-1-6 | Hero: **“Never alters originals.”** | Hash demo originals before/after demo, init, inspect, and checklist. |
| F-1-7 | Principle: **“One small manifest”** | Define/test format and size, or remove “small.” |
| F-1-8 | Principle: **“Any editor explicitly mapped”** | Test arbitrary multiple editor/profile mappings. |
| F-1-9 | Principle: **“Zero pixels changed”** | Cover original hashes as in F-1-6. |
| F-1-10 | Workflow: **“Each folder can set its own rule or inherit the nearest parent.”** | Assert direct and nearest-parent resolution in a fixture. |
| F-1-11 | Workflow: **“You can see which one applies before opening an editor.”** | Assert demo inspect reports source manifest and inheritance. |
| F-1-12 | Workflow: **“Export a checked list for a mixed archive before the first import.”** | Run demo checklist and assert records/output path. |
| F-1-13 | Inspector: **“Nothing uploads.”** | Intercept all demo requests and assert only same-origin traffic. |
| F-1-14 | Inspector: **“Parsing happens in this tab and the file is never stored.”** | Monitor requests and storage APIs over the complete flow. |
| F-1-15 | Inspector: **“JSON only · processed locally”** | Test accepted/rejected input, local processing, and no persistence. |
| F-1-16 | Offline note: **“The docs and manifest inspector still work locally.”** | Load sample, set offline, reload, and parse it. |
| F-1-17 | Footer: **“Free and open source”** | Link release/license facts and test no account/payment route, or state only license. |
| F-1-18 | README: **“It writes a readable `.photo-recipe.json` beside each folder, previews inherited recipes, checks what is actually in the folder, and exports an editor import checklist.”** | Split into tested write, inheritance, inspection, and checklist claims. |
| F-1-19 | README: **“It never changes a photo or sidecar.”** | Hash originals and sidecars through every demo operation. |
| F-1-20 | README: **“Commands are non-interactive.”** | Test the documented command matrix has no prompts. |
| F-1-21 | README: **“Success exits `0`; invalid input or an unsafe overwrite exits `2`; an I/O failure exits `1`.”** | Assert each exit outcome in the demo fixture. |
| F-1-22 | README: **“The manifest is stable, versioned JSON intended for source control.”** | Test schema/version and deterministic serialization; remove “stable” if unpromised. |
| F-1-23 | README: **“A parent manifest applies to descendants until a nearer manifest overrides it.”** | Add explicit nearer-override fixture/assertion. |
| F-1-24 | README: **“Unknown fields are tolerated so future adapters can add metadata without breaking older clients.”** | Inspect schema-v1 sample with unknown fields. |
| F-1-25 | README: **“`npm test` runs Rust unit/integration tests and the site checks.”** | Keep only if observable command output remains accurate. |
| F-1-26 | README: **“`npm run build` builds the release binary and Vite documentation site into `dist/`; the deployable static site is exactly `dist/site`.”** | Assert binary and `dist/site` after clean build. |
| F-1-27 | README: **“No telemetry, accounts, network calls or cloud catalogue.”** | Run CLI with network denied; inspect demo requests/storage. |
| F-1-28 | README: **“The live manifest inspector parses selected files entirely in the browser and does not persist them.”** | Assert no local/session/IndexedDB/OPFS persistence or non-origin request. |
| F-1-29 | README: **“Folder Recipe modifies only `.photo-recipe.json` or the checklist path you explicitly request; originals and editor sidecars are never opened for writing.”** | Snapshot tree and assert only permitted paths change. |
| F-1-30 | Privacy, CLI: **“Folder Recipe has no telemetry and makes no network requests.”** | Network-denied CLI demo test. |
| F-1-31 | Privacy, website: **“It does not upload, transmit, or persist the file.”** | Fresh-context request and storage test. |
| F-1-32 | Privacy, website: **“The site does not use analytics, advertising, cookies, accounts, or third-party scripts.”** | Assert no cookies/storage and only first-party origins. |

## Other major findings

### F-1-33 — The copy audit has a 24-word sentence and unexplained, inconsistent terms

**Quote:** README: **“It writes a readable `.photo-recipe.json` beside each
folder, previews inherited recipes, checks what is actually in the folder, and
exports an editor import checklist.”** (24 words).

**Why:** it exceeds the 22-word cap and combines four jobs. The same concept is
called “recipe,” “manifest,” “rule,” and “intent”; values are “profile,”
“style,” and “mapping.” “Heuristics,” “direct,” “inherited,” “archive rhythm,”
and “light table” arrive before a plain explanation.

**Fix:** use *recipe file* for the visitor concept and explain
`.photo-recipe.json` once as its filename. Use *editor profile* consistently.
Rewrite as: **“It writes a recipe file beside each photo folder. It shows
inherited settings and exports an import checklist.”**

### F-1-34 — Headings and navigation labels do not stand alone

**Quote:** **“Local archive protocol,” “Archive rhythm,” “Browser light table,”
“Start local,” “Workflow,” “Try a manifest,”** and external header link
**“Source.”**

**Why:** a screen-reader heading/link list does not explain the sections.
“Source” is an external GitHub link without a destination cue. **“Or load the
portrait sample”** is a secondary alternative rather than a clear first result.

**Fix:** use **“How recipe files work,” “Check a photo folder’s recipe,” “Try
the sample recipe file,”** and **“Install Folder Recipe.”** Label GitHub as
**“View source on GitHub (opens GitHub).”** Promote the sample in F-1-2.

### F-1-35 — `/demo` is not a real deep link and unknown paths lack a designed 404

**Evidence:** `/demo` and `/not-a-real-page` both return HTTP 200 and the
landing shell; neither has a demo title/content. The latter is not a designed
error page with a way back.

**Why:** a catalog/verifier URL cannot enter a demo, and a bad link silently
shows unrelated content. There is no demo-route focus/announcement behavior to
validate.

**Fix:** implement `/demo` with title **“Demo — Folder Recipe”**, demo state,
focus moved to its one `<h1>`, and `aria-live` announcement. Add styled `/404`
and host rewrite with explanation and Home/Demo links; unknown paths must return
404.

### F-1-36 — Metadata is incomplete and the landing title is not plain-language

**Evidence:** title is **“Folder Recipe — Keep every photo folder’s intent.”**
Landing has no Open Graph tags, Twitter card, or apple-touch icon.
`/privacy/` and `/terms/` lack canonical and social metadata.

**Why:** “intent” repeats the metaphor instead of the job, while sharing and
route discovery lack required metadata.

**Fix:** use **“Folder Recipe — Save photo editor profiles.”** Add per-route
canonical, OG title/description/image, Twitter card, 1200×630 product art, and
180 px apple-touch icon. Give Demo and 404 their own metadata.

### F-1-37 — Privacy and Terms do not use the required consistent skeleton

**Evidence:** `site/public/privacy/index.html` and `site/public/terms/index.html`
have only a wordmark header and two-link footer. They omit the landing nav, skip
link, product one-liner, Privacy+Terms pair, **“Built by Param Factory,”** and
build/version identifier.

**Fix:** share accessible header/footer markup across landing, legal, demo, and
404 pages.

### F-1-38 — The deployed response has no Content-Security-Policy

**Evidence:** root headers contain `x-content-type-options` and
`referrer-policy`, but no `content-security-policy`, `permissions-policy`, or
clickjacking protection. The earlier handoff called this a gap; it remains
unfixed.

**Fix:** add an enforceable tested static-site CSP, appropriate Permissions
Policy, and frame-ancestor protection without breaking the worker.

## Copy audit

Counts are whitespace-delimited. Code blocks, filenames, form fields, and
terminal output are not prose sentences. Labels/headings are separately
audited below.

### Landing-page sentences

| Words | Sentence |
| ---: | --- |
| 7 | The right recipe, waiting in the folder. |
| 7 | Stop carrying processing intent in your head. |
| 13 | Put the editor profile and the reason beside the photographs—plain text, portable, inspectable. |
| 3 | Reads folder metadata. |
| 3 | Never alters originals. |
| 2 | Decide once. |
| 3 | Verify in context. |
| 12 | Each folder can set its own rule or inherit the nearest parent. |
| 10 | You can see which one applies before opening an editor. |
| 12 | Map editor names to exact profiles and note why this shoot differs. |
| 10 | See direct versus inherited intent alongside extensions, count and size. |
| 12 | Export a checked list for a mixed archive before the first import. |
| 3 | Read the intent. |
| 2 | Nothing uploads. |
| 5 | Choose or drop a `.photo-recipe.json`. |
| 11 | Parsing happens in this tab and the file is never stored. |
| 14 | Select the sample to see mappings, heuristics and the folder note in one view. |
| 1 | Offline. |
| 8 | The docs and manifest inspector still work locally. |

### README sentences

| Words | Sentence |
| ---: | --- |
| 18 | Folder Recipe is a local-first CLI for photographers who move between mixed shoots, camera sources and archive folders. |
| **24** | **It writes a readable `.photo-recipe.json` beside each folder, previews inherited recipes, checks what is actually in the folder, and exports an editor import checklist.** |
| 7 | It never changes a photo or sidecar. |
| 9 | Prebuilt binaries can be placed anywhere on your `PATH`. |
| 4 | To build from source: |
| 10 | The package starts at `0.1.0` and installs one binary, `folder-recipe`. |
| 4 | Record the intended recipe. |
| 5 | Each editor/profile pair is explicit: |
| 13 | Preview the direct or nearest inherited rule and compare it with the folder: |
| 12 | Export an import checklist for every manifested folder below an archive root: |
| 10 | Run `folder-recipe --help` or `folder-recipe <command> --help` for all options. |
| 3 | Commands are non-interactive. |
| 16 | Success exits `0`; invalid input or an unsafe overwrite exits `2`; an I/O failure exits `1`. |
| 10 | The manifest is stable, versioned JSON intended for source control. |
| 12 | A parent manifest applies to descendants until a nearer manifest overrides it. |
| 14 | Unknown fields are tolerated so future adapters can add metadata without breaking older clients. |
| 8 | Schema versions other than `1` are rejected clearly. |
| 5 | Requirements: Rust 1.85+, Node 20+. |
| 10 | `npm test` runs Rust unit/integration tests and the site checks. |
| 20 | `npm run build` builds the release binary and Vite documentation site into `dist/`; the deployable static site is exactly `dist/site`. |
| 9 | To work on the site, use `npm run dev`. |
| 13 | To create the publishable Rust crate without publishing, run `cargo package --manifest-path cli/Cargo.toml`. |
| 8 | No telemetry, accounts, network calls or cloud catalogue. |
| 16 | The live manifest inspector parses selected files entirely in the browser and does not persist them. |
| 21 | Folder Recipe modifies only `.photo-recipe.json` or the checklist path you explicitly request; originals and editor sidecars are never opened for writing. |
| 6 | See the live documentation at <https://folder-recipe-switcher.sociobot.in>. |
| 1 | MIT. |
| 2 | See [LICENSE](LICENSE). |

### Labels, headings, and buttons

| Copy | Audit result |
| --- | --- |
| Local archive protocol; Archive rhythm; Browser light table; Start local | Jargon/context-free headings; F-1-33/F-1-34. |
| One small manifest; Any editor explicitly mapped; Zero pixels changed | Unqualified claim fragments; F-1-7–F-1-9. |
| Workflow; Try a manifest; Source | Context-free navigation; F-1-34. |
| Place a manifest on the table; Waiting for a manifest; No recipe on the light table | Metaphor replaces concrete file/action; F-1-33. |
| Choose manifest; Or load the portrait sample; Install the CLI; Inspect a manifest; Copy install command | Only the last names a clear result. The first action must be demo; F-1-1/F-1-2/F-1-34. |
| A small tool, not another catalogue; Free and open source | Marketing/negative framing or unlisted claim; F-1-17/F-1-33. |

No banned-word occurrence was found. Flags are the 24-word sentence, jargon,
metaphor, inconsistent terms, claim fragments, and context-free labels above.

## Checks completed

- Read `.factory/brief.json`, `.factory/design.md`, the current handoff, and
  both historical verification reports. No earlier `.factory/review-*.md` or
  `.factory/polish-*.md` exists, so there are no prior review IDs to re-open.
  The historical service-worker/cache findings are covered by clean tests and
  not reproduced. The prior CSP gap remains F-1-38.
- Fresh 390 px and desktop browser checks: one `h1`, one `main`, `lang=en`, no
  first-viewport horizontal overflow, and no initial console errors. The
  blue-hour archive-room visual is distinct and aligned with the design thesis;
  no generic-template finding is recorded.
- Clean-cloned to `/tmp/folder-recipe-clean.DoHgcY`; `npm ci`, `npm test`, and
  `npm run build` completed successfully. This does not clear F-1-3.
- CLI demo probe `folder-recipe demo` exited 2; demo isolation, Reset, and
  offline demo behavior therefore cannot be accepted.
- Crawled homepage, Privacy, Terms, and GitHub: each returned 200. `/demo` is a
  false-positive landing fallback and unknown-path 200 is F-1-35.
- Landing has title, description, canonical, SVG favicon, one h1, main, alt
  text, skip link, and reduced-motion CSS. The clean-suite browser/Axe test
  passed, so no separate serious/critical accessibility finding is recorded.

## What would make this perfect

Make the job and audience legible in one phone viewport, put a real sample
workflow before installation, and prove every retained promise through a clean
demo command and claims ledger. Then complete real Demo/404 routes, metadata,
shared shell, and CSP. Re-run the entire review against live deployment only
after every finding is fixed.
