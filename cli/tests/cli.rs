use std::fs;
use std::process::Command;
use tempfile::tempdir;

fn binary() -> Command {
    Command::new(env!("CARGO_BIN_EXE_folder-recipe"))
}

#[test]
fn documented_init_inspect_and_checklist_workflow() {
    let temp = tempdir().unwrap();
    let shoot = temp.path().join("shoot");
    let selects = shoot.join("selects");
    fs::create_dir_all(&selects).unwrap();
    fs::write(shoot.join("frame.raf"), b"raw").unwrap();

    let init = binary()
        .args([
            "init",
            shoot.to_str().unwrap(),
            "--name",
            "August portraits",
            "--map",
            "rawtherapee=Portrait neutral v3",
            "--map",
            "darktable=Portrait neutral",
            "--recommend",
            "rawtherapee",
            "--camera",
            "Fujifilm X-T5",
            "--note",
            "Protect warm skin tones",
        ])
        .output()
        .unwrap();
    assert!(
        init.status.success(),
        "{}",
        String::from_utf8_lossy(&init.stderr)
    );

    let inspect = binary()
        .args(["inspect", selects.to_str().unwrap(), "--json"])
        .output()
        .unwrap();
    assert!(inspect.status.success());
    let inspection: serde_json::Value = serde_json::from_slice(&inspect.stdout).unwrap();
    assert_eq!(inspection["inherited"], true);
    assert_eq!(inspection["recipe"]["recommended_editor"], "rawtherapee");

    let checklist = binary()
        .args(["checklist", temp.path().to_str().unwrap()])
        .output()
        .unwrap();
    let output = String::from_utf8(checklist.stdout).unwrap();
    assert!(output.contains("Portrait neutral v3"));
    assert!(output.contains("Protect warm skin tones"));
}

#[test]
fn invalid_manifest_is_script_friendly() {
    let temp = tempdir().unwrap();
    fs::write(temp.path().join(".photo-recipe.json"), "{not json").unwrap();
    let result = binary()
        .args(["inspect", temp.path().to_str().unwrap(), "--json"])
        .output()
        .unwrap();
    assert_eq!(result.status.code(), Some(2));
    assert!(String::from_utf8_lossy(&result.stderr).contains("invalid manifest JSON"));
}
