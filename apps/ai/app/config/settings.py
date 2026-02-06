"""Centralized configuration for AI service.

Loads environment variables and provides typed access.
"""

import os
from functools import lru_cache
from typing import Optional


@lru_cache(maxsize=1)
def get_settings() -> "Settings":
    """Return cached settings instance."""
    return Settings()


class Settings:
    """Application settings loaded from environment."""

    def __init__(self) -> None:
        self._gemini_api_key: Optional[str] = os.environ.get("GEMINI_API_KEY") or None
        self._gemini_model: str = os.environ.get("GEMINI_MODEL", "gemini-1.5-flash")
        self._default_engine: str = os.environ.get("DEFAULT_ANALYSIS_ENGINE", "gemini")

    @property
    def gemini_api_key(self) -> Optional[str]:
        """Gemini API key. None if not set."""
        key = (self._gemini_api_key or "").strip()
        return key if key else None

    @property
    def gemini_model(self) -> str:
        """Gemini model identifier."""
        return self._gemini_model

    @property
    def default_engine(self) -> str:
        """Default analysis engine when not specified."""
        return self._default_engine

    @property
    def gemini_available(self) -> bool:
        """True if Gemini API is configured and usable."""
        return self.gemini_api_key is not None
