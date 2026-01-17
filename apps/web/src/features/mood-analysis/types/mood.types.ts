export interface Track {
  title: string;
  artist: string;
  spotify_url: string;
  image?: string | null;
}

//Inactive
export interface MoodAnalysisResult {
  mood: string;
  confidence: number;
  suggestions?: string[];
  tracks?: Track[];
}

//Inactive
export interface MusicRecommendationResponse {
  tracks: Track[];
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

export interface Analysis {
  emotion_space: EmotionSpace;
  intents: Intent[];
  dominant_intent: string;
  confidence: number;
  spotify_query: string;
  source: string;
}

export interface RecommendResponse {
  analysis: Analysis;
  tracks: Track[];
}
