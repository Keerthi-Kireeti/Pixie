"""
Configuration Module - Load settings from environment
"""

from pydantic_settings import BaseSettings
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    # Ollama Configuration
    ollama_host: str = os.getenv("OLLAMA_HOST", "http://localhost:11434")
    ollama_model: str = os.getenv("OLLAMA_MODEL", "mistral")
    ollama_timeout: int = 300  # 5 minutes

    # Backend Configuration
    backend_host: str = os.getenv("BACKEND_HOST", "127.0.0.1")
    backend_port: int = int(os.getenv("BACKEND_PORT", "8000"))

    # Database Configuration
    database_path: str = os.getenv("DATABASE_PATH", "./data/pixie.db")

    # Max conversation tokens to keep in memory
    max_context_tokens: int = 4096

    class Config:
        env_file = ".env"
        case_sensitive = False
