// Prevents additional console window on Windows in release, MUST be before match
#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct ChatApiResponse {
    response: String,
    conversation_id: String,
    thinking_time: f64,
}

#[derive(Serialize)]
struct ChatResult {
    success: bool,
    data: Option<ChatApiResponse>,
    error: Option<String>,
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            pixie_chat,
            pixie_reminder,
            pixie_status
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// Tauri Commands (IPC endpoints)
// These commands are invoked from the frontend via invoke()

#[tauri::command]
async fn pixie_chat(message: String) -> Result<ChatResult, String> {
    println!("Chat message received: {}", message);

    match reqwest::Client::new()
        .post("http://localhost:8000/api/chat")
        .json(&serde_json::json!({ "message": message }))
        .send()
        .await
    {
        Ok(response) => {
            if response.status().is_success() {
                match response.json::<ChatApiResponse>().await {
                    Ok(data) => Ok(ChatResult {
                        success: true,
                        data: Some(data),
                        error: None,
                    }),
                    Err(e) => Ok(ChatResult {
                        success: false,
                        data: None,
                        error: Some(format!("Failed to parse response: {}", e)),
                    }),
                }
            } else {
                let status = response.status();
                let body = response.text().await.unwrap_or_default();
                Ok(ChatResult {
                    success: false,
                    data: None,
                    error: Some(format!("Backend error {}: {}", status, body)),
                })
            }
        }
        Err(e) => Ok(ChatResult {
            success: false,
            data: None,
            error: Some(format!("Failed to reach backend: {}", e)),
        }),
    }
}

#[tauri::command]
async fn pixie_reminder(title: String, description: Option<String>, scheduled_time: String) -> Result<String, String> {
    match reqwest::Client::new()
        .post("http://localhost:8000/api/reminders")
        .json(&serde_json::json!({
            "title": title,
            "description": description.unwrap_or_default(),
            "scheduled_time": scheduled_time
        }))
        .send()
        .await
    {
        Ok(response) => {
            if response.status().is_success() {
                Ok("Reminder saved!".to_string())
            } else {
                Err(format!("Backend error: {}", response.status()))
            }
        }
        Err(e) => Err(format!("Failed to save reminder: {}", e)),
    }
}

#[tauri::command]
async fn pixie_status() -> Result<serde_json::Value, String> {
    match reqwest::Client::new()
        .get("http://localhost:8000/api/health")
        .send()
        .await
    {
        Ok(response) => {
            match response.json::<serde_json::Value>().await {
                Ok(data) => Ok(data),
                Err(_) => Ok(serde_json::json!({ "status": "warning", "backend": true, "ollama": false, "database": false })),
            }
        }
        Err(_) => Ok(serde_json::json!({ "status": "error", "backend": false, "ollama": false, "database": false })),
    }
}
