# Adversarial first-read review 2 — FAIL

**Product:** Folder Recipe
**Reviewed:** 2026-08-28 UTC
**Live URL:** <https://folder-recipe-switcher.sociobot.in/>

## Verdict

**FAIL.** One earlier terminology finding is only partly repaired, a landing claim is not in the claims ledger, and Back does not restore the required focus handoff. No listed claim test failed.

## Cold first read

I opened fresh Chromium contexts at 390×844 and 1440×900, without scrolling.

- **What it does:** saves selected photo-editor profiles beside photo folders.
- **For whom:** photographers who mix shoots and editors.
- **What to click first:** **“Try it with sample data.”** The adjacent outcome text says **“Opens a sample shoot and shows its saved editor profiles.”**

The first screen answers all three questions at both sizes. The 390 px view had no horizontal overflow or console/page errors. The blue-hour archive art, amber controls, serif/monospace type pairing, and recipe rail match the design thesis and do not look like a generic SaaS template.

## Findings

### F-1-33 — BLOCKING — terminology remains inconsistent and unexplained

This earlier finding is reopened. Most static prose uses *recipe file* and *editor profile*, but the live first screen and first demo result still use competing names.

**Locations/quotes:** landing eyebrow **“Folder-level photo settings”**; landing recipe-preview status **“direct”**; demo result labels **“Clues”** and **“Explicit mappings.”**

**Why:** “settings,” “direct,” “clues,” and “mappings” make the same information sound like four different concepts. “Direct” is never explained on first use, so a visitor cannot tell it means a recipe saved in the current folder. This is the terminology failure in F-1-33, not a complete repair.

**Fix:** use **“Photo editor profiles for each folder,” “Saved in this folder,” “Camera, source, and file types,”** and **“Saved editor profiles.”** Re-run the copy audit against rendered demo output as well as static page text.

### F-2-1 — Major — “Runs on your computer” lacks a claims-ledger entry

**Location/quote:** first-screen facts: **“Runs on your computer.”**

**Why:** this is a visitor-reliant local-operation claim. No `.factory/claims.json` claim or `where` field states it or names the landing fact. `cli-offline` proves a related no-network behavior but does not cover this exact promise/location.

**Fix:** remove it, or revise `cli-offline` to **“Folder Recipe runs locally without a network connection”** and add **“landing first-screen facts”** to `where`; retain its clean-temp, network-denied observable test.

### F-2-2 — Blocking — browser Back leaves focus on the page body

**Location:** live `/` → `/demo/` → browser Back at 390×844.

**Evidence:** Demo correctly focused `h1#hero-title`. After Back, `networkidle`, and 300 ms, the URL returned to `/`, but live inspection returned:

```json
{"active":"BODY","activeId":"","h1Focused":false,"announcement":""}
```

The same result occurred in three fresh desktop contexts. `main.ts` focuses only on a same-origin `document.referrer` or persisted `pageshow`; this history restoration has an empty referrer and takes neither path.

**Why:** keyboard and screen-reader visitors return from Demo with no focus orientation or route announcement, contrary to the route-change contract.

**Fix:** detect `back_forward` from `performance.getEntriesByType('navigation')` and focus/announce the route `<h1>` on load, without storage. Apply the equivalent behavior to `route.js`. Add a Playwright regression that follows Demo, calls `page.goBack()`, and asserts the `<h1>` is active and `#route-announcer` is non-empty.

## Copy audit

Whitespace-delimited counts exclude code blocks, terminal output, filenames used as code, and nav labels. No prose sentence exceeds 22 words. F-1-33 covers the jargon/inconsistent-term flags above.

### Landing sentences

| Words | Sentence |
| ---: | --- |
| 6 | Save photo editor profiles beside folders. |
| 14 | For photographers mixing shoots and editors, keep the chosen profile with each photo folder. |
| 10 | Opens a sample shoot and shows its saved editor profiles. |
| 13 | A folder uses its own recipe file or the nearest one above it. |
| 9 | Inspect shows the source before you open an editor. |
| 11 | Name each editor profile and record why it fits the shoot. |
| 11 | See the direct or inherited recipe beside file counts and extensions. |
| 12 | Create editor and profile steps for every folder with a recipe file. |
| 4 | Choose a `.photo-recipe.json` file. |
| 9 | Your browser checks it without uploading or storing it. |
| 6 | Accepts a JSON recipe file. |
| 12 | Use the sample to see two editor profiles and the folder note. |
| 8 | This transcript comes from the bundled sample command. |
| 9 | It creates a temporary archive and prints its location. |
| 8 | Run the command again for a clean sample. |
| 6 | Delete its printed folder to reset. |
| 7 | Build the single Rust binary from source. |
| 4 | No account is needed. |
| 12 | It does not edit photos, apply profiles, or manage an editor catalogue. |
| 10 | It records your choices in files you control. |
| 8 | Folder Recipe saves editor profiles beside photo folders. |
| 1 | Offline. |
| 7 | The demo and recipe file checker remain available. |

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
| 9 | Inspect reports the direct or nearest inherited recipe file. |
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

The buttons **“Try it with sample data,” “Install Folder Recipe,” “Choose recipe file,” “Try the sample recipe file,” “Reset demo,”** and **“Start for real”** name their results. No banned marketing adjective was found.

## Demo and sandbox

In a fresh 390 px context, the primary action opened `/?demo=1` in one click. The first resulting screen had title **“Demo — Folder Recipe,”** heading **“Check saved profiles in a sample shoot,”** realistic August portraits data, two mappings, and the persistent **“Demo — sample data, nothing is saved”** banner. **Reset demo** restored `August portraits`; **Start for real** returned to `/` and removed the banner.

During the complete demo and selected-file flow, every request was same-origin. Afterwards local/session storage, cookies, and IndexedDB were empty. A controlled `/demo/` reloaded offline and stayed usable with the offline notice visible. The direct command `dist/bin/folder-recipe demo` created and printed a unique `/tmp/folder-recipe-demo-…` archive, inspected its inherited recipe, and wrote a two-folder checklist; it explicitly said it did not read or write real photo folders.

## Claims and quality gates

I read `.factory/claims.json` and created clean clone `/tmp/folder-recipe-review2.q1XfzB`. Each of these 14 commands passed separately:

`demo-isolated`, `recipe-write`, `originals-unchanged`, `nearest-inheritance`, `checklist-export`, `cli-contract`, `future-fields`, `cli-offline`, `build-outputs`, `scope-boundary`, `web-demo-isolated`, `browser-private`, `offline-demo`, and `mit-free`.

`npm test` and `npm run build` then passed in that clone. Playwright recorded `{"status":"passed","failedTests":[]}`. No listed claim test failed. F-2-1 is the only unlisted claim-like landing sentence; all other claim-like copy maps to the write, originals, inheritance, checklist, isolation, privacy, offline, scope, or MIT tests.

## Earlier reports: live/code recheck

I read `.factory/review-1.md`, `.factory/polish-1.md`, `.factory/handoff.md`, `.factory/verification.md`, and `.factory/verification-2.md`. These are rechecks, not acceptance of prior status labels.

| Earlier item | Result |
| --- | --- |
| F-1-1 | Fixed: job, audience, safe sample action, outcome, and three facts are clear on mobile and desktop. |
| F-1-2 | Fixed: real `/demo/`, in-memory banner/reset/exit, bundled CLI demo, and samples are present and exercised. |
| F-1-3 | Fixed: 14 ledger entries and 14 passing tagged tests exist. |
| F-1-4 | Fixed: concrete metadata is covered by write/network tests. |
| F-1-5 | Fixed: observed extensions are tested recipe output. |
| F-1-6 | Fixed: photo/sidecar hashes are tested. |
| F-1-7 | Fixed: unmeasured “small” copy is absent. |
| F-1-8 | Fixed: named profiles/explicit mappings are tested. |
| F-1-9 | Fixed: unchanged-photo statement has hash proof. |
| F-1-10 | Fixed: direct/nearest-parent resolution is tested. |
| F-1-11 | Fixed: source recipe path is reported and tested. |
| F-1-12 | Fixed: deterministic two-folder checklist is tested. |
| F-1-13 | Fixed: browser flow request capture is same-origin. |
| F-1-14 | Fixed: selected files remain out of cookie/storage/IDB/OPFS/cache. |
| F-1-15 | Fixed: JSON checker has version-specific recovery. |
| F-1-16 | Fixed: controlled demo reloads and resets offline. |
| F-1-17 | Fixed: precise MIT/no-payment fact is tested. |
| F-1-18 | Fixed: README opening is split and its core operations are tested. |
| F-1-19 | Fixed: originals and sidecars remain unchanged. |
| F-1-20 | Fixed: non-interactive closed-stdin behavior is tested. |
| F-1-21 | Fixed: documented 0/2/1 exits are tested. |
| F-1-22 | Fixed: repeat schema-v1 output is byte-compared. |
| F-1-23 | Fixed: nearer override is asserted. |
| F-1-24 | Fixed: future fields/schema-v2 failure are asserted. |
| F-1-25 | Fixed: documented current suite passed cleanly. |
| F-1-26 | Fixed: release binary and deployable routes are asserted. |
| F-1-27 | Fixed: CLI network, browser privacy, and account scope are separate tests. |
| F-1-28 | Fixed: selected-file flow is in-memory under inspection. |
| F-1-29 | Fixed: output boundary/unchanged originals are asserted. |
| F-1-30 | Fixed: CLI demo completes under network syscall denial. |
| F-1-31 | Fixed: selected-file live flow was intercepted and storage inspected. |
| F-1-32 | Fixed: only same-origin requests and no-account behavior are checked. |
| F-1-33 | **Unfixed/half-fixed; reopened above.** |
| F-1-34 | Fixed: headings/links name their sections or destinations. |
| F-1-35 | Fixed: Demo is real and unknown URL returns designed 404. |
| F-1-36 | Fixed: root/demo/legal/404 have title, description, canonical, social image, and icons. |
| F-1-37 | Fixed: common skip/header/footer shell is present. |
| F-1-38 | Fixed: live CSP, Permissions Policy, frame protection, nosniff, and referrer policy are present. |
| Verification P1 | Fixed: revisioned worker/update regression passes; live demo reloads offline. |
| Verification P2 | Fixed: static test covers immutable hashed Vite assets. |

## Structure and missed leverage

- `/`, `/demo/`, `/privacy/`, and `/terms/` returned 200; `/not-a-real-page` returned designed 404 with a route back.
- Each checked route has one `h1`, one `main`, `lang="en"`, description, canonical, OG/Twitter card, favicon, and apple touch icon. `robots.txt` and `sitemap.xml` cover public routes.
- Checked internal links and both GitHub links returned 200. Direct demo focus works; Back focus is F-2-2.
- The brief implies checklist export, which is delivered. It does not imply AI, sync, or another import flow, so no missing-leverage finding applies. No runtime AI/provider key is present.

## What would make this perfect

Use one visitor vocabulary throughout landing and demo, align the local-operation fact with an explicit claims entry, and restore heading focus plus an announcement after browser Back. Then rerun the clean claim matrix and the new Back-navigation regression against live.
