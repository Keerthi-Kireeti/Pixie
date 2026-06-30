"""
Logger Configuration
"""

import logging
import os
import sys
from logging.handlers import RotatingFileHandler


def setup_logging():
    """Configure logging for the application"""

    # Create logger
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    # Console handler with UTF-8 encoding to avoid cp1252 issues on Windows
    console_handler = logging.StreamHandler(
        open(sys.stdout.fileno(), mode='w', encoding='utf-8', closefd=False)
    )
    console_handler.setLevel(logging.INFO)
    console_formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    console_handler.setFormatter(console_formatter)

    # Ensure data directory exists before creating file handler
    os.makedirs("./data", exist_ok=True)

    # File handler (rotating) with UTF-8 encoding
    file_handler = RotatingFileHandler(
        "./data/pixie.log",
        maxBytes=10 * 1024 * 1024,  # 10 MB
        backupCount=5,
        encoding="utf-8",
    )
    file_handler.setLevel(logging.DEBUG)
    file_formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    file_handler.setFormatter(file_formatter)

    # Add handlers
    logger.addHandler(console_handler)
    logger.addHandler(file_handler)

    return logger
