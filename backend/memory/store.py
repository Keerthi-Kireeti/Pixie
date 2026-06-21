"""
Memory Module - Database operations

Handles conversation history, preferences, and data persistence.
"""

import sqlite3
from typing import List, Dict, Any, Optional
from datetime import datetime
import json
import logging

logger = logging.getLogger(__name__)


class MemoryStore:
    """SQLite-based memory store for Pixie"""

    def __init__(self, db_path: str):
        self.db_path = db_path
        self.init_database()

    def init_database(self):
        """Initialize database schema"""

        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        # Conversations table
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS conversations (
                id INTEGER PRIMARY KEY,
                session_id TEXT UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                metadata TEXT
            )
            """
        )

        # Messages table
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY,
                conversation_id INTEGER NOT NULL,
                role TEXT NOT NULL,
                content TEXT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                tokens_used INTEGER,
                FOREIGN KEY (conversation_id) REFERENCES conversations(id)
            )
            """
        )

        # Reminders table
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS reminders (
                id INTEGER PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT,
                scheduled_time TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_completed BOOLEAN DEFAULT 0,
                is_archived BOOLEAN DEFAULT 0
            )
            """
        )

        # Preferences table
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS user_preferences (
                id INTEGER PRIMARY KEY,
                key TEXT UNIQUE NOT NULL,
                value TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )

        # System state table
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS system_state (
                id INTEGER PRIMARY KEY,
                key TEXT UNIQUE NOT NULL,
                value TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )

        conn.commit()
        conn.close()
        logger.info(f"Database initialized at {self.db_path}")

    def save_message(
        self, conversation_id: int, role: str, content: str
    ) -> bool:
        """Save a message to conversation history"""

        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()

            cursor.execute(
                """
                INSERT INTO messages (conversation_id, role, content)
                VALUES (?, ?, ?)
                """,
                (conversation_id, role, content),
            )

            # Update conversation timestamp
            cursor.execute(
                """
                UPDATE conversations SET updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
                """,
                (conversation_id,),
            )

            conn.commit()
            conn.close()
            return True

        except Exception as e:
            logger.error(f"Failed to save message: {e}")
            return False

    def get_conversation_history(
        self, conversation_id: int, limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Get recent messages from conversation"""

        try:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()

            cursor.execute(
                """
                SELECT role, content, timestamp FROM messages
                WHERE conversation_id = ?
                ORDER BY timestamp DESC
                LIMIT ?
                """,
                (conversation_id, limit),
            )

            messages = [dict(row) for row in cursor.fetchall()]
            conn.close()

            # Reverse to get chronological order
            return list(reversed(messages))

        except Exception as e:
            logger.error(f"Failed to get conversation history: {e}")
            return []

    def create_conversation(self, session_id: str) -> Optional[int]:
        """Create a new conversation"""

        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()

            cursor.execute(
                """
                INSERT INTO conversations (session_id)
                VALUES (?)
                """,
                (session_id,),
            )

            conversation_id = cursor.lastrowid
            conn.commit()
            conn.close()

            logger.info(f"Created conversation {conversation_id}")
            return conversation_id

        except Exception as e:
            logger.error(f"Failed to create conversation: {e}")
            return None

    def set_preference(self, key: str, value: str) -> bool:
        """Save user preference"""

        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()

            cursor.execute(
                """
                INSERT OR REPLACE INTO user_preferences (key, value)
                VALUES (?, ?)
                """,
                (key, value),
            )

            conn.commit()
            conn.close()
            return True

        except Exception as e:
            logger.error(f"Failed to set preference: {e}")
            return False

    def get_preference(self, key: str) -> Optional[str]:
        """Get user preference"""

        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()

            cursor.execute(
                "SELECT value FROM user_preferences WHERE key = ?", (key,)
            )

            result = cursor.fetchone()
            conn.close()

            return result[0] if result else None

        except Exception as e:
            logger.error(f"Failed to get preference: {e}")
            return None


# Global instance
_memory_instance: Optional[MemoryStore] = None


def get_memory(db_path: str) -> MemoryStore:
    """Get or create memory store instance"""
    global _memory_instance

    if _memory_instance is None:
        _memory_instance = MemoryStore(db_path)

    return _memory_instance
