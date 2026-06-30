"""
Configuration Module - Load settings from environment
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    # Ollama Configuration
    ollama_host: str = "http://localhost:11434"
    ollama_model: str = "llama2"
    ollama_timeout: int = 300  # 5 minutes

    # Backend Configuration
    backend_host: str = "127.0.0.1"
    backend_port: int = 8000

    # Database Configuration
    database_path: str = "./data/pixie.db"

    # Max conversation tokens to keep in memory
    max_context_tokens: int = 4096

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
        case_sensitive=False
    )

