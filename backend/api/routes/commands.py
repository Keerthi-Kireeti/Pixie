"""
Commands Route

POST /api/commands/open - Open browser, applications, or folders
POST /api/commands/screenshot - Take screenshot
"""

from fastapi import APIRouter, HTTPException
import logging
import subprocess
import os
from typing import Optional
from backend.models.schemas import CommandRequest, CommandResponse

router = APIRouter(prefix="/api/commands", tags=["commands"])
logger = logging.getLogger(__name__)


@router.post("/open/browser")
async def open_browser(url: str):
    """Open URL in default browser"""

    try:
        import webbrowser

        webbrowser.open(url)
        return {"status": "opened", "url": url}

    except Exception as e:
        logger.error(f"Failed to open browser: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/open/app")
async def open_application(app_name: str):
    """Open application by name or path"""

    try:
        # For Windows
        if os.name == "nt":
            os.startfile(app_name)
        else:
            subprocess.Popen([app_name])

        return {"status": "opened", "app": app_name}

    except Exception as e:
        logger.error(f"Failed to open application: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/open/folder")
async def open_folder(path: str):
    """Open folder in file explorer"""

    try:
        import webbrowser

        if os.name == "nt":
            os.startfile(path)
        else:
            subprocess.Popen(["xdg-open", path])

        return {"status": "opened", "path": path}

    except Exception as e:
        logger.error(f"Failed to open folder: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/screenshot")
async def take_screenshot(save_path: Optional[str] = None):
    """Take a screenshot of the desktop"""

    try:
        # pip install pillow for screenshots
        from PIL import ImageGrab

        if save_path is None:
            save_path = "./data/screenshot.png"

        # Ensure directory exists
        os.makedirs(os.path.dirname(save_path), exist_ok=True)

        # Take screenshot
        screenshot = ImageGrab.grab()
        screenshot.save(save_path)

        return {"status": "captured", "path": save_path}

    except ImportError:
        raise HTTPException(status_code=400, detail="PIL/Pillow not installed")
    except Exception as e:
        logger.error(f"Failed to take screenshot: {e}")
        raise HTTPException(status_code=500, detail=str(e))
