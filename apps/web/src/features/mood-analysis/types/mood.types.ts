export interface Track {
  title: string;
  artist: string;
  spotify_url: string;
  preview_url?: string;
  image?: string | null;
}

export type Intent = {
  type: string;
  weight: number;
};

export type EmotionSpace = {
  valence: number;
  arousal: number;
  dominance: number;
};

export type Reasoning = {
  summary: string;
  details: string[];
};

export interface Analysis {
  emotion_space: EmotionSpace;
  intents: Intent[];
  dominant_intent: string;
  confidence: number;
  spotify_query: string;
  reasoning: Reasoning;
  source: string;
}

export interface RecommendResponse {
  analysis: Analysis;
  tracks: Track[];
}

/** Engine used for mood analysis */
export type AnalysisEngine = 'gemini' | 'legacy';

// Type aliases for backward compatibility and clearer naming
export type MoodAnalysisResult = Analysis;
export type MusicRecommendationResponse = RecommendResponse;
