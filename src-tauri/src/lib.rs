use tauri::Manager;
use tauri_plugin_shell::ShellExt;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!\n", name)
}

#[cfg(target_os = "macos")]
#[tauri::command]
async fn pick_color(app: tauri::AppHandle) -> Result<String, String> {
    use objc2_app_kit::{NSColorSampler, NSColor};
    use std::sync::mpsc;

    let (tx, rx) = mpsc::channel();

    app.run_on_main_thread(move || {
        let sampler = unsafe { NSColorSampler::new() };
        let block = block2::RcBlock::new(move |color: *mut NSColor| {
            let result = if color.is_null() {
                None
            } else {
                unsafe {
                    let c = &*color;
                    let r = (c.redComponent() * 255.0) as u8;
                    let g = (c.greenComponent() * 255.0) as u8;
                    let b = (c.blueComponent() * 255.0) as u8;
                    Some(format!("#{:02X}{:02X}{:02X}", r, g, b))
                }
            };
            let _ = tx.send(result);
        });
        unsafe {
            sampler.showSamplerWithSelectionHandler(&block);
        }
    }).map_err(|e| e.to_string())?;

    match rx.recv().map_err(|e: std::sync::mpsc::RecvError| e.to_string())? {
        Some(hex) => Ok(hex),
        None => Err("cancelled".into()),
    }
}

#[cfg(not(target_os = "macos"))]
#[tauri::command]
async fn pick_color(_app: tauri::AppHandle) -> Result<String, String> {
    Err("Not supported on this platform".into())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![greet, pick_color])
        .setup(|app| {
            let shell = app.shell();

            // Obtener la ruta al bundle del servidor
            let resource_dir = app
                .path()
                .resource_dir()
                .expect("Failed to get resource dir");
            let server_bundle = resource_dir.join("theme-sync-server/dist/theme-sync-server.cjs");

            println!("[theme-sync] Server bundle: {:?}", server_bundle);

            // Iniciar theme-sync-server usando el sidecar de node
            shell
                .sidecar("node")
                .expect("Failed to create sidecar")
                .args([server_bundle.to_str().unwrap()])
                .spawn()
                .expect("Failed to start theme-sync-server");

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
