def generate_reasoning(text: str, emotion: dict, intents: list[dict]) -> dict:
    parts = []

    # Emotion summary
    v = emotion["valence"]
    a = emotion["arousal"]

    if v < 0.4:
        parts.append("Düşük pozitiflik tespit edildi (olumsuz duygular).")
    elif v > 0.6:
        parts.append("Yüksek pozitiflik tespit edildi (olumlu ruh hali).")
    else:
        parts.append("Nötr bir duygusal durum tespit edildi.")

    if a < 0.4:
        parts.append("Düşük enerji seviyesi gözlemlendi.")
    elif a > 0.6:
        parts.append("Yüksek enerji seviyesi gözlemlendi.")
    else:
        parts.append("Orta düzey bir enerji seviyesi tespit edildi.")

    # Intent reasoning
    intent_lines = []
    for it in intents:
        pct = int(it["weight"] * 100)
        intent_lines.append(f"{it['type']} niyeti %{pct} ağırlıkta.")

    summary = f"Metinde {intents[0]['type']} ağırlıklı bir ruh hali tespit edildi."

    return {
        "summary": summary,
        "details": parts + intent_lines,
    }
