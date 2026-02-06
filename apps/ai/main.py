"""AI service entrypoint.

Exposes mood analysis endpoints. Supports multiple engines (gemini, legacy).
"""

from fastapi import FastAPI
from pydantic import BaseModel, Field

from app.analyzers.registry import run_analysis

app = FastAPI()


class MoodRequest(BaseModel):
    """Request body for mood analysis."""

    text: str = Field(..., min_length=1, max_length=2000)
    engine: str | None = Field(default=None, description="gemini | legacy. Default: gemini")


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "ai",
    }


@app.post("/analyze")
def analyze_mood(req: MoodRequest):
    """Run mood analysis with the requested engine."""
    return run_analysis(req.text, engine=req.engine)
