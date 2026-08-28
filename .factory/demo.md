# Folder Recipe demo

## Browser

Open <https://folder-recipe-switcher.sociobot.in/demo/>. The first-screen action opens the same sample in one click. `?demo=1` also enters the isolated sample state for compatibility with saved links.

The sample contains an August portrait shoot with RawTherapee and darktable profiles. Demo state exists only in page memory. It does not read local data, `localStorage`, `sessionStorage`, IndexedDB, or OPFS.

The persistent banner identifies demo mode. **Reset demo** restores the bundled recipe. **Start for real** leaves demo mode without copying sample data.

## Command-line tool

Run:

```sh
folder-recipe demo
```

The command copies bundled placeholder `.RAF`, `.jpg`, and `.tiff` sample files into a new temporary folder. It creates two recipe files, inspects an inherited recipe, and writes `import-checklist.md`.

The command prints the temporary path. Delete only that printed folder to reset. Each run uses a different folder and never reads a real photo folder.

For a deterministic test path, use `folder-recipe demo --output <new-folder>`.
