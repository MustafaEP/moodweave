from fastapi import FastAPI
from pydantic import BaseModel
from app.analyzer import analyze

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
    return analyze(req.text)
