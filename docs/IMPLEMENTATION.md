# Implementation Guide - Building Pixie Step by Step

This guide walks through implementing Pixie from development to production.

---

## PHASE 1: SETUP & INITIALIZATION

### Step 1: Verify Prerequisites

```bash
# Check Node.js version (need >= 18.0)
node --version

# Check Python version (need >= 3.8)
python --version

# Check Git
git --version
```

### Step 2: Initialize Git Repository

```bash
cd g:\Pixie
git init
git add .
git commit -m "Initial commit: Project structure and documentation"
```

### Step 3: Install Node Dependencies

```bash
npm install
```

This installs:
- React 18
- TypeScript 5
- Vite (bundler)
- Tauri CLI
- PixiJS
- ESLint

### Step 4: Install Python Dependencies

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate

# Install packages
npm run backend:install
```

This installs:
- FastAPI (web framework)
- Uvicorn (ASGI server)
- SQLAlchemy (ORM)
- Ollama (LLM integration)
- APScheduler (reminders)

---

## PHASE 2: ENVIRONMENT SETUP

### Step 5: Create Environment File

Create `backend/.env`:

```env
# Ollama Configuration
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=mistral

# Backend Configuration
BACKEND_HOST=127.0.0.1
BACKEND_PORT=8000

# Database Configuration
DATABASE_PATH=./data/pixie.db
```

### Step 6: Create Data Directory

```bash
mkdir data
```

---

## PHASE 3: INSTALLATION & CONFIGURATION

### Step 7: Install Ollama

**Download from:** https://ollama.ai

1. Run installer
2. Start Ollama service
3. Download a model:

```bash
ollama pull mistral
# or
ollama pull neural-chat
```

4. Verify it's running:

```bash
curl http://localhost:11434/api/tags
```

### Step 8: Setup Tauri

```bash
# Initialize Tauri (may already be initialized)
npm run tauri init

# For Windows, ensure you have:
# - Rust toolchain installed
# - Microsoft C++ build tools
```

---

## PHASE 4: DEVELOPMENT

### Step 9: Start Development Environment

Open 3 terminals:

**Terminal 1 - Frontend:**
```bash
npm run frontend:dev
```
Starts Vite dev server at http://localhost:5173

**Terminal 2 - Backend:**
```bash
npm run backend:dev
```
Starts FastAPI at http://localhost:8000

**Terminal 3 - Tauri:**
```bash
npm run tauri:dev
```
Starts Tauri dev window

**Or use single command:**
```bash
npm run dev
```

### Step 10: Verify All Systems

Check each system:

1. **Frontend:** Visit http://localhost:5173
   - Should see Pixie window with draggable character
   - Chat bubble button appears

2. **Backend:** Visit http://localhost:8000/api/health
   - Should return status with backend/ollama/database health

3. **Tauri Window:**
   - Floating window with Pixie character appears
   - Can drag around desktop
   - Chat toggle works

### Step 11: Test Chat Integration

1. Click Pixie character
2. Type: "Hello Pixie!"
3. Click send button
4. Should receive response from Ollama

**If errors:**
- Check Ollama is running: `ollama serve`
- Check backend is running: `python backend/main.py`
- Check console for error messages

---

## PHASE 5: CUSTOMIZATION

### Step 12: Add Custom Sprites

Replace placeholder sprites in `src/assets/sprites/`:

1. **idle/**: 4-6 frames for breathing animation
2. **thinking/**: 3-4 frames for thinking pose
3. **happy/**: 4-6 frames for celebrating
4. **listening/**: 2-3 frames for attentive pose
5. **sleeping/**: 2-3 frames for sleep animation

Sprite format: 64x64 PNG (or adjust canvas size)

### Step 13: Customize Pixie Personality

In `backend/brain/ollama.py`, modify system prompt:

```python
system_prompt = """
You are Pixie, a friendly, playful AI companion on someone's desktop.
You're curious, supportive, and slightly mischievous.
You use emojis and show personality in responses.
Keep responses concise (1-2 sentences).
"""
```

### Step 14: Configure Tauri Window

Edit `src-tauri/tauri.conf.json`:

```json
"windows": [{
  "title": "Pixie",
  "width": 200,
  "height": 250,
  "x": 100,  // Initial X position
  "y": 100   // Initial Y position
}]
```

### Step 15: Add Custom Themes

Edit `src/styles/global.css`:

```css
/* Dark theme */
:root {
  --primary: #667eea;
  --secondary: #764ba2;
  --background: #141820;
  --text: #ffffff;
}

/* Light theme (Phase 2) */
.theme-light {
  --primary: #5a67d8;
  --secondary: #805ad5;
  --background: #ffffff;
  --text: #000000;
}
```

---

## PHASE 6: BUILDING FOR PRODUCTION

### Step 16: Build Frontend

```bash
npm run frontend:build
```

Creates optimized bundle in `dist/`

### Step 17: Test Production Build Locally

```bash
npm run tauri build --preview
```

### Step 18: Build Desktop Application

```bash
npm run tauri build
```

Creates `PixieSetup.exe` in `src-tauri/target/release/`

### Step 19: Create Installer (Optional)

For NSIS installer configuration, edit `src-tauri/tauri.conf.json`:

```json
"bundle": {
  "nsis": {
    "installerIcon": "icons/icon.ico",
    "headerImage": "path/to/header.bmp",
    "sidebarImage": "path/to/sidebar.bmp"
  }
}
```

---

## PHASE 7: DISTRIBUTION & DEPLOYMENT

### Step 20: Sign Executable (Windows Code Signing)

For production, sign the executable:

```bash
# Using DigiCert or similar certificate provider
signtool sign /f "C:\path\to\certificate.pfx" ^
  /p "password" /t "http://timestamp.server" ^
  PixieSetup.exe
```

### Step 21: Create Release Package

```bash
# Copy executable
cp src-tauri/target/release/PixieSetup.exe releases/

# Create checksum
certUtil -hashfile PixieSetup.exe SHA256 > PixieSetup.exe.sha256

# Create release notes
echo "Pixie v0.1.0 - Initial Release" > RELEASE_NOTES.md
```

### Step 22: Publish to Website

1. Create download page
2. Host executable on CDN
3. Add auto-update mechanism (Phase 2)

---

## PHASE 8: TESTING & QA

### Step 23: Manual Testing Checklist

- [ ] Window appears on desktop
- [ ] Window is draggable
- [ ] Character animates (idle breathing)
- [ ] Chat bubble opens/closes
- [ ] Can type and send messages
- [ ] Pixie responds with AI text
- [ ] Reminders can be created
- [ ] Can open browser
- [ ] Can open applications
- [ ] Character state changes match context

### Step 24: Automated Testing (Phase 2)

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Backend tests
python -m pytest backend/
```

### Step 25: Performance Profiling

1. Use Chrome DevTools for frontend performance
2. Use Python profiler for backend
3. Monitor memory usage over time
4. Test with slow Ollama responses

---

## TROUBLESHOOTING

### Issue: "Could not connect to Ollama"

**Solution:**
```bash
# Start Ollama
ollama serve

# In another terminal, check it's running
curl http://localhost:11434/api/tags

# Verify settings
cat backend/.env
```

### Issue: "Frontend not updating"

**Solution:**
```bash
# Clear Vite cache
rm -rf dist/ .vite/

# Restart frontend dev server
npm run frontend:dev
```

### Issue: "Database locked error"

**Solution:**
```bash
# Close other Pixie instances
# Delete lock file if stuck
rm data/pixie.db-journal

# Rebuild database
rm data/pixie.db
python backend/main.py
```

### Issue: "Tauri window won't open"

**Solution:**
```bash
# Check Rust is installed
rustc --version

# Check Tauri CLI
npm run tauri -- --version

# Try rebuilding Tauri
npm run tauri build
```

---

## OPTIMIZATION TIPS

### Frontend Performance

1. **Code Splitting:**
   - Lazy load chat component
   - Split animations into chunks

2. **Asset Optimization:**
   - Compress sprites (use 8-bit PNG)
   - Use WebP format (Phase 2)

3. **Memory Management:**
   - Limit conversation history
   - Clean up old messages

### Backend Performance

1. **Ollama Optimization:**
   - Use smaller model (neural-chat vs mistral)
   - Configure GPU acceleration
   - Add response caching

2. **Database Optimization:**
   - Add indexes on frequently queried columns
   - Archive old conversations
   - Run VACUUM periodically

3. **Async Operations:**
   - Use async/await properly
   - Don't block event loop
   - Cache frequently accessed data

---

## DEPLOYMENT CHECKLIST

Before releasing to users:

- [ ] Code is committed to git
- [ ] All dependencies are pinned to versions
- [ ] Environment variables are documented
- [ ] Database migrations are tested
- [ ] Security: No hardcoded secrets
- [ ] Performance: App loads in < 2 seconds
- [ ] Error handling: Graceful degradation
- [ ] Documentation: README and guides completed
- [ ] Testing: Manual QA passed
- [ ] Signing: Executable is code-signed (optional)

---

## NEXT STEPS

After MVP launch:

1. **Phase 2 Features**
   - Voice interaction
   - Multi-agent system
   - Calendar integration
   - Advanced personality

2. **Infrastructure**
   - CI/CD pipeline
   - Automated testing
   - Crash reporting
   - Analytics

3. **Scaling**
   - Multi-user support
   - Cloud sync
   - Community plugins
   - Marketplace

---

**Implementation guide - Follow one phase at a time for steady progress.**
