use tauri::Manager;
use tauri_plugin_shell::ShellExt;
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!\n", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .invoke_handler(tauri::generate_handler![greet])
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
