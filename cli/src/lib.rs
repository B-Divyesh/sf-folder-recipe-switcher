//! The manifest and inspection API used by the `folder-recipe` binary.
//!
//! ```
//! use folder_recipe::{Heuristics, Manifest};
//! use std::collections::BTreeMap;
//!
//! let manifest = Manifest {
//!     schema_version: 1,
//!     name: "Studio selects".into(),
//!     recommended_editor: "darktable".into(),
//!     editor_mappings: BTreeMap::from([("darktable".into(), "Studio base".into())]),
//!     heuristics: Heuristics::default(),
//!     note: None,
//!     created_with: "folder-recipe 0.1.0".into(),
//! };
//! assert!(manifest.validate().is_ok());
//! ```

use serde::{Deserialize, Serialize};
use std::collections::{BTreeMap, BTreeSet};
use std::fmt;
use std::fs;
use std::io;
use std::path::{Path, PathBuf};

pub const MANIFEST_NAME: &str = ".photo-recipe.json";
pub const SCHEMA_VERSION: u32 = 1;

#[derive(Debug)]
pub enum RecipeError {
    Invalid(String),
    Io(io::Error),
    Json(serde_json::Error),
}

impl fmt::Display for RecipeError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Invalid(message) => write!(f, "{message}"),
            Self::Io(error) => write!(f, "{error}"),
            Self::Json(error) => write!(f, "invalid recipe file JSON: {error}"),
        }
    }
}

impl std::error::Error for RecipeError {}

impl From<io::Error> for RecipeError {
    fn from(value: io::Error) -> Self {
        Self::Io(value)
    }
}

impl From<serde_json::Error> for RecipeError {
    fn from(value: serde_json::Error) -> Self {
        Self::Json(value)
    }
}

pub type Result<T> = std::result::Result<T, RecipeError>;

/// Human-supplied and locally observed details about the folder's contents.
#[derive(Clone, Debug, Default, Deserialize, Eq, PartialEq, Serialize)]
#[serde(default)]
pub struct Heuristics {
    pub camera_models: Vec<String>,
    pub sources: Vec<String>,
    pub extensions: Vec<String>,
}

/// Version 1 of the portable `.photo-recipe.json` contract.
#[derive(Clone, Debug, Deserialize, Eq, PartialEq, Serialize)]
pub struct Manifest {
    pub schema_version: u32,
    pub name: String,
    pub recommended_editor: String,
    pub editor_mappings: BTreeMap<String, String>,
    #[serde(default)]
    pub heuristics: Heuristics,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub note: Option<String>,
    pub created_with: String,
}

impl Manifest {
    pub fn validate(&self) -> Result<()> {
        if self.schema_version != SCHEMA_VERSION {
            return Err(RecipeError::Invalid(format!(
                "unsupported schema_version {}; this build supports {}",
                self.schema_version, SCHEMA_VERSION
            )));
        }
        if self.name.trim().is_empty() {
            return Err(RecipeError::Invalid(
                "recipe file name cannot be empty".into(),
            ));
        }
        if self.editor_mappings.is_empty() {
            return Err(RecipeError::Invalid(
                "recipe file needs at least one saved editor profile".into(),
            ));
        }
        match self.editor_mappings.get(&self.recommended_editor) {
            Some(profile) if !profile.trim().is_empty() => Ok(()),
            _ => Err(RecipeError::Invalid(format!(
                "recommended editor '{}' has no saved profile",
                self.recommended_editor
            ))),
        }
    }
}

#[derive(Clone, Debug, Deserialize, Eq, PartialEq, Serialize)]
pub struct FolderSignals {
    pub file_count: usize,
    pub total_bytes: u64,
    pub extensions: BTreeMap<String, usize>,
    pub inferred_sources: Vec<String>,
}

#[derive(Clone, Debug, Deserialize, Eq, PartialEq, Serialize)]
pub struct Inspection {
    pub folder: PathBuf,
    pub manifest_path: PathBuf,
    pub inherited: bool,
    pub inherited_levels: usize,
    pub recipe: Manifest,
    pub signals: FolderSignals,
    pub warnings: Vec<String>,
}

#[derive(Clone, Debug, Deserialize, Eq, PartialEq, Serialize)]
pub struct ChecklistItem {
    pub folder: PathBuf,
    pub name: String,
    pub editor: String,
    pub profile: String,
    pub note: Option<String>,
}

pub fn read_manifest(path: &Path) -> Result<Manifest> {
    let text = fs::read_to_string(path).map_err(|error| {
        RecipeError::Invalid(format!("cannot read {}: {error}", path.display()))
    })?;
    let manifest: Manifest = serde_json::from_str(&text)?;
    manifest.validate()?;
    Ok(manifest)
}

pub fn write_manifest(folder: &Path, manifest: &Manifest, force: bool) -> Result<PathBuf> {
    ensure_folder(folder)?;
    manifest.validate()?;
    let path = folder.join(MANIFEST_NAME);
    if path.exists() && !force {
        return Err(RecipeError::Invalid(format!(
            "{} already exists; pass --force to replace only that recipe file",
            path.display()
        )));
    }
    let mut contents = serde_json::to_string_pretty(manifest)?;
    contents.push('\n');
    fs::write(&path, contents)?;
    Ok(path)
}

pub fn inspect_folder(folder: &Path) -> Result<Inspection> {
    ensure_folder(folder)?;
    let (manifest_path, levels) = nearest_manifest(folder).ok_or_else(|| {
        RecipeError::Invalid(format!(
            "no {MANIFEST_NAME} in {} or any parent; run `folder-recipe init {}`",
            folder.display(),
            folder.display()
        ))
    })?;
    let recipe = read_manifest(&manifest_path)?;
    let signals = scan_folder(folder)?;
    let observed: BTreeSet<&str> = signals.extensions.keys().map(String::as_str).collect();
    let expected: BTreeSet<&str> = recipe
        .heuristics
        .extensions
        .iter()
        .map(String::as_str)
        .collect();
    let unexpected: Vec<_> = observed.difference(&expected).copied().collect();
    let mut warnings = Vec::new();
    if signals.file_count == 0 {
        warnings.push("folder is empty; the recipe can still be inherited by future files".into());
    } else if !expected.is_empty() && !unexpected.is_empty() {
        warnings.push(format!(
            "observed extensions not recorded by this recipe: {}",
            unexpected.join(", ")
        ));
    }
    if levels > 0 {
        warnings.push(format!(
            "recipe is inherited from {} level{} above",
            levels,
            if levels == 1 { "" } else { "s" }
        ));
    }
    Ok(Inspection {
        folder: folder.to_path_buf(),
        manifest_path,
        inherited: levels > 0,
        inherited_levels: levels,
        recipe,
        signals,
        warnings,
    })
}

pub fn scan_folder(folder: &Path) -> Result<FolderSignals> {
    ensure_folder(folder)?;
    let mut file_count = 0;
    let mut total_bytes = 0_u64;
    let mut extensions = BTreeMap::new();
    let mut raw_count = 0;
    let mut raster_count = 0;
    let mut tiny_count = 0;
    for entry in fs::read_dir(folder)? {
        let entry = entry?;
        let path = entry.path();
        let file_type = entry.file_type()?;
        if !file_type.is_file() || path.file_name().and_then(|n| n.to_str()) == Some(MANIFEST_NAME)
        {
            continue;
        }
        let metadata = entry.metadata()?;
        file_count += 1;
        total_bytes = total_bytes.saturating_add(metadata.len());
        if metadata.len() < 1_000_000 {
            tiny_count += 1;
        }
        if let Some(extension) = path.extension().and_then(|value| value.to_str()) {
            let extension = extension.to_ascii_lowercase();
            *extensions.entry(extension.clone()).or_insert(0) += 1;
            if is_raw(&extension) {
                raw_count += 1;
            }
            if matches!(extension.as_str(), "jpg" | "jpeg" | "png" | "tif" | "tiff") {
                raster_count += 1;
            }
        }
    }
    let mut inferred_sources = Vec::new();
    if raw_count > 0 {
        inferred_sources.push("camera-raw".into());
    }
    if raster_count > 0 {
        inferred_sources.push("rendered-or-scan".into());
    }
    if tiny_count > 0 && tiny_count * 2 >= file_count.max(1) {
        inferred_sources.push("small-derivatives".into());
    }
    if file_count > 0 && inferred_sources.is_empty() {
        inferred_sources.push("other-files".into());
    }
    Ok(FolderSignals {
        file_count,
        total_bytes,
        extensions,
        inferred_sources,
    })
}

pub fn discover_checklist(root: &Path) -> Result<Vec<ChecklistItem>> {
    ensure_folder(root)?;
    let mut folders = vec![root.to_path_buf()];
    let mut items = Vec::new();
    while let Some(folder) = folders.pop() {
        let manifest_path = folder.join(MANIFEST_NAME);
        if manifest_path.is_file() {
            let manifest = read_manifest(&manifest_path)?;
            let profile = manifest.editor_mappings[&manifest.recommended_editor].clone();
            let relative = folder.strip_prefix(root).unwrap_or(&folder).to_path_buf();
            items.push(ChecklistItem {
                folder: if relative.as_os_str().is_empty() {
                    PathBuf::from(".")
                } else {
                    relative
                },
                name: manifest.name,
                editor: manifest.recommended_editor,
                profile,
                note: manifest.note,
            });
        }
        let mut children = Vec::new();
        for entry in fs::read_dir(&folder)? {
            let entry = entry?;
            if entry.file_type()?.is_dir() && !entry.file_name().to_string_lossy().starts_with('.')
            {
                children.push(entry.path());
            }
        }
        children.sort();
        folders.extend(children.into_iter().rev());
    }
    items.sort_by(|a, b| a.folder.cmp(&b.folder));
    Ok(items)
}

pub fn checklist_markdown(root: &Path, items: &[ChecklistItem]) -> String {
    let mut output = format!(
        "# Photo import checklist\n\nArchive: `{}`\n\n",
        root.display()
    );
    if items.is_empty() {
        output.push_str("No folder recipes found. Run `folder-recipe init <folder>` first.\n");
        return output;
    }
    output.push_str("- [ ] Confirm editor profile names are installed before importing.\n");
    output.push_str("- [ ] Import one folder at a time; do not carry settings between rows.\n\n");
    for item in items {
        output.push_str(&format!(
            "## [ ] {}\n\n- Folder: `{}`\n- Editor: `{}`\n- Editor profile: `{}`\n",
            escape_markdown(&item.name),
            item.folder.display(),
            escape_markdown(&item.editor),
            escape_markdown(&item.profile),
        ));
        if let Some(note) = &item.note {
            output.push_str(&format!("- Why: {}\n", escape_markdown(note)));
        }
        output.push('\n');
    }
    output
}

pub fn parse_mapping(value: &str) -> Result<(String, String)> {
    let (editor, profile) = value.split_once('=').ok_or_else(|| {
        RecipeError::Invalid(format!(
            "invalid editor profile '{value}'; expected EDITOR=PROFILE"
        ))
    })?;
    let editor = editor.trim().to_ascii_lowercase();
    let profile = profile.trim().to_string();
    if editor.is_empty() || profile.is_empty() {
        return Err(RecipeError::Invalid(format!(
            "invalid editor profile '{value}'; editor and profile must be non-empty"
        )));
    }
    Ok((editor, profile))
}

fn ensure_folder(folder: &Path) -> Result<()> {
    if !folder.exists() {
        return Err(RecipeError::Invalid(format!(
            "folder does not exist: {}",
            folder.display()
        )));
    }
    if !folder.is_dir() {
        return Err(RecipeError::Invalid(format!(
            "expected a folder, got: {}",
            folder.display()
        )));
    }
    Ok(())
}

fn nearest_manifest(folder: &Path) -> Option<(PathBuf, usize)> {
    folder
        .ancestors()
        .enumerate()
        .map(|(levels, ancestor)| (ancestor.join(MANIFEST_NAME), levels))
        .find(|(candidate, _)| candidate.is_file())
}

fn is_raw(extension: &str) -> bool {
    matches!(
        extension,
        "3fr"
            | "arw"
            | "cr2"
            | "cr3"
            | "dng"
            | "erf"
            | "fff"
            | "iiq"
            | "kdc"
            | "mef"
            | "mos"
            | "mrw"
            | "nef"
            | "nrw"
            | "orf"
            | "pef"
            | "raf"
            | "raw"
            | "rw2"
            | "rwl"
            | "sr2"
            | "srf"
            | "srw"
            | "x3f"
    )
}

fn escape_markdown(value: &str) -> String {
    value.replace('`', "'").replace(['\r', '\n'], " ")
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;

    fn recipe() -> Manifest {
        Manifest {
            schema_version: 1,
            name: "Portraits".into(),
            recommended_editor: "rawtherapee".into(),
            editor_mappings: BTreeMap::from([
                ("darktable".into(), "Portrait neutral".into()),
                ("rawtherapee".into(), "Portrait neutral v3".into()),
            ]),
            heuristics: Heuristics {
                extensions: vec!["raf".into()],
                ..Heuristics::default()
            },
            note: Some("Protect skin tones".into()),
            created_with: "folder-recipe 0.1.0".into(),
        }
    }

    #[test]
    fn writes_and_inherits_manifest_without_touching_photos() {
        let temp = tempdir().unwrap();
        let child = temp.path().join("selects");
        fs::create_dir(&child).unwrap();
        let photo = child.join("frame.raf");
        fs::write(&photo, b"raw bytes").unwrap();
        write_manifest(temp.path(), &recipe(), false).unwrap();

        let result = inspect_folder(&child).unwrap();
        assert!(result.inherited);
        assert_eq!(result.inherited_levels, 1);
        assert_eq!(
            result.recipe.editor_mappings["rawtherapee"],
            "Portrait neutral v3"
        );
        assert_eq!(fs::read(photo).unwrap(), b"raw bytes");
    }

    #[test]
    fn refuses_overwrite_without_force() {
        let temp = tempdir().unwrap();
        write_manifest(temp.path(), &recipe(), false).unwrap();
        let error = write_manifest(temp.path(), &recipe(), false).unwrap_err();
        assert!(error.to_string().contains("--force"));
    }

    #[test]
    fn checklist_is_stable_and_explicit() {
        let temp = tempdir().unwrap();
        let a = temp.path().join("a");
        let b = temp.path().join("b");
        fs::create_dir_all(&a).unwrap();
        fs::create_dir_all(&b).unwrap();
        write_manifest(&b, &recipe(), false).unwrap();
        write_manifest(&a, &recipe(), false).unwrap();
        let items = discover_checklist(temp.path()).unwrap();
        assert_eq!(items[0].folder, PathBuf::from("a"));
        assert!(checklist_markdown(temp.path(), &items).contains("Portrait neutral v3"));
    }

    #[test]
    fn validates_recommended_mapping() {
        let mut invalid = recipe();
        invalid.recommended_editor = "missing".into();
        assert!(invalid
            .validate()
            .unwrap_err()
            .to_string()
            .contains("no saved profile"));
    }
}
