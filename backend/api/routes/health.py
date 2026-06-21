"""
Health Check Route

GET /api/health - System status endpoint
"""

from fastapi import APIRouter, HTTPException
import logging
from backend.config.settings import Settings
from backend.models.schemas import HealthResponse
import httpx

router = APIRouter(prefix="/api", tags=["health"])

settings = Settings()
logger = logging.getLogger(__name__)


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Check health of Pixie backend and dependencies

    Returns:
        HealthResponse with status of backend, Ollama, and database
    """

    # Check Ollama
    ollama_ok = False
    try:
        response = httpx.get(f"{settings.ollama_host}/api/tags", timeout=5)
        ollama_ok = response.status_code == 200
    except Exception as e:
        logger.warning(f"Ollama health check failed: {e}")

    # Check database
    database_ok = False
    try:
        import sqlite3

        conn = sqlite3.connect(settings.database_path)
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        database_ok = True
        conn.close()
    except Exception as e:
        logger.warning(f"Database health check failed: {e}")

    return HealthResponse(
        status="ok" if (ollama_ok and database_ok) else "warning",
        backend=True,
        ollama=ollama_ok,
        database=database_ok,
    )
