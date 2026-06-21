// Prevents additional console window on Windows in release, MUST be before match
#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]

use std::process::Command;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            pixie_chat,
            pixie_reminder,
            pixie_command,
            pixie_status
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// Tauri Commands (IPC endpoints)
// These commands are invoked from the frontend via invoke()

#[tauri::command]
async fn pixie_chat(message: String) -> Result<String, String> {
    // This will be forwarded to the Python backend
    println!("Chat message received: {}", message);
    
    // Make HTTP request to Python backend
    match reqwest::Client::new()
        .post("http://localhost:8000/api/chat")
        .json(&serde_json::json!({ "message": message }))
        .send()
        .await
    {
        Ok(response) => {
            match response.json::<serde_json::Value>().await {
                Ok(data) => Ok(data.to_string()),
                Err(e) => Err(format!("Failed to parse response: {}", e)),
            }
        }
        Err(e) => Err(format!("Failed to reach backend: {}", e)),
    }
}

#[tauri::command]
async fn pixie_reminder(title: String, time: String) -> Result<String, String> {
    // Forward to Python backend
    match reqwest::Client::new()
        .post("http://localhost:8000/api/reminders")
        .json(&serde_json::json!({ "title": title, "time": time }))
        .send()
        .await
    {
        Ok(_) => Ok("Reminder saved!".to_string()),
        Err(e) => Err(format!("Failed to save reminder: {}", e)),
    }
}

#[tauri::command]
async fn pixie_command(command: String) -> Result<String, String> {
    // Execute system command
    match Command::new("powershell")
        .args(&["-NoProfile", "-Command", &command])
        .output()
    {
        Ok(output) => {
            let stdout = String::from_utf8_lossy(&output.stdout);
            Ok(stdout.to_string())
        }
        Err(e) => Err(format!("Failed to execute command: {}", e)),
    }
}

#[tauri::command]
async fn pixie_status() -> Result<serde_json::Value, String> {
    // Check if backend is reachable
    match reqwest::Client::new()
        .get("http://localhost:8000/api/health")
        .send()
        .await
    {
        Ok(_) => Ok(serde_json::json!({ "status": "ok", "backend": true })),
        Err(_) => Ok(serde_json::json!({ "status": "warning", "backend": false })),
    }
}
