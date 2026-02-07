"""Gemini API client.

Thin wrapper around Google Gen AI Python SDK (`google-genai`).
Enforces JSON output to prevent parse errors and supports future migration.
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
        self._client = None  # google.genai.Client

    @property
    def is_available(self) -> bool:
        """True if client can be used."""
        return bool(self._api_key.strip())

    def _get_client(self) -> Any:
        """Lazy initialization of google.genai.Client."""
        if not self.is_available:
            raise GeminiClientError("GEMINI_API_KEY is not set")
        if self._client is None:
            try:
                try:
                    # Preferred import style (per official docs)
                    from google import genai  # type: ignore
                except Exception:
                    # Fallback for environments where namespace import differs
                    import google.genai as genai  # type: ignore

                self._client = genai.Client(api_key=self._api_key)  # type: ignore[attr-defined]
            except ImportError as e:
                raise GeminiClientError(f"google-genai not installed: {e}") from e
        return self._client

    def _build_generation_config(self, overrides: Optional[dict] = None) -> Any:
        """Build GenerateContentConfig (google-genai).

        We force JSON output via response_mime_type to avoid invalid JSON.
        """
        # Defaults tuned for classification/structured extraction
        temperature = 0.3
        top_p = 0.9
        max_output_tokens = 1024

        if overrides:
            temperature = float(overrides.get("temperature", temperature))
            top_p = float(overrides.get("top_p", top_p))
            max_output_tokens = int(overrides.get("max_output_tokens", max_output_tokens))

        try:
            try:
                from google.genai import types  # type: ignore
            except Exception:
                # Alternate import style
                import google.genai.types as types  # type: ignore

            return types.GenerateContentConfig(
                temperature=temperature,
                top_p=top_p,
                max_output_tokens=max_output_tokens,
                response_mime_type="application/json",
            )
        except ImportError:
            # Fallback: SDK missing (handled elsewhere), keep a plain dict
            return {
                "temperature": temperature,
                "top_p": top_p,
                "max_output_tokens": max_output_tokens,
                "response_mime_type": "application/json",
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
            # google-genai API
            response = client.models.generate_content(
                model=self._model,
                contents=prompt,
                config=config,
            )
        except Exception as e:
            logger.warning("Gemini API call failed: %s", e)
            raise GeminiClientError(f"Gemini API error: {e}") from e

        text = self._extract_text(response)
        if not text:
            raise GeminiClientError("Empty response from Gemini")

        return self._parse_json(text)

    def _extract_text(self, response: Any) -> str:
        """Extract text/JSON payload from response."""
        # google-genai responses expose `.text` convenience property
        txt = getattr(response, "text", None)
        if isinstance(txt, str):
            return txt.strip()
        return ""

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
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            # Last-resort: try to extract first JSON object boundaries.
            start = cleaned.find("{")
            end = cleaned.rfind("}")
            if start != -1 and end != -1 and end > start:
                return json.loads(cleaned[start : end + 1])
            raise
