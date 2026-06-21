"""
Brain Module - Ollama Integration

Handles all communication with Ollama LLM.
"""

import httpx
import logging
from typing import Optional
import time

logger = logging.getLogger(__name__)


class OllamaBrain:
    """Interface to Ollama LLM"""

    def __init__(self, host: str, model: str, timeout: int = 300):
        self.host = host
        self.model = model
        self.timeout = timeout
        self.client = httpx.Client(timeout=timeout)

    async def generate_response(
        self, prompt: str, context: Optional[str] = None
    ) -> dict:
        """
        Generate a response from Ollama

        Args:
            prompt: User message
            context: Conversation history for context

        Returns:
            Dictionary with response and metadata
        """

        try:
            # Build the full prompt with context if provided
            full_prompt = prompt
            if context:
                full_prompt = f"{context}\n\nUser: {prompt}"

            logger.info(f"Sending prompt to Ollama ({self.model})...")
            start_time = time.time()

            # Call Ollama API
            response = await self._call_ollama(full_prompt)

            elapsed_time = time.time() - start_time

            if response["success"]:
                logger.info(f"Response generated in {elapsed_time:.2f}s")
                return {
                    "success": True,
                    "response": response["text"],
                    "time": elapsed_time,
                    "model": self.model,
                }
            else:
                logger.error(f"Ollama error: {response.get('error')}")
                return {
                    "success": False,
                    "error": response.get("error", "Unknown error"),
                }

        except Exception as e:
            logger.error(f"Failed to generate response: {e}")
            return {
                "success": False,
                "error": f"Connection failed: {str(e)}",
            }

    async def _call_ollama(self, prompt: str) -> dict:
        """
        Make actual HTTP call to Ollama

        Returns:
            Dictionary with success flag and response text
        """

        try:
            response = httpx.post(
                f"{self.host}/api/generate",
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False,
                },
                timeout=self.timeout,
            )

            if response.status_code == 200:
                data = response.json()
                return {
                    "success": True,
                    "text": data.get("response", "").strip(),
                }
            else:
                return {
                    "success": False,
                    "error": f"HTTP {response.status_code}",
                }

        except Exception as e:
            return {
                "success": False,
                "error": str(e),
            }

    def close(self):
        """Clean up HTTP client"""
        self.client.close()


# Global instance
_brain_instance: Optional[OllamaBrain] = None


def get_brain(host: str, model: str) -> OllamaBrain:
    """Get or create Ollama brain instance"""
    global _brain_instance

    if _brain_instance is None:
        _brain_instance = OllamaBrain(host=host, model=model)

    return _brain_instance
