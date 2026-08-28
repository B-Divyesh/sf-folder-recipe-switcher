# Folder Recipe

Folder Recipe is a local command-line tool for photographers who use several editors. It writes a recipe file beside each photo folder.

The recipe file is named `.photo-recipe.json`. It stores named editor profiles in readable, versioned JSON.

## Try the bundled sample

```sh
cargo run -q -p folder-recipe -- demo
```

The command creates an isolated temporary archive. It inspects an inherited recipe and exports a two-folder import checklist.

Each run uses a new folder and prints its path. Delete that folder to reset the demo.

The browser demo is at <https://folder-recipe-switcher.sociobot.in/demo/>. Its sample stays in memory and never touches selected files.

## Install

Build the single binary from source:

```sh
cargo install --path cli
```

This installs `folder-recipe` version `0.1.0`.

## Save editor profiles

```sh
folder-recipe init ./2026-08-portraits \
  --name "August portraits" \
  --map rawtherapee="Portrait neutral v3" \
  --map darktable="Portrait neutral" \
  --recommend rawtherapee \
  --camera "Fujifilm X-T5" \
  --source camera-raw \
  --note "Protect warm skin tones"
```

Each editor profile is explicit. The command also records file types and your supplied camera or source notes.

## Check a photo folder

```sh
folder-recipe inspect ./2026-08-portraits/selects
folder-recipe inspect ./2026-08-portraits/selects --json
```

Inspect reports whether this folder or its nearest parent supplied the recipe file. It shows which file supplied the editor profile.

## Export an import checklist

```sh
folder-recipe checklist ./archive --output ./archive/import-checklist.md
folder-recipe checklist ./archive --format json --output ./archive/import-checklist.json
```

The checklist contains one sorted row for each folder with a recipe file.

## Command behavior

Run `folder-recipe --help` or `folder-recipe <command> --help` for every option. Commands do not ask interactive questions.

Success exits `0`. Invalid input or an unsafe overwrite exits `2`. An input or output failure exits `1`.

Schema version `1` is deterministic and accepts unknown fields. Other schema versions return a clear error.

## Develop and verify

Requirements: Rust and Node.

```sh
npm ci
npm test
npm run build
cargo package --manifest-path cli/Cargo.toml
```

Run all checks with `npm test`.

`npm run build` creates `dist/bin/folder-recipe` and the deployable website in `dist/site`.

Do not publish from this repository. The factory owns publishing credentials.

## Privacy and limits

The command-line tool has no telemetry or network code. It works while network system calls are denied.

Folder Recipe changes only the recipe file or checklist path you request. Tests hash sample photos and sidecars around init, inspect, and checklist.

The browser checker requests only this site. It does not store selected recipe files in cookies, browser storage, IndexedDB, or OPFS.

Folder Recipe does not edit photos or apply editor profiles. It records choices for you to use in your editor.

## License

Folder Recipe is free under the [MIT License](LICENSE).
