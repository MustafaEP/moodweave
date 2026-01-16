export interface Track {
  title: string;
  artist: string;
  spotify_url: string;
  image?: string | null;
}

export interface MoodAnalysisResult {
  mood: string;
  confidence: number;
  suggestions?: string[];
  tracks?: Track[];
}

export interface MusicRecommendationResponse {
  tracks: Track[];
}

