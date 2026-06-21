# Pixie - Desktop AI Companion

A floating pixel-art AI companion for your desktop that brings emotion, animation, and intelligence to your daily workflow.

## Features

✨ **Floating Character**
- Always-on-top window with transparent background
- Draggable interface
- Pixel-art animated mascot

🤖 **AI-Powered Conversations**
- Local Ollama integration
- Contextual memory
- Playful personality

📝 **Memory System**
- Conversation history
- User preferences
- Reminder scheduling

🖥️ **System Integration**
- Open applications
- Browse the web
- System commands

## Tech Stack

- **Frontend**: React + TypeScript + Tauri
- **Animation**: PixiJS
- **Backend**: Python + FastAPI
- **Database**: SQLite
- **AI**: Ollama (local LLM)

## Project Structure

```
Pixie/
├── src/                      # React frontend
│   ├── components/           # React components
│   ├── services/             # API communication
│   ├── hooks/                # Custom hooks
│   ├── animations/           # PixiJS animation logic
│   ├── assets/               # Sprites and images
│   └── types/                # TypeScript types
├── backend/                  # Python backend
│   ├── api/                  # FastAPI routes
│   ├── brain/                # Ollama integration
│   ├── memory/               # Database operations
│   ├── commands/             # System commands
│   └── reminders/            # Reminder system
├── src-tauri/                # Tauri desktop framework
├── docs/                     # Documentation
└── ARCHITECTURE.md           # System architecture

```

## Prerequisites

- **Node.js** >= 18.0
- **Python** >= 3.8
- **Tauri CLI** (installed via npm)
- **Ollama** (running locally)
- **Windows 11** (MVP target)

## Quick Start

### 1. Install Dependencies

```bash
# Frontend & Tauri
npm install

# Backend
npm run backend:install
```

### 2. Start Ollama

```bash
# Start Ollama (must be running before app startup)
ollama serve
# In another terminal:
ollama pull mistral  # or your preferred model
```

### 3. Run Development Environment

```bash
# Starts frontend, backend, and Tauri dev all together
npm run dev
```

Or run them separately:

```bash
# Terminal 1: Frontend
npm run frontend:dev

# Terminal 2: Backend
npm run backend:dev

# Terminal 3: Tauri
npm run tauri:dev
```

### 4. Build for Production

```bash
npm run tauri:build
```

Output: `PixieSetup.exe` in `src-tauri/target/release/`

## Architecture Overview

See [ARCHITECTURE.md](ARCHITECTURE.md) for comprehensive design decisions, data flow, and technical specifications.

## Database Schema

See [docs/DATABASE.md](docs/DATABASE.md) for SQLite schema and migration strategy.

## API Reference

See [docs/API.md](docs/API.md) for all backend endpoints.

## Configuration

### Backend Configuration

Create `backend/config/.env`:

```env
# Ollama
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=mistral

# Backend
BACKEND_HOST=127.0.0.1
BACKEND_PORT=8000

# Database
DATABASE_PATH=./data/pixie.db
```

### Tauri Configuration

See `src-tauri/tauri.conf.json` for window settings, permissions, and more.

## Development Guide

### Adding a New Component

1. Create component in `src/components/`
2. Export from `src/components/index.ts`
3. Import and use in pages

### Adding a New API Endpoint

1. Create route in `backend/api/`
2. Add handler function
3. Define Pydantic model in `backend/models/`
4. Call from frontend via `invoke()` command

### Adding a New Animation State

1. Add sprite frames to `src/assets/sprites/{state}/`
2. Define animation config in `src/animations/`
3. Update animation state machine
4. Trigger from React component

## Production Deployment

1. **Code Optimization**
   - Run `npm run build` to minify frontend
   - Bundle Python backend with PyInstaller

2. **Testing**
   - Test on Windows 11
   - Verify Ollama connectivity
   - Check database migrations

3. **Distribution**
   - Publish `PixieSetup.exe` 
   - Create installer with WiX (optional)
   - Provide update mechanism

## Known Limitations (MVP)

- Windows 11 only (Phase 2: macOS, Linux)
- Single-user system
- Local Ollama required
- No voice interaction yet
- No calendar integration yet

## Roadmap

**Phase 2**
- Multi-agent system
- Voice interaction
- Calendar integration
- Advanced personality system

**Phase 3**
- Cross-platform support
- Cloud sync
- Customizable appearance
- Community plugins

## Troubleshooting

### "Could not connect to Ollama"
- Ensure Ollama is running: `ollama serve`
- Check `OLLAMA_HOST` matches in config
- Default: `http://localhost:11434`

### Frontend not loading
- Clear Vite cache: `rm -rf dist/`
- Restart dev server: `npm run frontend:dev`

### Tauri window issues
- Check permissions in `tauri.conf.json`
- Ensure window is allowed to be always-on-top

### Database locked error
- Close any other instances of Pixie
- Check database isn't corrupted: `sqlite3 data/pixie.db`

## Contributing

Follow the architecture guidelines in `ARCHITECTURE.md` when adding features.

## License

MIT

## Support

For issues, feature requests, or questions, please refer to the documentation in `/docs`.

---

**Pixie: Your friendly AI companion, always by your side.** ✨
