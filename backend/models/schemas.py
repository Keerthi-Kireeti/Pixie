"""
Pydantic Models for API Requests/Responses
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# Chat Models
class ChatRequest(BaseModel):
    """User message request"""

    message: str = Field(..., min_length=1, max_length=1000)
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    """AI response"""

    response: str
    conversation_id: str
    thinking_time: float


# Memory Models
class ConversationMessage(BaseModel):
    """Single conversation message"""

    role: str  # 'user' or 'assistant'
    content: str
    timestamp: datetime


class ConversationHistory(BaseModel):
    """Full conversation history"""

    conversation_id: str
    messages: List[ConversationMessage]
    created_at: datetime
    updated_at: datetime


# Reminder Models
class ReminderRequest(BaseModel):
    """Create or update reminder"""

    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    scheduled_time: str  # ISO format datetime


class ReminderResponse(BaseModel):
    """Reminder data"""

    id: int
    title: str
    description: Optional[str]
    scheduled_time: str
    created_at: str
    is_completed: bool


# Command Models
class CommandRequest(BaseModel):
    """Execute system command"""

    command: str = Field(..., min_length=1)
    args: Optional[List[str]] = None


class CommandResponse(BaseModel):
    """Command execution result"""

    success: bool
    output: Optional[str] = None
    error: Optional[str] = None


# Health Models
class HealthResponse(BaseModel):
    """Health check response"""

    status: str
    backend: bool
    ollama: bool
    database: bool
