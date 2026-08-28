# Folder Recipe

Folder Recipe is a local CLI for photographers who use several editors. It writes a recipe file beside each photo folder.

The recipe file is named `.photo-recipe.json`. It stores named editor profiles in readable, versioned JSON.

## Try the bundled sample

```sh
cargo run -q -p folder-recipe -- demo
```

The command creates an isolated temporary archive. It inspects an inherited recipe and exports a two-folder import checklist.

Each run uses a new folder and prints its path. Delete that folder to reset the CLI demo.

The browser demo is at <https://folder-recipe-switcher.sociobot.in/?demo=1>. Its sample stays in memory and never touches selected files.

## Install

Build the single binary from source:

```sh
cargo install --path cli
```

Folder Recipe starts at version `0.1.0` and installs the `folder-recipe` binary.

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

Each editor profile is explicit. The command also records observed file extensions and your supplied camera or source notes.

## Check a photo folder

```sh
folder-recipe inspect ./2026-08-portraits/selects
folder-recipe inspect ./2026-08-portraits/selects --json
```

Inspect reports the direct or nearest inherited recipe file. It shows which file supplied the editor profile.

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

`npm test` runs Rust, site, claim, browser, mobile, offline, privacy, and accessibility checks.

`npm run build` creates `dist/bin/folder-recipe` and the deployable website in `dist/site`.

Do not publish from this repository. The factory owns publishing credentials.

## Privacy and limits

The CLI has no telemetry or network code. It works while network system calls are denied.

Folder Recipe changes only the recipe file or checklist path you request. Tests hash photos and sidecars before and after every operation.

The browser checker requests only this site. It does not store selected recipe files in cookies, browser storage, IndexedDB, or OPFS.

Folder Recipe does not edit photos or apply editor profiles. It records choices for you to use in your editor.

## License

Folder Recipe is free under the [MIT License](LICENSE).
