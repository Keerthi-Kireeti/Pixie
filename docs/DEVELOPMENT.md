# Development Workflow

Quick reference for common development tasks.

## Starting Development

```bash
# Terminal 1: Frontend (React)
npm run frontend:dev
# http://localhost:5173

# Terminal 2: Backend (Python)
npm run backend:dev
# http://localhost:8000

# Terminal 3: Desktop (Tauri)
npm run tauri:dev

# Or start all at once:
npm run dev
```

## Frontend Development

### Add a New Component

```bash
# 1. Create component file
touch src/components/MyComponent.tsx

# 2. Create styling
touch src/components/MyComponent.css

# 3. Export from index
# Edit src/components/index.ts

# 4. Import and use in App
```

Example component:

```typescript
import './MyComponent.css'

interface Props {
  title: string
}

export function MyComponent({ title }: Props) {
  return <div className="my-component">{title}</div>
}
```

### Add a Custom Hook

```bash
# Create hook
touch src/hooks/useMyHook.ts
```

Example hook:

```typescript
import { useState } from 'react'

export function useMyHook() {
  const [data, setData] = useState(null)

  return { data, setData }
}
```

### Add Styling

Global styles: `src/styles/global.css`
Component styles: `src/components/Component.css`

```css
.my-component {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  padding: 16px;
}
```

## Backend Development

### Add a New API Route

```bash
# Create route file in backend/api/routes/
touch backend/api/routes/my_feature.py
```

Example route:

```python
from fastapi import APIRouter

router = APIRouter(prefix="/api/my-feature", tags=["my-feature"])

@router.get("/status")
async def get_status():
    return {"status": "ok"}
```

### Add to API

Edit `backend/main.py`:

```python
from backend.api.routes import my_feature

app.include_router(my_feature.router)
```

### Add a Database Model

Edit `backend/models/database.py`:

```python
class MyModel(Base):
    __tablename__ = "my_table"
    
    id = Column(Integer, primary_key=True)
    name = Column(String(255))
```

### Add a Pydantic Schema

Edit `backend/models/schemas.py`:

```python
class MyRequest(BaseModel):
    name: str
    
class MyResponse(BaseModel):
    id: int
    name: str
```

## Testing

### Test Frontend Component

```bash
# (Set up testing in Phase 2)
npm run test
```

### Test Backend

```bash
# Install pytest if not done
pip install pytest

# Run tests
python -m pytest backend/tests/
```

### Manual Testing

1. **Frontend**: http://localhost:5173
2. **Backend**: http://localhost:8000/docs (Swagger UI)
3. **Desktop**: Click around in Tauri window

### Test API Endpoints

```bash
# Health check
curl http://localhost:8000/api/health

# Chat
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!"}'

# Create reminder
curl -X POST http://localhost:8000/api/reminders \
  -H "Content-Type: application/json" \
  -d '{"title": "Test", "scheduled_time": "2024-01-20 15:00:00"}'
```

## Database

### View Database

```bash
# Using sqlite3 CLI
sqlite3 data/pixie.db

# Query
SELECT * FROM messages LIMIT 10;
SELECT * FROM reminders;
```

### Reset Database

```bash
# Delete database (will recreate on next run)
rm data/pixie.db
```

### Backup Database

```bash
# Copy database file
cp data/pixie.db data/pixie_backup.db
```

## Building

### Build Frontend

```bash
npm run frontend:build
# Creates: dist/
```

### Build Backend

```bash
# Backend is used as-is via Python
# For production, use PyInstaller:
pyinstaller --onefile backend/main.py
```

### Build Desktop App

```bash
npm run tauri:build
# Creates: src-tauri/target/release/PixieSetup.exe
```

## Code Quality

### Format Code

```bash
# Frontend (using Prettier is optional)
# Add to package.json scripts if desired

# Backend
pip install black
black backend/
```

### Lint Code

```bash
# Frontend (ESLint)
npm run lint

# Backend (Flake8)
pip install flake8
flake8 backend/
```

### Type Check

```bash
# Frontend
npm run type-check

# Backend (Mypy)
pip install mypy
mypy backend/
```

## Environment Variables

Create `.env` file:

```env
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=mistral
BACKEND_HOST=127.0.0.1
BACKEND_PORT=8000
DATABASE_PATH=./data/pixie.db
```

## Troubleshooting

### Port Already in Use

```bash
# Check what's using the port
netstat -ano | findstr :8000

# Kill the process
taskkill /PID <PID> /F
```

### Module Not Found

```bash
# Clear Python cache
find . -type d -name __pycache__ -exec rm -r {} +
find . -type f -name "*.pyc" -delete

# Reinstall dependencies
pip install -r backend/requirements.txt
```

### Vite Cache Issues

```bash
rm -rf dist/ node_modules/.vite
npm run frontend:dev
```

### Tauri Build Issues

```bash
# Update Tauri
npm install @tauri-apps/cli@latest

# Rebuild
npm run tauri build
```

## Debugging

### Frontend Debug

In browser console (F12):

```javascript
// Check app state
window.__INITIAL_STATE__

// Test Tauri command
invoke('pixie_status').then(result => console.log(result))
```

### Backend Debug

Add logging:

```python
import logging
logger = logging.getLogger(__name__)

logger.debug(f"Variable: {value}")
logger.info(f"Event: {event}")
logger.error(f"Error: {error}")
```

Run with debug logging:

```python
# In main.py, set level to DEBUG
logging.basicConfig(level=logging.DEBUG)
```

### Desktop Debug

Use Tauri dev tools:

```bash
# Enable dev tools
npm run tauri:dev -- --verbose
```

## Performance Profiling

### Frontend

```javascript
// In Chrome DevTools
console.time('my-operation')
// ... code to profile ...
console.timeEnd('my-operation')
```

### Backend

```python
import time

start = time.time()
# ... code to profile ...
elapsed = time.time() - start
print(f"Time: {elapsed:.2f}s")
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes
git add .
git commit -m "Add my feature"

# Push to remote
git push origin feature/my-feature

# Create pull request (on GitHub/GitLab)
```

## Documentation

When adding features:

1. **Update docstrings** in code
2. **Update API.md** if adding endpoints
3. **Update IMPLEMENTATION.md** if major changes
4. **Add comments** for complex logic

---

Happy coding! 🚀
