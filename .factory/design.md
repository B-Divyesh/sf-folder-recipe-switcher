# Folder Recipe visual thesis

## Direction: cinematic environmental art

Folder Recipe lives between a contact sheet, a darkroom and an archive shelf. The site is staged as a blue-hour archive room: a long bank of translucent negative sleeves leads toward one warm safe-light. That distant amber marker is the intended recipe — a small, legible decision that prevents an entire shoot from drifting into the wrong look. The image explains the product rather than decorating it.

This is deliberately a single dark treatment. A light theme would break the darkroom metaphor and reduce the photographic detail in the hero. Every surface is painted explicitly and all text/UI combinations target WCAG AA contrast.

## Palette

| Token | Value | Use |
| --- | --- | --- |
| Archive ink | `#090e13` | page background |
| Deep navy | `#111b25` | raised surfaces |
| Slate glass | `#1b2a36` | controls, rules |
| Contact white | `#f2efe6` | primary text |
| Silver label | `#b9c3c9` | secondary text |
| Safe-light amber | `#ffb454` | actions, focus, selected recipe |
| Amber ink | `#241507` | text on amber |
| Pine green | `#62c59c` | verified/safe state |
| Warning coral | `#ff8378` | mismatch/error state |

The palette comes from photographic processing: blue-black chemistry trays, translucent film, grease-pencil silver and tungsten safe lights.

## Type and spacing

- Display: Georgia, a local system serif, for the editorial confidence of a handwritten archive title. No font download.
- Utility/body: `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` for manifest fields, file paths and operational copy. No font download.
- Scale: 12 / 14 / 16 / 20 / 32 / clamp(48–88) px. Body never below 16 px.
- Spacing follows an 8 px rhythm, with 4 px only inside compact labels. Content measure is 72 characters; page gutters are 20 px on phone, 48–80 px on larger screens.

## Interaction grammar

- A “recipe rail” connects steps and folder states as one continuous strip, echoing a film strip rather than generic cards.
- Primary controls use amber with square-cut 6 px corners; secondary actions are quiet text links or navy controls.
- The browser demo treats a dropped manifest like placing a negative on a light table. It immediately exposes source, editor mapping and inheritance; the file never leaves the browser.
- Focus is a 3 px amber outline plus offset. Touch targets are at least 44 px.

## Motion

On first view, the hero copy and light-table panel settle upward 12 px over 240 ms. Demo state changes cross-fade over 180 ms. Hover only changes tone/translation by 2 px. Nothing loops. With `prefers-reduced-motion: reduce`, transforms and smooth scrolling are removed and state changes are instant.

## Original asset plan and provenance

- `site/public/archive-room.webp`: generated specifically for Folder Recipe with the factory `factory-image` deployment on 2026-08-27, then locally converted to WebP. Prompt: “Cinematic environmental concept art for a photography archive utility landing-page hero. A quiet blue-hour archival darkroom seen in wide 16:9 perspective, rows of translucent negative sleeves and labeled photo boxes receding toward one warm amber safe-light; a subtle single luminous folder marker is the focal point. Deep blue-black, oxidized slate, warm tungsten amber, tactile paper and film grain, realistic but painterly, strong atmosphere and negative space on the left for web copy. No people, no logos, no text, no letters, no UI, no watermark, no gradients or neon cyberpunk.” Generated output is project-original; generation metadata is preserved at `.factory/provenance/archive-room.json`. Released with this repository under MIT.
- Product mark and interface glyphs are hand-authored CSS/SVG geometric shapes derived from folder tabs and sprocket holes; no third-party icon set.
- `site/public/social-card.jpg` is a 1200×630 center crop derived from the original archive-room artwork. `apple-touch-icon.png` is a hand-drawn raster folder mark using the product palette. Both were produced locally on 2026-08-28 and are released under MIT with the repository.
