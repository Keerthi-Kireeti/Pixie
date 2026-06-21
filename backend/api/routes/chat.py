"""
Chat Route

POST /api/chat - Send message and get AI response
"""

from fastapi import APIRouter, HTTPException
import logging
import uuid
from backend.config.settings import Settings
from backend.models.schemas import ChatRequest, ChatResponse
from backend.brain.ollama import get_brain
from backend.memory.store import get_memory

router = APIRouter(prefix="/api", tags=["chat"])
logger = logging.getLogger(__name__)
settings = Settings()

# Global conversation tracking
_current_conversation_id = None
_memory_store = get_memory(settings.database_path)
_brain = get_brain(settings.ollama_host, settings.ollama_model)


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Process user message and return AI response

    Args:
        request: ChatRequest with user message

    Returns:
        ChatResponse with Pixie's response
    """

    global _current_conversation_id

    try:
        # Create new conversation if needed
        if _current_conversation_id is None:
            session_id = str(uuid.uuid4())
            _current_conversation_id = _memory_store.create_conversation(session_id)

        if not _current_conversation_id:
            raise HTTPException(
                status_code=500, detail="Failed to create conversation"
            )

        # Save user message
        _memory_store.save_message(
            conversation_id=_current_conversation_id,
            role="user",
            content=request.message,
        )

        # Get conversation history for context
        history = _memory_store.get_conversation_history(
            conversation_id=_current_conversation_id, limit=5
        )

        # Build context from history
        context = ""
        if history:
            for msg in history[:-1]:  # Exclude current message
                role_label = "User" if msg["role"] == "user" else "Pixie"
                context += f"{role_label}: {msg['content']}\n"

        # Generate response from Ollama
        result = await _brain.generate_response(
            prompt=request.message, context=context if context else None
        )

        if not result["success"]:
            raise HTTPException(
                status_code=503, detail=f"Ollama error: {result.get('error')}"
            )

        response_text = result["response"]

        # Save Pixie's response
        _memory_store.save_message(
            conversation_id=_current_conversation_id,
            role="assistant",
            content=response_text,
        )

        return ChatResponse(
            response=response_text,
            conversation_id=str(_current_conversation_id),
            thinking_time=result["time"],
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@router.post("/chat/reset")
async def reset_conversation():
    """Reset current conversation"""

    global _current_conversation_id
    _current_conversation_id = None

    return {"status": "reset"}
