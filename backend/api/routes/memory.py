"""
Memory Route

GET /api/memory - Get conversation history
POST /api/memory/preferences - Save user preferences
"""

from fastapi import APIRouter, HTTPException
import logging
from typing import List, Dict, Any
from backend.config.settings import Settings
from backend.memory.store import get_memory

router = APIRouter(prefix="/api/memory", tags=["memory"])
logger = logging.getLogger(__name__)
settings = Settings()

_memory_store = get_memory(settings.database_path)


@router.get("/history")
async def get_memory_history(conversation_id: int, limit: int = 20) -> Dict[str, Any]:
    """
    Get conversation history

    Args:
        conversation_id: ID of conversation to retrieve
        limit: Maximum number of messages to return

    Returns:
        Dictionary with messages and metadata
    """

    try:
        messages = _memory_store.get_conversation_history(
            conversation_id=conversation_id, limit=limit
        )

        return {
            "conversation_id": conversation_id,
            "messages": messages,
            "count": len(messages),
        }

    except Exception as e:
        logger.error(f"Failed to get memory: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/preferences")
async def save_preference(key: str, value: str):
    """
    Save user preference

    Args:
        key: Preference key
        value: Preference value
    """

    try:
        success = _memory_store.set_preference(key, value)

        if not success:
            raise HTTPException(status_code=500, detail="Failed to save preference")

        return {"status": "saved", "key": key}

    except Exception as e:
        logger.error(f"Failed to save preference: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/preferences/{key}")
async def get_preference(key: str):
    """Get user preference by key"""

    try:
        value = _memory_store.get_preference(key)

        if value is None:
            raise HTTPException(status_code=404, detail="Preference not found")

        return {"key": key, "value": value}

    except Exception as e:
        logger.error(f"Failed to get preference: {e}")
        raise HTTPException(status_code=500, detail=str(e))
