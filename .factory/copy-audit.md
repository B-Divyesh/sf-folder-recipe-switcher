# Copy audit — polish 2

Whitespace-delimited counts exclude code blocks, filenames used as code, navigation labels, and terminal output. The audit includes the rendered demo and error states. No sentence exceeds 22 words. No banned marketing word appears.

## Landing-page sentences

| Words | Sentence |
| ---: | --- |
| 6 | Save photo editor profiles beside folders. |
| 14 | For photographers mixing shoots and editors, keep the chosen profile with each photo folder. |
| 10 | Opens a sample shoot and shows its saved editor profiles. |
| 13 | A folder uses its own recipe file or the nearest one above it. |
| 9 | Inspect shows the source before you open an editor. |
| 11 | Name each editor profile and record why it fits the shoot. |
| 16 | See whether this folder or a parent saved the recipe file, beside file counts and types. |
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

## Rendered demo and error states

| Words | Sentence or label |
| ---: | --- |
| 7 | Check saved profiles in a sample shoot. |
| 6 | Demo — sample data, nothing is saved. |
| 7 | Camera, source, and file types. |
| 3 | Saved editor profiles. |
| 5 | No folder note recorded. |
| 8 | No camera, source, or file types recorded. |
| 5 | Could not read recipe file. |
| 5 | Check this recipe file. |
| 6 | Schema version 2 is not supported. |
| 3 | Use version 1. |
| 13 | Choose a version 1 recipe file or run `folder-recipe inspect --json` to diagnose it. |
| 8 | Demo reset to the bundled portrait sample. |

## Interface labels and headings

The page uses “Photo editor profiles for each folder,” “Saved in this folder,” “Camera, source, and file types,” and “Saved editor profiles.” These labels replace the competing *settings*, *direct*, *clues*, and *mappings* terms found in review 2.

Buttons and links name their results: “Try it with sample data,” “Install Folder Recipe,” “Choose recipe file,” “Try the sample recipe file,” “Reset demo,” and “Start for real.” The GitHub links name their external destination. Empty and error states explain the next result or recovery action.

## README check

Every prose sentence is 22 words or fewer. The opening separates audience, write behavior, filename, and format. The inheritance explanation now says whether the current folder or nearest parent supplied the recipe file.

## Terminology

| Concept | One term |
| --- | --- |
| The per-folder JSON document | recipe file |
| An editor-specific saved look | editor profile |
| A recipe file supplied by a parent folder | inherited recipe |
| A recipe file in the folder being checked | saved in this folder |
| Camera model, source, and extensions | camera, source, and file types |
| Exported preparation document | import checklist |
| Browser sample state | demo |

Result: **PASS**. There are no length, banned-word, unexplained-jargon, or inconsistent-term flags.
