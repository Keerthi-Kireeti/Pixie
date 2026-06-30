"""
Pixie Backend - Main Entry Point

This is the FastAPI server that handles:
- Ollama integration (AI responses)
- Database operations (memory, reminders, preferences)
- System commands
- Reminder scheduling

Run with: python -m uvicorn backend.main:app --reload
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from typing import Dict, Any

# Backend modules
from backend.api.routes import chat, memory, reminders, commands, health
from backend.config.settings import Settings
from backend.utils.logger import setup_logging

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)

# Load settings
settings = Settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup/shutdown events
    """
    logger.info("[START] Pixie Backend Starting...")
    logger.info(f"Ollama Host: {settings.ollama_host}")
    logger.info(f"Database: {settings.database_path}")

    yield  # App runs here

    logger.info("[STOP] Pixie Backend Shutting Down...")


# Create FastAPI app
app = FastAPI(
    title="Pixie Backend",
    description="AI Companion Desktop Assistant",
    version="0.1.0",
    lifespan=lifespan,
)

# Add CORS middleware (only allow localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],  # Vite dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routers
app.include_router(health.router)
app.include_router(chat.router)
app.include_router(memory.router)
app.include_router(reminders.router)
app.include_router(commands.router)


# Root endpoint
@app.get("/")
async def root():
    return {
        "name": "Pixie Backend",
        "version": "0.1.0",
        "status": "running",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host=settings.backend_host,
        port=settings.backend_port,
        reload=True,
    )
