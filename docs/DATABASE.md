# Database Schema - Pixie Desktop AI Companion

## Overview

Pixie uses SQLite for data persistence. The database stores:
- Conversation history
- User messages and AI responses
- Reminders and scheduling
- User preferences
- System state

All data is stored in a single `pixie.db` file located at `./data/pixie.db`.

---

## Tables

### 1. Conversations

Stores conversation sessions.

```sql
CREATE TABLE conversations (
    id INTEGER PRIMARY KEY,
    session_id TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata TEXT
);
```

**Fields:**
- `id`: Unique conversation identifier
- `session_id`: UUID for session tracking
- `created_at`: When conversation started
- `updated_at`: Last activity timestamp
- `metadata`: JSON data (future use)

**Example:**
```json
{
  "id": 1,
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "created_at": "2024-01-15 10:30:00",
  "updated_at": "2024-01-15 10:45:00",
  "metadata": null
}
```

---

### 2. Messages

Stores individual messages in conversations.

```sql
CREATE TABLE messages (
    id INTEGER PRIMARY KEY,
    conversation_id INTEGER NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tokens_used INTEGER,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id)
);
```

**Fields:**
- `id`: Message identifier
- `conversation_id`: FK to conversations
- `role`: 'user' or 'assistant'
- `content`: Message text
- `timestamp`: When message was created
- `tokens_used`: LLM token count (optional)

**Example:**
```json
{
  "id": 1,
  "conversation_id": 1,
  "role": "user",
  "content": "What's the weather today?",
  "timestamp": "2024-01-15 10:30:00",
  "tokens_used": 5
}
```

---

### 3. Reminders

Stores user reminders and notifications.

```sql
CREATE TABLE reminders (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    scheduled_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_completed BOOLEAN DEFAULT 0,
    is_archived BOOLEAN DEFAULT 0
);
```

**Fields:**
- `id`: Reminder identifier
- `title`: Reminder title
- `description`: Optional detailed description
- `scheduled_time`: When reminder should trigger
- `created_at`: When reminder was created
- `is_completed`: Whether reminder was completed
- `is_archived`: Whether reminder is archived

**Example:**
```json
{
  "id": 1,
  "title": "Team meeting",
  "description": "Weekly sync with the team",
  "scheduled_time": "2024-01-15 14:00:00",
  "created_at": "2024-01-15 09:00:00",
  "is_completed": false,
  "is_archived": false
}
```

---

### 4. User Preferences

Stores user settings and preferences.

```sql
CREATE TABLE user_preferences (
    id INTEGER PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**
- `id`: Record identifier
- `key`: Preference key
- `value`: Preference value (JSON allowed)
- `updated_at`: Last modified timestamp

**Example Preferences:**
```json
{
  "theme": "dark",
  "language": "en",
  "notifications_enabled": "true",
  "ollama_model": "mistral",
  "personality": "playful"
}
```

---

### 5. System State

Tracks system-level state.

```sql
CREATE TABLE system_state (
    id INTEGER PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**
- `id`: Record identifier
- `key`: State key
- `value`: State value
- `updated_at`: Last update timestamp

**Example States:**
```json
{
  "last_ollama_check": "2024-01-15 10:45:00",
  "db_version": "1.0.0",
  "app_version": "0.1.0"
}
```

---

## Relationships

```
conversations (1) ──── (many) messages
      │
      └─ Stored conversations with unique session IDs
         
reminders ── Independent scheduling system

user_preferences ── Global user settings

system_state ── Global app state
```

---

## Indexes

For performance, create indexes on frequently queried columns:

```sql
-- Find messages by conversation
CREATE INDEX idx_messages_conversation_id 
ON messages(conversation_id);

-- Sort by timestamp
CREATE INDEX idx_messages_timestamp 
ON messages(timestamp DESC);

-- Find reminders by time
CREATE INDEX idx_reminders_scheduled_time 
ON reminders(scheduled_time);

-- Quick preference lookups
CREATE INDEX idx_user_preferences_key 
ON user_preferences(key);
```

---

## Data Lifecycle

### Conversation Flow
1. **Create**: New conversation session created with UUID
2. **Store**: User and assistant messages saved with timestamps
3. **Query**: Get recent history for LLM context (last 5-10 messages)
4. **Archive**: Old conversations remain in database (soft delete via preference)

### Reminder Flow
1. **Create**: User creates reminder with title and scheduled time
2. **Store**: Saved in reminders table
3. **Trigger**: Backend scheduler checks for due reminders
4. **Complete**: User marks reminder as done
5. **Archive**: Completed reminders moved to archive

### Preferences Flow
1. **Save**: User preference set via key-value pairs
2. **Query**: Load on app startup
3. **Update**: Modify existing preference
4. **Sync**: Backend returns to frontend when needed

---

## Backup & Recovery

### Backup Strategy
```bash
# Backup database daily
cp ./data/pixie.db ./data/backups/pixie_$(date +%Y%m%d).db

# Keep last 30 days of backups
find ./data/backups -name "*.db" -mtime +30 -delete
```

### Recovery
```bash
# Restore from backup
cp ./data/backups/pixie_20240115.db ./data/pixie.db

# Or rebuild from scratch
python -c "from backend.memory.store import MemoryStore; MemoryStore('./data/pixie.db')"
```

---

## Migration Strategy (Phase 2)

For future schema changes:

```python
# Use Alembic for migrations
alembic init migrations
alembic revision --autogenerate -m "Add new column"
alembic upgrade head
```

---

## Query Examples

### Get Recent Messages
```sql
SELECT * FROM messages 
WHERE conversation_id = 1 
ORDER BY timestamp DESC 
LIMIT 10;
```

### Find Upcoming Reminders
```sql
SELECT * FROM reminders 
WHERE scheduled_time > CURRENT_TIMESTAMP 
AND is_completed = 0 
AND is_archived = 0
ORDER BY scheduled_time ASC;
```

### Get User Preference
```sql
SELECT value FROM user_preferences 
WHERE key = 'theme';
```

### Mark Reminder Complete
```sql
UPDATE reminders 
SET is_completed = 1 
WHERE id = 5;
```

---

## Performance Considerations

**Current Limits (SQLite):**
- Up to 1 million messages per conversation
- 10,000+ reminders efficiently
- 1000+ preferences without performance impact

**Optimization Tips:**
1. Archive old conversations (soft delete)
2. Index frequently queried columns
3. Batch insert operations when possible
4. Use connection pooling for concurrent access

---

## Security

### Data Protection
- SQLite file should have restricted permissions (600)
- Consider encryption for sensitive conversations (Phase 2)
- No plaintext passwords stored

### Query Safety
- All queries use parameterized statements
- SQLAlchemy ORM prevents SQL injection
- Input validation in Pydantic models

---

## Future Enhancements (Phase 2+)

- [ ] Encryption at rest
- [ ] User accounts & multi-device sync
- [ ] Database replication
- [ ] Archival to cloud storage
- [ ] Full-text search on conversations
- [ ] Analytics dashboard

---

**Database designed for scalability while maintaining MVP simplicity.**
