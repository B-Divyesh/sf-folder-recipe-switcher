# Folder Recipe

Folder Recipe is a local-first CLI for photographers who move between mixed shoots, camera sources and archive folders. It writes a readable `.photo-recipe.json` beside each folder, previews inherited recipes, checks what is actually in the folder, and exports an editor import checklist. It never changes a photo or sidecar.

## Install

Prebuilt binaries can be placed anywhere on your `PATH`. To build from source:

```sh
cargo install --path cli
```

The package starts at `0.1.0` and installs one binary, `folder-recipe`.

## Usage

Record the intended recipe. Each editor/profile pair is explicit:

```sh
folder-recipe init ./2026-08-portraits \
  --name "August portraits" \
  --map rawtherapee="Portrait neutral v3" \
  --map darktable="Portrait neutral" \
  --recommend rawtherapee \
  --camera "Fujifilm X-T5" \
  --source camera-raw \
  --note "Mixed window light; protect warm skin tones"
```

Preview the direct or nearest inherited rule and compare it with the folder:

```sh
folder-recipe inspect ./2026-08-portraits/selects
folder-recipe inspect ./2026-08-portraits/selects --json
```

Export an import checklist for every manifested folder below an archive root:

```sh
folder-recipe checklist ./archive --output ./archive/import-checklist.md
folder-recipe checklist ./archive --format json --output ./archive/import-checklist.json
```

Run `folder-recipe --help` or `folder-recipe <command> --help` for all options. Commands are non-interactive. Success exits `0`; invalid input or an unsafe overwrite exits `2`; an I/O failure exits `1`.

## Manifest

The manifest is stable, versioned JSON intended for source control. A parent manifest applies to descendants until a nearer manifest overrides it.

```json
{
  "schema_version": 1,
  "name": "August portraits",
  "recommended_editor": "rawtherapee",
  "editor_mappings": {
    "darktable": "Portrait neutral",
    "rawtherapee": "Portrait neutral v3"
  },
  "heuristics": {
    "camera_models": ["Fujifilm X-T5"],
    "sources": ["camera-raw"],
    "extensions": ["raf"]
  },
  "note": "Mixed window light; protect warm skin tones",
  "created_with": "folder-recipe 0.1.0"
}
```

Unknown fields are tolerated so future adapters can add metadata without breaking older clients. Schema versions other than `1` are rejected clearly.

## Develop and verify

Requirements: Rust 1.85+, Node 20+.

```sh
npm install
npm test
npm run build
```

`npm test` runs Rust unit/integration tests and the site checks. `npm run build` builds the release binary and Vite documentation site into `dist/`; the deployable static site is exactly `dist/site`.

To work on the site, use `npm run dev`. To create the publishable Rust crate without publishing, run `cargo package --manifest-path cli/Cargo.toml`.

## Privacy and scope

No telemetry, accounts, network calls or cloud catalogue. The live manifest inspector parses selected files entirely in the browser and does not persist them. Folder Recipe modifies only `.photo-recipe.json` or the checklist path you explicitly request; originals and editor sidecars are never opened for writing.

See the live documentation at <https://folder-recipe-switcher.sociobot.in>.

## License

MIT. See [LICENSE](LICENSE).
