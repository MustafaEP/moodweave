import re

WINDOW = 3 # Kaç kelime yakına bakılacak

# Basit ama genişletilebilir sözlükler (TR + EN karışık destek)
POS = ["mutlu", "iyi", "harika", "keyif", "heyecan", "sevin", "great", "happy", "awesome", "good"]
NEG = ["üzgün", "kötü", "stres", "kaygı", "anksiyete", "bunald", "yorgun", "depres", "sad", "anxious", "tired"]

AROUSAL_UP = ["çok", "aşırı", "fazla", "gerçekten", "inanılmaz", "coşku", "heyecan", "panik", "sinir", "excited"]
AROUSAL_DOWN = ["sakin", "rahat", "yavaş", "huzur", "dingin", "calm", "relaxed", "quiet"]

DOM_UP = ["kontrol", "güçlü", "hazırım", "yaparım", "kararlı", "confident", "strong", "determined"]
DOM_DOWN = ["çaresiz", "kayıp", "bıkkın", "yetişemiyorum", "zor", "helpless", "overwhelmed"]

NEGATIONS = ["değil", "degil", "not", "isn't", "aren't", "don't", "cant", "can't"]

INTENSIFIERS = ["çok", "aşırı", "fazla", "gerçekten", "inanılmaz"]
DOWNPLAYERS = ["biraz", "az", "pek", "çok da değil"]


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
    negation = has_local_negation(t, POS)

    # Valence: (pos - neg) normalize -> [0..1]
    raw = pos - neg
    # soft normalize: -4..+4 aralığı varsayımı
    valence = (raw + 4) / 8
    valence = max(0.0, min(1.0, valence))
    if negation:
        valence = max(0.0, valence - 0.25)

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

    mult = intensity_multiplier(t)

    valence = max(0.0, min(1.0, valence * mult))
    arousal = max(0.0, min(1.0, arousal * mult))

    return {
        "valence": round(valence, 2),
        "arousal": round(arousal, 2),
        "dominance": round(dominance, 2),
        "confidence": round(confidence, 2),
    }


def has_local_negation(text: str, target_word: list[str]) -> bool:
    tokens = text.lower().split()
    for i, tok in enumerate(tokens):
        for w in target_word:
            if w in tok:
                start = max(0, i - WINDOW)
                end = min(len(tokens), i + WINDOW + 1)
                window = tokens[start:end]
                if any(n in window for n in NEGATIONS):
                    return True
    return False


def intensity_multiplier(text: str) -> float:
    t = text.lower()
    if any(w in t for w in INTENSIFIERS):
        return 1.25
    if any(w in t for w in DOWNPLAYERS):
        return 0.75
    return 1.0
