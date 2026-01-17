from app.emotion import score_emotion_space
from app.intents import extract_intents, keywords_for_intents
from app.composer import compose_spotify_query

def analyze(text: str) -> dict:
    emotion = score_emotion_space(text)
    intent_pack = extract_intents(text, top_k=2)
    intents = intent_pack["intents"]
    dominant_intent = intent_pack["dominant_intent"]

    intent_keywords = keywords_for_intents(intents)
    spotify_query = compose_spotify_query(intent_keywords, emotion)

    # genel confidence: emotion confidence * intent netliği
    intent_clarity = intents[0]["weight"] if intents else 0.5
    confidence = round(min(1.0, (emotion["confidence"] * 0.7 + intent_clarity * 0.3)), 2)

    return {
        "emotion_space": {
            "valence": emotion["valence"],
            "arousal": emotion["arousal"],
            "dominance": emotion["dominance"],
        },
        "intents": intents,
        "dominant_intent": dominant_intent,
        "confidence": confidence,
        "spotify_query": spotify_query,
        "source": "emotion-multiintent-v1",
    }
