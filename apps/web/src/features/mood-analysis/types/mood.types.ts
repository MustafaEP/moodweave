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

export interface Analysis {
  dominant_mood: string;
  music_intent: string;
  energy_level: string;
  valence: number;
  confidence: number;
  spotify_query: string;
}

export interface RecommendResponse {
  analysis: Analysis;
  tracks: Track[];
}
