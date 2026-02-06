"""Gemini-based mood analyzer.

Uses Gemini 2.x Flash for full mood analysis in a single call.
Output schema matches legacy analyzer for API compatibility.
"""

import logging
from typing import Any

from app.clients.gemini import GeminiClient, GeminiClientError

logger = logging.getLogger(__name__)

VALID_INTENTS = frozenset({
    "calm_down",
    "focus",
    "motivation",
    "comfort",
    "celebration",
    "escape",
})

SYSTEM_PROMPT = """Sen bir ruh hali analiz sistemisin. Kullanıcının Türkçe veya İngilizce yazdığı metni analiz et.

Kurallar:
- valence: 0 (olumsuz/üzgün) ile 1 (olumlu/mutlu) arası
- arousal: 0 (sakin/düşük enerji) ile 1 (heyecanlı/yüksek enerji) arası
- dominance: 0 (çaresiz) ile 1 (güçlü/kontrol) arası
- intents sadece şunlardan olabilir: calm_down, focus, motivation, comfort, celebration, escape
- dominant_intent, intents içindeki en yüksek ağırlıklı olan
- spotify_query: Müzik araması için İngilizce anahtar kelimeler (örn: calm ambient soft)
- reasoning.summary: 1-2 cümle özet
- reasoning.details: Madde madde kısa açıklamalar

Yanıtı SADECE geçerli JSON olarak ver, başka metin ekleme."""

USER_PROMPT_TEMPLATE = """Aşağıdaki metni analiz et ve JSON döndür:

---
{text}
---

Format (tam olarak bu yapıda):
{{
  "emotion_space": {{ "valence": 0.0-1.0, "arousal": 0.0-1.0, "dominance": 0.0-1.0 }},
  "intents": [{{ "type": "calm_down|focus|motivation|comfort|celebration|escape", "weight": 0.0-1.0 }}],
  "dominant_intent": "string",
  "confidence": 0.0-1.0,
  "reasoning": {{ "summary": "string", "details": ["string", ...] }},
  "spotify_query": "english keywords for music search"
}}

intents en fazla 2 öğe, ağırlıklar toplamı 1.0 olmalı."""


def _clamp(value: float, lo: float = 0.0, hi: float = 1.0) -> float:
    return max(lo, min(hi, float(value)))


def _validate_and_normalize(raw: dict[str, Any]) -> dict[str, Any]:
    """Ensure output matches expected schema and valid ranges."""
    es = raw.get("emotion_space") or {}
    valence = _clamp(float(es.get("valence", 0.5)))
    arousal = _clamp(float(es.get("arousal", 0.5)))
    dominance = _clamp(float(es.get("dominance", 0.5)))

    intents_raw = raw.get("intents") or [{"type": "escape", "weight": 1.0}]
    intents = []
    for it in intents_raw[:2]:
        t = str(it.get("type", "escape")).strip().lower()
        if t not in VALID_INTENTS:
            t = "escape"
        w = _clamp(float(it.get("weight", 0.5)))
        intents.append({"type": t, "weight": round(w, 2)})

    if intents:
        total = sum(i["weight"] for i in intents)
        if total > 0:
            intents = [{"type": i["type"], "weight": round(i["weight"] / total, 2)} for i in intents]
            diff = 1.0 - sum(i["weight"] for i in intents)
            intents[0]["weight"] = round(intents[0]["weight"] + diff, 2)

    dominant_intent = str(raw.get("dominant_intent", intents[0]["type"] if intents else "escape"))
    if dominant_intent not in VALID_INTENTS:
        dominant_intent = intents[0]["type"] if intents else "escape"

    reasoning = raw.get("reasoning") or {}
    summary = str(reasoning.get("summary", "Analiz tamamlandı.")).strip() or "Analiz tamamlandı."
    details = reasoning.get("details") or []
    if isinstance(details, list):
        details = [str(d).strip() for d in details if d]
    else:
        details = []

    spotify_query = str(raw.get("spotify_query", "chill")).strip() or "chill"
    confidence = _clamp(float(raw.get("confidence", 0.8)))

    return {
        "emotion_space": {
            "valence": round(valence, 2),
            "arousal": round(arousal, 2),
            "dominance": round(dominance, 2),
        },
        "intents": intents,
        "dominant_intent": dominant_intent,
        "confidence": round(confidence, 2),
        "reasoning": {
            "summary": summary,
            "details": details,
        },
        "spotify_query": spotify_query,
        "source": "gemini-2.x-flash",
    }


def analyze_with_gemini(text: str) -> dict[str, Any]:
    """Run full mood analysis using Gemini.

    Args:
        text: User input.

    Returns:
        Analysis dict compatible with legacy output.

    Raises:
        GeminiClientError: When API call fails.
    """
    client = GeminiClient()
    if not client.is_available:
        raise GeminiClientError("GEMINI_API_KEY is not configured")

    prompt = f"{SYSTEM_PROMPT}\n\n{USER_PROMPT_TEMPLATE.format(text=text)}"

    raw = client.generate_json(prompt)
    return _validate_and_normalize(raw)
