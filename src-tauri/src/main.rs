// src-tauri/src/main.rs
use tauri::Manager;
use tauri_plugin_shell::ShellExt;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let shell = app.shell();

            // Obtener la ruta al bundle del servidor
            let resource_dir = app.path().resource_dir().expect("Failed to get resource dir");
            let server_bundle = resource_dir.join("theme-sync-server/dist/theme-sync-server.cjs");

            println!("[theme-sync] Server bundle: {:?}", server_bundle);

            // Iniciar theme-sync-server al arrancar
            shell
                .command("node")
                .args([server_bundle.to_str().unwrap()])
                .spawn()
                .expect("Failed to start theme-sync-server");

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
