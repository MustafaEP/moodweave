"""Analyzer registry and routing.

Routes analysis requests to the correct engine.
"""

import logging
from typing import Literal

from app.analyzer import analyze as legacy_analyze
from app.analyzers.gemini import analyze_with_gemini
from app.config import get_settings

logger = logging.getLogger(__name__)

EngineType = Literal["gemini", "legacy"]


def get_analyzer(engine: str | None = None) -> EngineType:
    """Resolve which engine to use.

    - engine='gemini' -> gemini (if key available)
    - engine='legacy' -> legacy
    - engine=None -> default from settings (gemini if available, else legacy)
    """
    settings = get_settings()
    resolved = (engine or settings.default_engine or "gemini").strip().lower()

    if resolved == "legacy":
        return "legacy"

    if resolved == "gemini" and settings.gemini_available:
        return "gemini"

    # Fallback: gemini requested but not available
    if resolved == "gemini":
        logger.info("Gemini requested but GEMINI_API_KEY not set, falling back to legacy")
        return "legacy"

    return "legacy"


def run_analysis(text: str, engine: str | None = None) -> dict:
    """Run mood analysis with the appropriate engine.

    Args:
        text: User input text.
        engine: 'gemini' | 'legacy' | None (uses default).

    Returns:
        Analysis dict compatible with existing API contract.
    """
    chosen = get_analyzer(engine)

    if chosen == "gemini":
        try:
            return analyze_with_gemini(text)
        except Exception as e:
            logger.warning("Gemini analysis failed, falling back to legacy: %s", e)
            return legacy_analyze(text)

    return legacy_analyze(text)
