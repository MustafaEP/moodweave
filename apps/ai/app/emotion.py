import re

# Basit ama genişletilebilir sözlükler (TR + EN karışık destek)
POS = ["mutlu", "iyi", "harika", "keyif", "heyecan", "sevin", "great", "happy", "awesome", "good"]
NEG = ["üzgün", "kötü", "stres", "kaygı", "anksiyete", "bunald", "yorgun", "depres", "sad", "anxious", "tired"]

AROUSAL_UP = ["çok", "aşırı", "fazla", "gerçekten", "inanılmaz", "coşku", "heyecan", "panik", "sinir", "excited"]
AROUSAL_DOWN = ["sakin", "rahat", "yavaş", "huzur", "dingin", "calm", "relaxed", "quiet"]

DOM_UP = ["kontrol", "güçlü", "hazırım", "yaparım", "kararlı", "confident", "strong", "determined"]
DOM_DOWN = ["çaresiz", "kayıp", "bıkkın", "yetişemiyorum", "zor", "helpless", "overwhelmed"]

NEGATIONS = ["değil", "degil", "not", "isn't", "aren't", "don't", "cant", "can't"]


def _count_hits(text: str, words: list[str]) -> int:
    t = text.lower()
    return sum(1 for w in words if w in t)


def _has_negation_near(text: str) -> bool:
    # çok basit: "mutlu değil", "good not" gibi
    t = text.lower()
    for n in NEGATIONS:
        if n in t:
            return True
    return False


def score_emotion_space(text: str) -> dict:
    t = text.lower()

    pos = _count_hits(t, POS)
    neg = _count_hits(t, NEG)

    # Negation varsa valence'ı biraz kır
    negation = _has_negation_near(t)

    # Valence: (pos - neg) normalize -> [0..1]
    raw = pos - neg
    # soft normalize: -4..+4 aralığı varsayımı
    valence = (raw + 4) / 8
    valence = max(0.0, min(1.0, valence))
    if negation:
        valence = max(0.0, valence - 0.15)

    # Arousal: up - down normalize -> [0..1]
    a_up = _count_hits(t, AROUSAL_UP)
    a_down = _count_hits(t, AROUSAL_DOWN)
    a_raw = a_up - a_down
    arousal = (a_raw + 3) / 6
    arousal = max(0.0, min(1.0, arousal))

    # Dominance: up - down normalize -> [0..1]
    d_up = _count_hits(t, DOM_UP)
    d_down = _count_hits(t, DOM_DOWN)
    d_raw = d_up - d_down
    dominance = (d_raw + 3) / 6
    dominance = max(0.0, min(1.0, dominance))

    # Confidence: sinyal yoğunluğu + duygusal netlik
    signal = min(1.0, (pos + neg + a_up + a_down + d_up + d_down) / 8)
    clarity = min(1.0, abs(valence - 0.5) * 2)  # 0..1
    confidence = 0.45 + 0.35 * clarity + 0.20 * signal
    confidence = max(0.0, min(1.0, confidence))

    return {
        "valence": round(valence, 2),
        "arousal": round(arousal, 2),
        "dominance": round(dominance, 2),
        "confidence": round(confidence, 2),
    }
