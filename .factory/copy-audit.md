# Copy audit — polish 1

Whitespace-delimited counts exclude code blocks, filenames, navigation labels, and terminal output. No sentence exceeds 22 words. No banned marketing word appears.

## Landing-page sentences

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

## Interface labels and headings

All labels name their destination or result: “Demo,” “How it works,” “Privacy,” “Try it with sample data,” “Install Folder Recipe,” “Save profiles,” “Check a folder,” “Export a checklist,” “Choose recipe file,” “Try the sample recipe file,” “Reset demo,” and “Start for real.”

The GitHub links say “opens GitHub.” Empty and error states explain what appears next and how to recover.

## README check

Every prose sentence is 22 words or fewer. The earlier 24-word opening was split into one-purpose sentences. `recipe file` is used for the visitor concept, and `.photo-recipe.json` is introduced once as its filename.

## Terminology

| Concept | One term |
| --- | --- |
| The per-folder JSON document | recipe file |
| An editor-specific saved look | editor profile |
| Settings found above the current folder | inherited recipe |
| Exported preparation document | import checklist |
| Browser sample state | demo |

Result: **PASS**. There are no length, banned-word, jargon, or inconsistent-term flags.
