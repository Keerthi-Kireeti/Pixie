# Pixie - Quick Start Guide

Get Pixie running in 10 minutes!

## Prerequisites

- **Windows 11** (or Windows 10)
- **Node.js** >= 18.0 (download from nodejs.org)
- **Python** >= 3.8 (download from python.org)
- **Ollama** (download from ollama.ai)
- **Git** (optional, for version control)

## Installation (5 minutes)

### 1. Install Ollama

1. Download Ollama from https://ollama.ai
2. Run the installer
3. Start Ollama service
4. Download a model:

```bash
ollama pull mistral
```

5. Verify it's running by visiting: http://localhost:11434/api/tags

### 2. Install Node & Python Dependencies

```bash
cd g:\Pixie

# Install Node packages
npm install

# Activate Python environment
python -m venv venv
.\venv\Scripts\activate

# Install Python packages
npm run backend:install
```

### 3. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` if needed (defaults should work fine)

## Running Pixie (5 minutes)

Open 3 terminals in the Pixie folder:

**Terminal 1 - Frontend:**
```bash
npm run frontend:dev
```

**Terminal 2 - Backend:**
```bash
npm run backend:dev
```

**Terminal 3 - Tauri Desktop:**
```bash
npm run tauri:dev
```

You should see:
- ✅ Vite dev server at http://localhost:5173
- ✅ FastAPI server at http://localhost:8000
- ✅ Pixie floating window on your desktop

## Testing Pixie

1. **Pixie appears on desktop** ✨
   - Floating window with pink character
   - Window is draggable

2. **Chat with Pixie** 💬
   - Click the chat bubble button
   - Type: "Hello Pixie!"
   - Click send
   - Should receive AI response in 2-5 seconds

3. **Try commands:**
   - "Open Chrome"
   - "What time is it?"
   - "Set a reminder for lunch"

## Troubleshooting

### Issue: "Cannot connect to Ollama"

**Fix:**
```bash
# Make sure Ollama is running
ollama serve

# Download a model if needed
ollama pull mistral

# Check it's accessible
curl http://localhost:11434/api/tags
```

### Issue: "Port already in use"

**Fix:**
```bash
# Change ports in package.json or .env
# Or kill existing process
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Issue: "Frontend not loading"

**Fix:**
```bash
# Clear cache
rm -r dist/ node_modules/.vite

# Restart Vite
npm run frontend:dev
```

### Issue: "Database error"

**Fix:**
```bash
# Delete and recreate database
rm data/pixie.db

# Backend will recreate on startup
python backend/main.py
```

## Next Steps

1. **Customize Pixie:**
   - Replace sprites in `src/assets/sprites/`
   - Modify personality in `backend/brain/ollama.py`
   - Change UI colors in `src/styles/global.css`

2. **Build for Release:**
   ```bash
   npm run tauri:build
   ```
   Creates `PixieSetup.exe` in `src-tauri/target/release/`

3. **Read Documentation:**
   - [ARCHITECTURE.md](../ARCHITECTURE.md) - System design
   - [docs/API.md](docs/API.md) - API reference
   - [docs/DATABASE.md](docs/DATABASE.md) - Database schema
   - [docs/IMPLEMENTATION.md](docs/IMPLEMENTATION.md) - Complete guide

## Project Structure

```
Pixie/
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── hooks/              # Custom hooks
│   ├── services/           # API communication
│   ├── assets/sprites/     # Character sprites
│   └── styles/             # CSS styles
├── backend/                # Python backend
│   ├── api/routes/         # FastAPI endpoints
│   ├── brain/              # Ollama integration
│   ├── memory/             # Database operations
│   └── config/             # Settings
├── src-tauri/              # Tauri desktop
├── docs/                   # Documentation
└── package.json            # Node dependencies
```

## System Requirements

### Minimum
- CPU: Dual-core @ 2 GHz
- RAM: 4 GB
- Storage: 500 MB (app + model)

### Recommended
- CPU: Quad-core @ 2.5 GHz
- RAM: 8 GB
- Storage: 2 GB (larger models)

## Performance Tips

1. **Use smaller Ollama models** for faster responses:
   - `mistral` (7B) - fast & capable
   - `neural-chat` (7B) - optimized for chat
   - `dolphin-mixtral` (8x7B) - slower but smarter

2. **Enable GPU acceleration** in Ollama:
   - NVIDIA: Install CUDA
   - AMD: Install ROCm
   - Intel: Install oneAPI

3. **Limit history** in chat for faster context:
   - Currently: Last 10 messages
   - Can reduce in `backend/api/routes/chat.py`

## Support

- **Documentation**: See `/docs` folder
- **Issues**: Check troubleshooting above
- **Feature requests**: See ARCHITECTURE.md Phase 2+ section

## License

MIT - See LICENSE file

---

**Pixie: Your friendly AI companion, always by your side.** ✨

Happy coding!
