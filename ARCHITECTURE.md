# Pixie Desktop AI Companion - Architecture Document

## PROJECT OVERVIEW

Pixie is a floating desktop AI companion that combines:
- **Pixel-art character animation** via PixiJS
- **Conversational AI** via Ollama
- **Desktop integration** via Tauri
- **Memory & persistence** via SQLite
- **System control** via Python backend

## ARCHITECTURAL PRINCIPLES

### 1. **Separation of Concerns**
- **Frontend (React + PixiJS)**: UI, animations, user interaction
- **Backend (Python)**: AI, memory, system commands, database
- **Desktop Bridge (Tauri)**: IPC, file system access, native features

### 2. **Communication Pattern: Command-Response**
```
User Action → React Component
    ↓
Tauri Invoke (Frontend → Backend)
    ↓
Python Backend Processing
    ↓
Database Operations (SQLite)
    ↓
Response Back to React
    ↓
Update UI + Trigger Animation
```

### 3. **State Management Strategy**
- **React Context API**: Global UI state (animation state, chat messages)
- **Custom Hooks**: Reusable logic for Ollama calls, memory access
- **Tauri Commands**: Async operations via promises
- **Python State**: Backend maintains conversation context, user preferences

### 4. **Database Design Philosophy**
- **Minimal schema**: Start lean, add complexity only when needed
- **Migrations-ready**: Support schema evolution
- **Normalized tables**: Separate concerns (conversations, reminders, preferences)
- **Soft deletes**: Archive rather than delete for audit trail

---

## SYSTEM ARCHITECTURE

### High-Level Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     PIXIE DESKTOP APPLICATION                    │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐         ┌──────────────────────────┐
│   FRONTEND (React)        │         │  TAURI BRIDGE            │
│                           │         │                          │
│ - Components              │────────→│ - IPC Handler            │
│ - State Management        │←────────│ - File System Access     │
│ - PixiJS Animation        │         │ - Native Features        │
│ - Chat UI                 │         │ - Subprocess Management  │
└──────────────────────────┘         └──────────────────────────┘
         ↑                                     ↓
         │                    HTTP Request
         └────────────────────────────────────┘
                              ↓
         ┌──────────────────────────────────────────┐
         │    PYTHON BACKEND (FastAPI)             │
         │                                          │
         │  ┌────────────────────────────────────┐ │
         │  │  Brain Module (Ollama Integration) │ │
         │  │  - Prompt processing               │ │
         │  │  - Context management              │ │
         │  │  - Response generation             │ │
         │  └────────────────────────────────────┘ │
         │                                          │
         │  ┌────────────────────────────────────┐ │
         │  │  Memory Module (SQLite)            │ │
         │  │  - Conversation storage            │ │
         │  │  - User preferences                │ │
         │  │  - Reminder system                 │ │
         │  └────────────────────────────────────┘ │
         │                                          │
         │  ┌────────────────────────────────────┐ │
         │  │  Commands Module (System Control)  │ │
         │  │  - Open browser/app/folder         │ │
         │  │  - Screenshot capture              │ │
         │  │  - Clipboard operations            │ │
         │  └────────────────────────────────────┘ │
         │                                          │
         │  ┌────────────────────────────────────┐ │
         │  │  Reminders Module                  │ │
         │  │  - Trigger notifications           │ │
         │  │  - Schedule management             │ │
         │  └────────────────────────────────────┘ │
         │                                          │
         └──────────────────────────────────────────┘
                              ↓
         ┌──────────────────────────────────────────┐
         │         EXTERNAL SERVICES                │
         │                                          │
         │  ┌─ Ollama (Local LLM)                 │
         │  │                                      │
         │  └─ System APIs (Windows 11)            │
         └──────────────────────────────────────────┘
```

---

## TECHNOLOGY RATIONALE

### Why Tauri?
- **Lightweight**: Smaller bundle size than Electron
- **Rust-based**: Performance and security
- **Native OS features**: Direct access to filesystem, notifications
- **Web stack friendly**: React integration seamless
- **Cross-platform**: Windows, macOS, Linux support

### Why React?
- **Component-based**: Modular UI architecture
- **State management**: Easy to track Pixie's animation state
- **Ecosystem**: Rich library for UI components
- **Developer experience**: Fast development cycle

### Why PixiJS?
- **2D rendering**: Optimized for pixel art
- **Performance**: WebGL acceleration
- **Animation**: Smooth sprite animation system
- **Lightweight**: Lower overhead than Three.js

### Why Python Backend?
- **Ollama integration**: Native Python support
- **AI/ML ecosystem**: NumPy, pandas, etc.
- **Database**: SQLAlchemy ORM for SQLite
- **System commands**: Easy OS integration
- **Async support**: FastAPI for concurrent requests

### Why SQLite?
- **Zero configuration**: File-based database
- **Portable**: Single database file
- **Sufficient for MVP**: Scales to millions of rows
- **Query language**: Full SQL support
- **No server needed**: Lightweight deployment

---

## COMPONENT ARCHITECTURE

### Frontend Components Tree
```
App (Root)
├── PixieWindow (Tauri window management)
│   ├── PixieCharacter (PixiJS canvas)
│   │   ├── SpriteController
│   │   └── AnimationManager
│   ├── ChatBubble (Conditional)
│   │   ├── ChatHistory
│   │   └── InputField
│   └── Notifications (Reminders, alerts)
└── AnimationStateProvider (Context)
```

### Backend API Structure
```
FastAPI Application
├── Routes
│   ├── /api/chat (POST) - Process user message
│   ├── /api/memory (GET/POST) - Conversation history
│   ├── /api/reminders (GET/POST/DELETE)
│   ├── /api/commands (POST) - System commands
│   └── /api/health (GET) - Health check
├── Services
│   ├── brain.py - Ollama wrapper
│   ├── memory.py - Database operations
│   ├── commands.py - System control
│   └── reminders.py - Reminder logic
└── Models
    ├── schemas.py - Request/response models
    └── database.py - SQLAlchemy models
```

---

## DATABASE SCHEMA

### Tables Overview
```sql
-- Conversations
CREATE TABLE conversations (
    id INTEGER PRIMARY KEY,
    session_id TEXT UNIQUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    metadata JSON
);

-- Messages
CREATE TABLE messages (
    id INTEGER PRIMARY KEY,
    conversation_id INTEGER FOREIGN KEY,
    role TEXT, -- 'user' or 'assistant'
    content TEXT,
    timestamp TIMESTAMP,
    tokens_used INTEGER
);

-- Reminders
CREATE TABLE reminders (
    id INTEGER PRIMARY KEY,
    title TEXT,
    description TEXT,
    scheduled_time TIMESTAMP,
    created_at TIMESTAMP,
    is_completed BOOLEAN,
    is_archived BOOLEAN
);

-- User Preferences
CREATE TABLE user_preferences (
    id INTEGER PRIMARY KEY,
    key TEXT UNIQUE,
    value TEXT,
    updated_at TIMESTAMP
);

-- System State
CREATE TABLE system_state (
    id INTEGER PRIMARY KEY,
    key TEXT UNIQUE,
    value TEXT,
    updated_at TIMESTAMP
);
```

---

## IPC COMMUNICATION PROTOCOL

### Message Format (Tauri Command)
```typescript
// Frontend → Backend
interface PixieCommand {
  command: string;
  payload: Record<string, any>;
}

// Backend → Frontend
interface PixieResponse {
  success: boolean;
  data?: any;
  error?: string;
}
```

### Example: User sends message to Pixie
```
1. User types in chat → clicks send
2. React component calls: invoke('pixie_chat', { message: '...' })
3. Tauri forwards to Python backend
4. Backend calls Ollama, saves to memory
5. Response returns to React with { success: true, data: { response: '...' } }
6. React updates chat UI + triggers animation
```

---

## ANIMATION STATE MACHINE

Pixie's emotions/states:
- **Idle**: Default state, subtle breathing animation
- **Thinking**: Head tilt, blinking
- **Happy**: Jumping, celebrating
- **Listening**: Leaning forward, attentive
- **Sleeping**: Z's floating, relaxed pose
- **Walking**: Leg movement animation

Each state has corresponding PixiJS sprite frames.

---

## SECURITY CONSIDERATIONS

### Frontend
- XSS prevention: React auto-escapes by default
- Input validation: Sanitize user messages before sending

### Backend
- CORS: Only allow localhost (Tauri frontend)
- Rate limiting: Prevent spam to Ollama
- Command whitelist: Only allow specific system commands
- Input validation: Pydantic models enforce types

### Database
- SQL injection prevention: Use SQLAlchemy ORM
- Soft deletes: Archive sensitive data
- No sensitive plaintext: Hash if needed

### Tauri Configuration
- File system scope: Limit access to specific directories
- Environment variables: Store Ollama URL securely

---

## DEPLOYMENT & PACKAGING

### Development Workflow
```
1. Frontend: npm run dev (Vite HMR)
2. Backend: python -m uvicorn api:app --reload
3. Tauri: npm run tauri dev
```

### Production Workflow
```
1. Build frontend: npm run build
2. Package backend: PyInstaller (bundle Python)
3. Build Tauri app: npm run tauri build
4. Output: PixieSetup.exe (for Windows)
```

---

## PHASE 1 MVP SCOPE

**What's included:**
- Floating window with draggable character
- Pixel-art animations (5+ states)
- Chat interface
- Ollama integration
- Basic memory (conversation history)
- Simple reminders
- System commands (open browser, folders)
- Windows 11 support

**What's NOT included (Phase 2+):**
- Multi-agent system
- Voice interaction
- Calendar integration
- Advanced emotion detection
- Custom model training

---

## PERFORMANCE TARGETS

- **App startup**: < 2 seconds
- **Ollama response**: < 5 seconds (depends on model)
- **Memory usage**: < 200 MB (running)
- **CPU usage**: < 5% (idle)
- **Animation FPS**: 60 FPS

---

## NEXT STEPS

1. Initialize Node.js project
2. Set up Tauri
3. Create React + TypeScript structure
4. Integrate PixiJS
5. Build Python backend
6. Create SQLite schema
7. Implement IPC communication
8. Build UI components
9. Integrate Ollama
10. Test end-to-end flow

---

**This architecture is designed for scalability, maintainability, and rapid iteration.**
