"""
Reminders Module - Scheduling and notifications

Handles reminder creation, storage, and triggering.
"""

import sqlite3
from datetime import datetime
import logging
from typing import List, Optional

logger = logging.getLogger(__name__)


class ReminderScheduler:
    """Manages user reminders"""

    def __init__(self, db_path: str):
        self.db_path = db_path

    def create_reminder(
        self, title: str, description: str, scheduled_time: str
    ) -> Optional[int]:
        """Create a new reminder"""

        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()

            cursor.execute(
                """
                INSERT INTO reminders (title, description, scheduled_time)
                VALUES (?, ?, ?)
                """,
                (title, description, scheduled_time),
            )

            reminder_id = cursor.lastrowid
            conn.commit()
            conn.close()

            logger.info(f"Created reminder: {title}")
            return reminder_id

        except Exception as e:
            logger.error(f"Failed to create reminder: {e}")
            return None

    def get_due_reminders(self) -> List[dict]:
        """Get reminders that are due"""

        try:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()

            cursor.execute(
                """
                SELECT * FROM reminders
                WHERE scheduled_time <= datetime('now')
                AND is_completed = 0
                AND is_archived = 0
                ORDER BY scheduled_time ASC
                """
            )

            reminders = [dict(row) for row in cursor.fetchall()]
            conn.close()

            return reminders

        except Exception as e:
            logger.error(f"Failed to get due reminders: {e}")
            return []

    def complete_reminder(self, reminder_id: int) -> bool:
        """Mark reminder as completed"""

        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()

            cursor.execute(
                "UPDATE reminders SET is_completed = 1 WHERE id = ?",
                (reminder_id,),
            )

            conn.commit()
            conn.close()

            return True

        except Exception as e:
            logger.error(f"Failed to complete reminder: {e}")
            return False
