# PROJECT FOLDER STRUCTURE

Complete visualization of the Pixie project directory.

```
Pixie/
│
├── 📋 PROJECT DOCUMENTATION
│   ├── README.md                    # Project overview
│   ├── QUICKSTART.md                # 10-minute setup guide
│   ├── ARCHITECTURE.md              # System design & decisions
│   ├── PROJECT_SUMMARY.md           # Comprehensive summary
│   └── .gitignore                   # Git ignore rules
│
├── 🎨 FRONTEND (React + TypeScript)
│   ├── index.html                   # HTML entry point
│   ├── src/
│   │   ├── main.tsx                 # React entry point
│   │   ├── App.tsx                  # Root component
│   │   ├── App.css                  # Root styles
│   │   │
│   │   ├── components/              # React components
│   │   │   ├── PixieWindow.tsx      # Main window container
│   │   │   ├── PixieWindow.css
│   │   │   ├── PixieCharacter.tsx   # Character animation
│   │   │   ├── PixieCharacter.css
│   │   │   ├── ChatBubble.tsx       # Chat interface
│   │   │   ├── ChatBubble.css
│   │   │   └── index.ts             # Component exports
│   │   │
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useAnimationState.tsx    # Animation state
│   │   │   ├── usePixieChat.ts      # Chat API integration
│   │   │   ├── useReminders.ts      # Reminder operations
│   │   │   ├── usePixiCanvas.ts     # PixiJS canvas setup
│   │   │   └── index.ts             # Hook exports
│   │   │
│   │   ├── services/                # API services
│   │   │   └── index.ts             # Service exports (future)
│   │   │
│   │   ├── assets/                  # Static assets
│   │   │   └── sprites/             # Character animations
│   │   │       ├── idle/            # Idle breathing frames
│   │   │       ├── thinking/        # Thinking animation frames
│   │   │       ├── happy/           # Celebration frames
│   │   │       ├── listening/       # Attentive frames
│   │   │       └── sleeping/        # Sleep animation frames
│   │   │
│   │   ├── animations/              # PixiJS animation logic
│   │   │   └── index.ts             # Animation definitions
│   │   │
│   │   ├── types/                   # TypeScript definitions
│   │   │   └── index.ts             # Type exports
│   │   │
│   │   ├── utils/                   # Utility functions
│   │   │   └── index.ts             # Utility exports
│   │   │
│   │   └── styles/                  # Global styles
│   │       └── global.css           # Global CSS
│   │
│   ├── vite.config.ts               # Vite configuration
│   ├── tsconfig.json                # TypeScript config
│   └── tsconfig.node.json           # TS config for build tools
│
├── 🦀 TAURI DESKTOP (Rust)
│   └── src-tauri/
│       ├── src/
│       │   └── main.rs              # Tauri commands & IPC
│       ├── tauri.conf.json          # Window & permission config
│       ├── Cargo.toml               # Rust dependencies
│       └── target/                  # Build output (generated)
│           └── release/
│               └── PixieSetup.exe   # Final executable
│
├── 🐍 BACKEND (Python + FastAPI)
│   ├── main.py                      # FastAPI application
│   │
│   ├── api/                         # API routes
│   │   ├── __init__.py
│   │   └── routes/
│   │       ├── health.py            # Health check
│   │       ├── chat.py              # Chat endpoint
│   │       ├── memory.py            # Memory/history endpoint
│   │       ├── reminders.py         # Reminders endpoint
│   │       ├── commands.py          # System commands endpoint
│   │       └── __init__.py
│   │
│   ├── brain/                       # AI/Ollama integration
│   │   ├── ollama.py                # Ollama LLM wrapper
│   │   └── __init__.py
│   │
│   ├── memory/                      # Database operations
│   │   ├── store.py                 # SQLite abstraction
│   │   └── __init__.py
│   │
│   ├── reminders/                   # Reminder system
│   │   ├── scheduler.py             # Reminder scheduling
│   │   └── __init__.py
│   │
│   ├── commands/                    # System commands
│   │   └── __init__.py
│   │
│   ├── models/                      # Data models
│   │   ├── schemas.py               # Pydantic request/response models
│   │   ├── database.py              # SQLAlchemy ORM models
│   │   └── __init__.py
│   │
│   ├── config/                      # Configuration
│   │   ├── settings.py              # Settings management
│   │   └── __init__.py
│   │
│   ├── utils/                       # Utilities
│   │   ├── logger.py                # Logging configuration
│   │   └── __init__.py
│   │
│   ├── requirements.txt             # Python dependencies
│   └── data/
│       ├── pixie.db                 # SQLite database (created at runtime)
│       ├── pixie.log                # Application logs
│       └── backups/                 # Database backups
│
├── 📚 DOCUMENTATION
│   ├── docs/
│   │   ├── DATABASE.md              # SQLite schema & design
│   │   ├── API.md                   # REST API reference
│   │   ├── IMPLEMENTATION.md        # Step-by-step implementation guide
│   │   └── DEVELOPMENT.md           # Development workflow
│
├── ⚙️ CONFIGURATION
│   ├── package.json                 # Node.js dependencies & scripts
│   ├── .env.example                 # Environment variables template
│   ├── .env                         # Environment variables (create from .env.example)
│   └── .gitignore                   # Git ignore rules
│
└── 📦 GENERATED FILES (Not in repo)
    ├── node_modules/                # Node dependencies
    ├── venv/                        # Python virtual environment
    ├── dist/                        # Frontend build output
    └── .venv/                       # Alternative Python env
```

---

## Quick Navigation

### Frontend Files
- **Main App**: `src/App.tsx`
- **Components**: `src/components/`
- **Hooks**: `src/hooks/`
- **Styles**: `src/styles/global.css`
- **Sprites**: `src/assets/sprites/`

### Backend Files
- **Main Server**: `backend/main.py`
- **Chat API**: `backend/api/routes/chat.py`
- **Database**: `backend/memory/store.py`
- **Ollama**: `backend/brain/ollama.py`
- **Models**: `backend/models/`

### Configuration Files
- **Node Config**: `package.json`, `vite.config.ts`, `tsconfig.json`
- **Tauri Config**: `src-tauri/tauri.conf.json`
- **Rust Config**: `src-tauri/Cargo.toml`
- **Environment**: `.env` (create from `.env.example`)
- **Python Deps**: `backend/requirements.txt`

### Documentation
- **Quick Start**: `QUICKSTART.md`
- **Architecture**: `ARCHITECTURE.md`
- **Database**: `docs/DATABASE.md`
- **API**: `docs/API.md`
- **Implementation**: `docs/IMPLEMENTATION.md`
- **Development**: `docs/DEVELOPMENT.md`

---

## Directory Size Guide

Typical development directory sizes:

```
Before initialization:
├── Source code:        ~500 KB
└── Documentation:      ~300 KB
                        ────────
                        ~800 KB

After initialization:
├── Source code:        ~500 KB
├── Documentation:      ~300 KB
├── node_modules/:      ~800 MB (all npm packages)
├── venv/:              ~500 MB (Python packages)
└── .git/:              ~10 MB (version control)
                        ────────
                        ~1.3 GB
```

---

## Key File Purposes

### Frontend Layer
| File | Purpose |
|------|---------|
| `App.tsx` | Root component, initialization |
| `PixieWindow.tsx` | Main window container, drag handling |
| `PixieCharacter.tsx` | Character rendering with PixiJS |
| `ChatBubble.tsx` | Chat UI and message display |
| `useAnimationState.tsx` | Global animation state context |
| `usePixieChat.ts` | Chat API integration |

### Backend Layer
| File | Purpose |
|------|---------|
| `main.py` | FastAPI app, route setup |
| `ollama.py` | Ollama LLM integration |
| `store.py` | SQLite database operations |
| `chat.py` | Chat endpoint logic |
| `health.py` | System health check |
| `reminders.py` | Reminder CRUD operations |

### Desktop Layer
| File | Purpose |
|------|---------|
| `main.rs` | Tauri commands and IPC |
| `tauri.conf.json` | Window config, permissions |

---

## Asset Organization

### Sprites Structure
Each animation state has its own folder with individual frame PNGs:

```
sprites/
├── idle/
│   ├── frame_0.png     (64x64)
│   ├── frame_1.png
│   ├── frame_2.png
│   └── frame_3.png
├── thinking/
│   ├── frame_0.png
│   └── frame_1.png
├── happy/
│   ├── frame_0.png
│   ├── frame_1.png
│   └── frame_2.png
└── ... (listening, sleeping, walking)
```

---

## Configuration Files Quick Reference

### .env (Environment Variables)
```bash
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=mistral
BACKEND_HOST=127.0.0.1
BACKEND_PORT=8000
DATABASE_PATH=./data/pixie.db
```

### package.json (Node Scripts)
```bash
npm run dev           # All systems
npm run frontend:dev  # Frontend only
npm run backend:dev   # Backend only
npm run tauri:dev     # Desktop only
npm run tauri:build   # Build executable
```

### vite.config.ts (Build Config)
- Port: 5173
- Path aliases: @/, @components/, etc.

### tsconfig.json (TypeScript)
- Target: ES2020
- Strict mode: enabled
- Path mapping: configured

### Cargo.toml (Rust/Tauri)
- Tauri 1.5
- Feature: custom-protocol

---

## Data Flow Through Directories

### Message Flow
```
src/components/ChatBubble.tsx (input)
  ↓
src/hooks/usePixieChat.ts (API call)
  ↓
src-tauri/src/main.rs (IPC handler)
  ↓
backend/api/routes/chat.py (endpoint)
  ↓
backend/brain/ollama.py (LLM)
  ↓
backend/memory/store.py (save to DB)
  ↓
Response back up the chain
  ↓
src/components/ChatBubble.tsx (display)
```

### Animation Flow
```
src/components/ChatBubble.tsx (user action)
  ↓
src/hooks/useAnimationState.tsx (change state)
  ↓
src/components/PixieCharacter.tsx (read state)
  ↓
src/hooks/usePixiCanvas.ts (update PixiJS)
  ↓
Display new animation
```

---

## Working with the Project

### To add a new feature:
1. Create component in `src/components/`
2. Add API route in `backend/api/routes/`
3. Create database model in `backend/models/`
4. Connect them with hooks
5. Add tests and documentation

### To modify database:
1. Update schema in `backend/models/database.py`
2. Create migration (Phase 2)
3. Update `backend/memory/store.py` methods
4. Update API endpoints
5. Update documentation in `docs/DATABASE.md`

### To customize UI:
1. Edit component in `src/components/`
2. Modify CSS in component `.css` file
3. Test with `npm run frontend:dev`
4. Add to global styles if reusable

---

## Cleanup & Maintenance

### To reset workspace:
```bash
# Delete generated directories
rm -rf node_modules/ venv/ dist/

# Keep source, docs, and config
# Reinstall to get fresh start
npm install
pip install -r backend/requirements.txt
```

### To clean git history:
```bash
git log --oneline
git reflog
# Then commit clean state
```

---

This structure supports MVP development while remaining scalable for Phase 2+ features.

All files are organized by function and layer, making it easy to find and modify code.

Good structure = Happy development! 🚀
