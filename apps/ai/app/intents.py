from typing import Dict, List

INTENT_MAP: Dict[str, List[str]] = {
    "calm_down": ["sakin", "rahat", "stres", "nefes", "bunald", "calm", "relax", "chill"],
    "focus": ["odak", "çalış", "ders", "konsantrasyon", "focus", "study", "work"],
    "motivation": ["gaz", "motivasyon", "enerji", "hadi", "motivate", "pump", "energy"],
    "comfort": ["teselli", "yalnız", "moral", "üzgün", "comfort", "hug", "lonely"],
    "celebration": ["kutla", "parti", "dans", "eğlen", "celebrate", "party", "dance"],
    "escape": ["kafa dağıt", "unut", "kaç", "escape", "distract"],
}

BASE_KEYWORDS: Dict[str, List[str]] = {
    "calm_down": ["calm", "ambient", "soft", "lofi"],
    "focus": ["focus", "instrumental", "lofi"],
    "motivation": ["energetic", "pop", "dance"],
    "comfort": ["acoustic", "soft", "emotional"],
    "celebration": ["party", "dance", "happy"],
    "escape": ["chill", "lofi"],
}


def _score_intent(text: str, words: List[str]) -> float:
    t = text.lower()
    hits = sum(1 for w in words if w in t)
    return float(hits)


def extract_intents(text: str, top_k: int = 2) -> dict:
    scores = {k: _score_intent(text, v) for k, v in INTENT_MAP.items()}

    # fallback: hiç hit yoksa escape
    if max(scores.values()) == 0:
        intents = [{"type": "escape", "weight": 1.0}]
        return {"intents": intents, "dominant_intent": "escape"}

    # top_k seç
    ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    top = [(k, s) for k, s in ranked if s > 0][:top_k]

    total = sum(s for _, s in top)
    intents = [{"type": k, "weight": round(s / total, 2)} for k, s in top]
    dominant = intents[0]["type"]

    # ağırlıkların 1'e tamlanması için küçük düzeltme
    if len(intents) > 1:
        wsum = sum(i["weight"] for i in intents)
        diff = round(1.0 - wsum, 2)
        intents[0]["weight"] = round(intents[0]["weight"] + diff, 2)

    return {"intents": intents, "dominant_intent": dominant}


def keywords_for_intents(intents: List[dict]) -> List[str]:
    keys: List[str] = []
    for it in intents:
        k = it["type"]
        keys.extend(BASE_KEYWORDS.get(k, []))
    # unique preserve order
    seen = set()
    out = []
    for k in keys:
        if k not in seen:
            seen.add(k)
            out.append(k)
    return out
