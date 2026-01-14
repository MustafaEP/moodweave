from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class MoodRequest(BaseModel):
    text: str

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "ai"
    }

@app.post("/analyze")
def analyze_mood(req: MoodRequest):
    text = req.text.lower()

    if any(word in text for word in ["mutlu", "happy", "iyi", "great"]):
        mood = "happy"
    elif any(word in text for word in ["üzgün", "sad", "kötü", "depressed"]):
        mood = "sad"
    else:
        mood = "neutral"

    return {
        "mood": mood,
        "confidence": 0.6,
        "source": "rule-based-v1"
    }
