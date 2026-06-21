"""
Reminders Route

GET /api/reminders - List reminders
POST /api/reminders - Create reminder
DELETE /api/reminders/{id} - Delete reminder
"""

from fastapi import APIRouter, HTTPException
import logging
import sqlite3
from datetime import datetime
from typing import List
from backend.config.settings import Settings
from backend.models.schemas import ReminderRequest, ReminderResponse

router = APIRouter(prefix="/api/reminders", tags=["reminders"])
logger = logging.getLogger(__name__)
settings = Settings()


@router.get("", response_model=List[ReminderResponse])
async def list_reminders(include_completed: bool = False):
    """
    List all reminders

    Args:
        include_completed: Include completed reminders

    Returns:
        List of reminders
    """

    try:
        conn = sqlite3.connect(settings.database_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        query = "SELECT * FROM reminders WHERE is_archived = 0"
        if not include_completed:
            query += " AND is_completed = 0"

        query += " ORDER BY scheduled_time ASC"

        cursor.execute(query)
        reminders = [dict(row) for row in cursor.fetchall()]
        conn.close()

        return [
            ReminderResponse(
                id=r["id"],
                title=r["title"],
                description=r["description"],
                scheduled_time=r["scheduled_time"],
                created_at=r["created_at"],
                is_completed=bool(r["is_completed"]),
            )
            for r in reminders
        ]

    except Exception as e:
        logger.error(f"Failed to list reminders: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("", response_model=ReminderResponse)
async def create_reminder(request: ReminderRequest):
    """
    Create a new reminder

    Args:
        request: ReminderRequest with reminder details

    Returns:
        Created reminder
    """

    try:
        conn = sqlite3.connect(settings.database_path)
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO reminders (title, description, scheduled_time)
            VALUES (?, ?, ?)
            """,
            (request.title, request.description, request.scheduled_time),
        )

        reminder_id = cursor.lastrowid
        conn.commit()
        conn.close()

        return ReminderResponse(
            id=reminder_id,
            title=request.title,
            description=request.description,
            scheduled_time=request.scheduled_time,
            created_at=datetime.now().isoformat(),
            is_completed=False,
        )

    except Exception as e:
        logger.error(f"Failed to create reminder: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{reminder_id}")
async def update_reminder(reminder_id: int, is_completed: bool = False):
    """Mark reminder as completed"""

    try:
        conn = sqlite3.connect(settings.database_path)
        cursor = conn.cursor()

        cursor.execute(
            "UPDATE reminders SET is_completed = ? WHERE id = ?",
            (is_completed, reminder_id),
        )

        conn.commit()
        conn.close()

        return {"status": "updated", "id": reminder_id}

    except Exception as e:
        logger.error(f"Failed to update reminder: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{reminder_id}")
async def delete_reminder(reminder_id: int):
    """Archive/delete a reminder"""

    try:
        conn = sqlite3.connect(settings.database_path)
        cursor = conn.cursor()

        cursor.execute(
            "UPDATE reminders SET is_archived = 1 WHERE id = ?", (reminder_id,)
        )

        conn.commit()
        conn.close()

        return {"status": "archived", "id": reminder_id}

    except Exception as e:
        logger.error(f"Failed to delete reminder: {e}")
        raise HTTPException(status_code=500, detail=str(e))
