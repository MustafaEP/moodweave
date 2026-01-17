from typing import List, Dict

def energy_tags(arousal: float) -> List[str]:
    if arousal >= 0.67:
        return ["upbeat", "high energy"]
    if arousal <= 0.33:
        return ["calm", "low energy"]
    return ["mid tempo"]

def valence_tags(valence: float) -> List[str]:
    if valence >= 0.67:
        return ["feel good", "bright"]
    if valence <= 0.33:
        return ["moody", "melancholic"]
    return ["chill"]

def compose_spotify_query(intent_keywords: List[str], emotion_space: Dict) -> str:
    v = float(emotion_space["valence"])
    a = float(emotion_space["arousal"])

    tags = []
    tags += energy_tags(a)
    tags += valence_tags(v)

    # kısa, etkili query: intent keywords + 2-3 duygu tag'i
    query_parts = intent_keywords[:4] + tags[:3]
    return " ".join(query_parts).strip()
