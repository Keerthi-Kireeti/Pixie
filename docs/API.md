# API Reference - Pixie Backend

Complete documentation of all FastAPI endpoints.

Base URL: `http://localhost:8000`

---

## Health Check

### GET `/api/health`

Check system health and dependency status.

**Response:**
```json
{
  "status": "ok",
  "backend": true,
  "ollama": true,
  "database": true
}
```

---

## Chat

### POST `/api/chat`

Send a message to Pixie and get AI response.

**Request:**
```json
{
  "message": "What's the weather today?",
  "conversation_id": null
}
```

**Response:**
```json
{
  "response": "I don't have access to real-time weather data, but you can check weather.com!",
  "conversation_id": "1",
  "thinking_time": 2.34
}
```

**Error:**
```json
{
  "detail": "Ollama error: Connection refused"
}
```

---

### POST `/api/chat/reset`

Reset current conversation and start fresh.

**Response:**
```json
{
  "status": "reset"
}
```

---

## Memory

### GET `/api/memory/history`

Get conversation history.

**Query Parameters:**
- `conversation_id` (int, required): Conversation ID
- `limit` (int, optional): Max messages to return (default: 20)

**Response:**
```json
{
  "conversation_id": 1,
  "messages": [
    {
      "role": "user",
      "content": "Hello Pixie",
      "timestamp": "2024-01-15 10:30:00"
    },
    {
      "role": "assistant",
      "content": "Hey there! How can I help?",
      "timestamp": "2024-01-15 10:30:05"
    }
  ],
  "count": 2
}
```

---

### POST `/api/memory/preferences`

Save a user preference.

**Query Parameters:**
- `key` (string, required): Preference key
- `value` (string, required): Preference value

**Response:**
```json
{
  "status": "saved",
  "key": "theme"
}
```

---

### GET `/api/memory/preferences/{key}`

Get a user preference.

**Path Parameters:**
- `key` (string): Preference key

**Response:**
```json
{
  "key": "theme",
  "value": "dark"
}
```

---

## Reminders

### GET `/api/reminders`

List all active reminders.

**Query Parameters:**
- `include_completed` (boolean, optional): Include completed reminders

**Response:**
```json
[
  {
    "id": 1,
    "title": "Team meeting",
    "description": "Weekly sync",
    "scheduled_time": "2024-01-15 14:00:00",
    "created_at": "2024-01-15 09:00:00",
    "is_completed": false
  }
]
```

---

### POST `/api/reminders`

Create a new reminder.

**Request:**
```json
{
  "title": "Doctor appointment",
  "description": "Annual checkup at 3 PM",
  "scheduled_time": "2024-01-20 15:00:00"
}
```

**Response:**
```json
{
  "id": 5,
  "title": "Doctor appointment",
  "description": "Annual checkup at 3 PM",
  "scheduled_time": "2024-01-20 15:00:00",
  "created_at": "2024-01-15 10:30:00",
  "is_completed": false
}
```

---

### PUT `/api/reminders/{id}`

Mark reminder as completed.

**Path Parameters:**
- `id` (int): Reminder ID

**Query Parameters:**
- `is_completed` (boolean): Completion status

**Response:**
```json
{
  "status": "updated",
  "id": 5
}
```

---

### DELETE `/api/reminders/{id}`

Archive/delete a reminder.

**Path Parameters:**
- `id` (int): Reminder ID

**Response:**
```json
{
  "status": "archived",
  "id": 5
}
```

---

## Commands

### POST `/api/commands/open/browser`

Open URL in default browser.

**Query Parameters:**
- `url` (string): URL to open

**Response:**
```json
{
  "status": "opened",
  "url": "https://github.com"
}
```

---

### POST `/api/commands/open/app`

Open application by name or path.

**Query Parameters:**
- `app_name` (string): Application name or path

**Response:**
```json
{
  "status": "opened",
  "app": "notepad"
}
```

---

### POST `/api/commands/open/folder`

Open folder in file explorer.

**Query Parameters:**
- `path` (string): Folder path

**Response:**
```json
{
  "status": "opened",
  "path": "C:\\Users\\Documents"
}
```

---

### POST `/api/commands/screenshot`

Take a screenshot of the desktop.

**Query Parameters:**
- `save_path` (string, optional): Where to save screenshot

**Response:**
```json
{
  "status": "captured",
  "path": "./data/screenshot.png"
}
```

---

## Error Handling

All errors follow this format:

```json
{
  "detail": "Error message describing what went wrong"
}
```

### Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad request (invalid parameters) |
| 404 | Not found (resource doesn't exist) |
| 500 | Server error |
| 503 | Service unavailable (Ollama not responding) |

---

## Rate Limiting

**Current:** No rate limiting (add in Phase 2 if needed)

Recommended for production:
- 10 requests/second per client
- 100 messages/day per user

---

## Authentication

**Current:** None (localhost only via CORS)

For production deployment:
- Implement JWT tokens
- Add API key authentication
- Secure with HTTPS

---

## Examples

### Complete Chat Flow

```bash
# 1. Check system health
curl http://localhost:8000/api/health

# 2. Send message
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello Pixie!"}'

# 3. Get conversation history
curl "http://localhost:8000/api/memory/history?conversation_id=1"

# 4. Create reminder
curl -X POST "http://localhost:8000/api/reminders" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Lunch break",
    "scheduled_time": "2024-01-15 12:00:00"
  }'

# 5. Open browser
curl -X POST "http://localhost:8000/api/commands/open/browser?url=https://github.com"
```

### Using Python requests

```python
import requests

BASE_URL = "http://localhost:8000"

# Check health
response = requests.get(f"{BASE_URL}/api/health")
print(response.json())

# Send message
response = requests.post(
    f"{BASE_URL}/api/chat",
    json={"message": "What time is it?"}
)
print(response.json())

# Create reminder
response = requests.post(
    f"{BASE_URL}/api/reminders",
    json={
        "title": "Remember to hydrate",
        "scheduled_time": "2024-01-15 15:00:00"
    }
)
print(response.json())
```

---

## WebSocket (Future)

For real-time updates, Phase 2 will add WebSocket support:

```python
@app.websocket("/ws/pixie")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    # Handle real-time messages
```

---

**API Documentation - Last Updated: 2024-01-15**
