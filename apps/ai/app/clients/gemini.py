"""Gemini API client.

Thin wrapper around Google Generative AI SDK.
Handles initialization, rate limits, and error mapping.
"""

import json
import logging
from typing import Any, Optional

from app.config import get_settings

logger = logging.getLogger(__name__)


class GeminiClientError(Exception):
    """Base exception for Gemini client errors."""

    pass


class GeminiClient:
    """Client for Google Gemini API."""

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None) -> None:
        """Initialize with optional overrides. Falls back to settings."""
        settings = get_settings()
        self._api_key = (api_key or settings.gemini_api_key) or ""
        self._model = model or settings.gemini_model
        self._client = None

    @property
    def is_available(self) -> bool:
        """True if client can be used."""
        return bool(self._api_key.strip())

    def _get_client(self) -> Any:
        """Lazy initialization of GenerativeModel."""
        if not self.is_available:
            raise GeminiClientError("GEMINI_API_KEY is not set")
        if self._client is None:
            try:
                import google.generativeai as genai

                genai.configure(api_key=self._api_key)
                self._client = genai.GenerativeModel(self._model)
            except ImportError as e:
                raise GeminiClientError(f"google-generativeai not installed: {e}") from e
        return self._client

    def _build_generation_config(self, overrides: Optional[dict] = None) -> Any:
        """Build GenerationConfig for API compatibility."""
        try:
            from google.generativeai.types import GenerationConfig

            kwargs = {
                "temperature": 0.3,
                "top_p": 0.9,
                "max_output_tokens": 1024,
            }
            if overrides:
                kwargs.update(overrides)
            return GenerationConfig(**kwargs)
        except (ImportError, TypeError):
            return overrides or {
                "temperature": 0.3,
                "top_p": 0.9,
                "max_output_tokens": 1024,
            }

    def generate_json(
        self,
        prompt: str,
        *,
        generation_config: Optional[dict] = None,
    ) -> dict[str, Any]:
        """Generate content and parse as JSON.

        Args:
            prompt: System + user prompt.
            generation_config: Optional override for generation params.

        Returns:
            Parsed JSON object.

        Raises:
            GeminiClientError: On API or parse errors.
        """
        client = self._get_client()
        config = self._build_generation_config(generation_config)

        try:
            response = client.generate_content(
                prompt,
                generation_config=config,
            )
        except Exception as e:
            logger.warning("Gemini API call failed: %s", e)
            raise GeminiClientError(f"Gemini API error: {e}") from e

        text = self._extract_text(response)
        if not text:
            raise GeminiClientError("Empty response from Gemini")

        return self._parse_json(text)

    def _extract_text(self, response: Any) -> str:
        """Extract text from generate_content response."""
        if not response or not response.candidates:
            return ""
        candidate = response.candidates[0]
        if not candidate.content or not candidate.content.parts:
            return ""
        return (candidate.content.parts[0].text or "").strip()

    def _parse_json(self, text: str) -> dict[str, Any]:
        """Parse JSON, handling markdown code blocks."""
        cleaned = text.strip()
        if cleaned.startswith("```"):
            lines = cleaned.split("\n")
            start = 1 if lines[0].startswith("```") else 0
            end = len(lines)
            for i, line in enumerate(lines[1:], 1):
                if line.strip().startswith("```"):
                    end = i
                    break
            cleaned = "\n".join(lines[start:end])
        return json.loads(cleaned)
