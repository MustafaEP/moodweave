"""Quick script to verify Gemini API key works. Run from project root: python apps/ai/test_gemini.py"""

import os
import sys

# Load .env from project root (apps/ai -> apps -> root)
_env_path = os.path.join(os.path.dirname(__file__), "..", "..", ".env")
if os.path.exists(_env_path):
    with open(_env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ[k.strip()] = v.strip().strip('"').strip("'")

# Add apps/ai to path
sys.path.insert(0, os.path.dirname(__file__))


def main():
    from app.analyzers.registry import run_analysis, get_analyzer

    engine = get_analyzer("gemini")
    if engine != "gemini":
        print("HATA: GEMINI_API_KEY bulunamadi veya gecersiz. Legacy kullanilacak.")
        print("Cozum: .env dosyasinda GEMINI_API_KEY=... oldugundan emin olun.")
        sys.exit(1)

    print("Gemini test ediliyor...")
    result = run_analysis("Bugun cok mutluyum, harika bir gun gecti", engine="gemini")
    src = result.get("source", "")
    if src.startswith("gemini"):
        print("OK: Gemini analizi basarili.")
        print("  source:", src)
        print("  valence:", result.get("emotion_space", {}).get("valence"))
        print("  spotify_query:", result.get("spotify_query", "")[:50] + "...")
    else:
        print("UYARI: Gemini cagrildi ama legacy dondu.")
        print("  source:", src)
        sys.exit(1)


if __name__ == "__main__":
    main()
