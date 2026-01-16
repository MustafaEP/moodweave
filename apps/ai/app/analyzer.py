import re

POSITIVE_WORDS = ["mutlu", "iyi", "harika", "keyifli", "heyecanlı", "güzel"]
NEGATIVE_WORDS = ["üzgün", "kötü", "stres", "yorgun", "bıkkın", "kaygılı"]

INTENT_KEYWORDS = {
    "calm_down": ["sakin", "rahat", "stres", "nefes", "bunaldım"],
    "focus": ["odak", "çalış", "ders", "konsantrasyon"],
    "motivation": ["gaz", "motivasyon", "enerji", "kalkmam lazım"],
    "comfort": ["yalnız", "teselli", "üzgün", "moral"],
    "celebration": ["kutla", "eğlen", "parti", "dans"],
}

ENERGY_LOW = ["yorgun", "bitkin", "sakin"]
ENERGY_HIGH = ["enerjik", "coşkulu", "heyecanlı", "gaz"]


def analyze_text(text: str):
    text_l = text.lower()

    # Valence
    pos = sum(1 for w in POSITIVE_WORDS if w in text_l)
    neg = sum(1 for w in NEGATIVE_WORDS if w in text_l)
    total = pos + neg if pos + neg > 0 else 1
    valence = max(0.0, min(1.0, pos / total))

    # Energy
    if any(w in text_l for w in ENERGY_HIGH):
        energy = "high"
    elif any(w in text_l for w in ENERGY_LOW):
        energy = "low"
    else:
        energy = "medium"

    # Intent
    intent = "escape"
    for key, words in INTENT_KEYWORDS.items():
        if any(w in text_l for w in words):
            intent = key
            break

    # Dominant mood
    if valence > 0.6:
        mood = "happy"
    elif valence < 0.4:
        mood = "sad"
    else:
        mood = "neutral"

    # Spotify query
    keywords = []
    if intent == "calm_down":
        keywords = ["calm", "ambient", "lofi", "soft"]
    elif intent == "focus":
        keywords = ["focus", "instrumental", "lofi"]
    elif intent == "motivation":
        keywords = ["energetic", "pop", "dance"]
    elif intent == "comfort":
        keywords = ["acoustic", "soft", "emotional"]
    elif intent == "celebration":
        keywords = ["party", "dance", "happy"]
    else:
        keywords = ["chill", "lofi"]

    spotify_query = " ".join(keywords)

    return {
        "dominant_mood": mood,
        "music_intent": intent,
        "energy_level": energy,
        "valence": round(valence, 2),
        "confidence": round(abs(valence - 0.5) + 0.5, 2),
        "keywords": keywords,
        "spotify_query": spotify_query,
        "source": "music-aware-v1",
    }
