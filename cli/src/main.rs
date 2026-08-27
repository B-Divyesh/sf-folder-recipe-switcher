use clap::{Parser, Subcommand, ValueEnum};
use folder_recipe::{
    checklist_markdown, discover_checklist, inspect_folder, parse_mapping, scan_folder,
    write_manifest, Heuristics, Manifest, RecipeError, Result, SCHEMA_VERSION,
};
use serde::Serialize;
use std::collections::BTreeMap;
use std::fs;
use std::path::{Path, PathBuf};

#[derive(Parser, Debug)]
#[command(
    name = "folder-recipe",
    version,
    about = "Keep each photo folder's processing intent explicit",
    long_about = "Write a portable .photo-recipe.json, preview the direct or inherited recipe, and export a deterministic import checklist. Folder Recipe never modifies photos or editor sidecars."
)]
struct Cli {
    #[command(subcommand)]
    command: Command,
}

#[derive(Subcommand, Debug)]
enum Command {
    /// Write a versioned recipe manifest beside a photo folder
    Init {
        /// Existing photo folder to describe
        folder: PathBuf,
        /// Human-readable folder or shoot name
        #[arg(long)]
        name: String,
        /// Explicit mapping in EDITOR=PROFILE form; repeat for every editor
        #[arg(long = "map", value_name = "EDITOR=PROFILE", required = true)]
        mappings: Vec<String>,
        /// Editor mapping recommended for this folder (defaults to the sole mapping)
        #[arg(long)]
        recommend: Option<String>,
        /// Camera model clue; repeat for mixed-camera folders
        #[arg(long)]
        camera: Vec<String>,
        /// Source clue such as camera-raw, film-scan, or derivative
        #[arg(long)]
        source: Vec<String>,
        /// Expected extension without a dot; defaults to observed extensions
        #[arg(long)]
        extension: Vec<String>,
        /// Short explanation of why this folder differs
        #[arg(long)]
        note: Option<String>,
        /// Replace an existing .photo-recipe.json; never touches other files
        #[arg(long)]
        force: bool,
        /// Print the created manifest as JSON
        #[arg(long)]
        json: bool,
    },
    /// Preview the nearest recipe and compare it with one folder's files
    Inspect {
        /// Existing folder to inspect
        folder: PathBuf,
        /// Emit stable JSON for scripts
        #[arg(long)]
        json: bool,
    },
    /// Export explicit editor/profile steps for manifested folders below a root
    Checklist {
        /// Archive root to scan recursively
        root: PathBuf,
        /// Output format
        #[arg(long, value_enum, default_value_t = OutputFormat::Markdown)]
        format: OutputFormat,
        /// Write to a file instead of stdout
        #[arg(long)]
        output: Option<PathBuf>,
        /// Replace the requested checklist output if it exists
        #[arg(long)]
        force: bool,
    },
}

#[derive(Copy, Clone, Debug, Eq, PartialEq, ValueEnum)]
enum OutputFormat {
    Markdown,
    Json,
}

#[derive(Serialize)]
struct ChecklistDocument<'a> {
    schema_version: u32,
    archive: &'a Path,
    folders: &'a [folder_recipe::ChecklistItem],
}

fn main() {
    let cli = Cli::parse();
    if let Err(error) = run(cli) {
        eprintln!("folder-recipe: {error}");
        std::process::exit(match error {
            RecipeError::Invalid(_) | RecipeError::Json(_) => 2,
            RecipeError::Io(_) => 1,
        });
    }
}

fn run(cli: Cli) -> Result<()> {
    match cli.command {
        Command::Init {
            folder,
            name,
            mappings,
            recommend,
            camera,
            source,
            extension,
            note,
            force,
            json,
        } => {
            let mut editor_mappings = BTreeMap::new();
            for mapping in mappings {
                let (editor, profile) = parse_mapping(&mapping)?;
                if editor_mappings.insert(editor.clone(), profile).is_some() {
                    return Err(RecipeError::Invalid(format!(
                        "editor '{editor}' was mapped more than once"
                    )));
                }
            }
            let recommended_editor = match recommend {
                Some(value) => value.trim().to_ascii_lowercase(),
                None if editor_mappings.len() == 1 => {
                    editor_mappings.keys().next().unwrap().clone()
                }
                None => {
                    return Err(RecipeError::Invalid(
                        "pass --recommend EDITOR when more than one --map is provided".into(),
                    ))
                }
            };
            let signals = scan_folder(&folder)?;
            let mut extensions: Vec<String> = if extension.is_empty() {
                signals.extensions.keys().cloned().collect()
            } else {
                extension
                    .into_iter()
                    .map(|value| value.trim_start_matches('.').to_ascii_lowercase())
                    .collect()
            };
            extensions.sort();
            extensions.dedup();
            let mut sources = if source.is_empty() {
                signals.inferred_sources
            } else {
                source
            };
            sources.sort();
            sources.dedup();
            let manifest = Manifest {
                schema_version: SCHEMA_VERSION,
                name,
                recommended_editor,
                editor_mappings,
                heuristics: Heuristics {
                    camera_models: camera,
                    sources,
                    extensions,
                },
                note,
                created_with: format!("folder-recipe {}", env!("CARGO_PKG_VERSION")),
            };
            let path = write_manifest(&folder, &manifest, force)?;
            if json {
                println!("{}", serde_json::to_string_pretty(&manifest)?);
            } else {
                println!("Wrote {}", path.display());
                println!(
                    "Recommended: {} → {}",
                    manifest.recommended_editor,
                    manifest.editor_mappings[&manifest.recommended_editor]
                );
                if manifest.heuristics.extensions.is_empty() {
                    println!("Observed: empty folder (recipe remains ready for inheritance)");
                } else {
                    println!("Observed: {}", manifest.heuristics.extensions.join(", "));
                }
            }
        }
        Command::Inspect { folder, json } => {
            let inspection = inspect_folder(&folder)?;
            if json {
                println!("{}", serde_json::to_string_pretty(&inspection)?);
            } else {
                println!("Recipe: {}", inspection.recipe.name);
                println!(
                    "Source: {} ({})",
                    inspection.manifest_path.display(),
                    if inspection.inherited {
                        "inherited"
                    } else {
                        "direct"
                    }
                );
                println!(
                    "Apply: {} → {}",
                    inspection.recipe.recommended_editor,
                    inspection.recipe.editor_mappings[&inspection.recipe.recommended_editor]
                );
                for (editor, profile) in &inspection.recipe.editor_mappings {
                    if editor != &inspection.recipe.recommended_editor {
                        println!("Mapped: {editor} → {profile}");
                    }
                }
                println!(
                    "Observed: {} file(s), {}, {}",
                    inspection.signals.file_count,
                    human_bytes(inspection.signals.total_bytes),
                    if inspection.signals.extensions.is_empty() {
                        "no extensions".into()
                    } else {
                        inspection
                            .signals
                            .extensions
                            .iter()
                            .map(|(extension, count)| format!("{extension}×{count}"))
                            .collect::<Vec<_>>()
                            .join(", ")
                    }
                );
                if let Some(note) = &inspection.recipe.note {
                    println!("Why: {note}");
                }
                if inspection.warnings.is_empty() {
                    println!("Status: ready — observed files match the recorded recipe");
                } else {
                    for warning in &inspection.warnings {
                        println!("Check: {warning}");
                    }
                }
            }
        }
        Command::Checklist {
            root,
            format,
            output,
            force,
        } => {
            let items = discover_checklist(&root)?;
            let contents = match format {
                OutputFormat::Markdown => checklist_markdown(&root, &items),
                OutputFormat::Json => {
                    let mut output = serde_json::to_string_pretty(&ChecklistDocument {
                        schema_version: SCHEMA_VERSION,
                        archive: &root,
                        folders: &items,
                    })?;
                    output.push('\n');
                    output
                }
            };
            if let Some(path) = output {
                if path.exists() && !force {
                    return Err(RecipeError::Invalid(format!(
                        "{} already exists; pass --force to replace that checklist",
                        path.display()
                    )));
                }
                fs::write(&path, contents)?;
                println!(
                    "Wrote {} folder recipe(s) to {}",
                    items.len(),
                    path.display()
                );
            } else {
                print!("{contents}");
            }
        }
    }
    Ok(())
}

fn human_bytes(bytes: u64) -> String {
    const UNITS: [&str; 4] = ["B", "KB", "MB", "GB"];
    let mut value = bytes as f64;
    let mut unit = 0;
    while value >= 1000.0 && unit < UNITS.len() - 1 {
        value /= 1000.0;
        unit += 1;
    }
    if unit == 0 {
        format!("{bytes} B")
    } else {
        format!("{value:.1} {}", UNITS[unit])
    }
}
