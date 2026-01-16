import { useState } from 'react';
import { apiClient } from '@/shared/lib/api/client';
import { endpoints } from '@/shared/lib/api/endpoints';
import type { MusicRecommendationResponse } from '../types/mood.types';

export const useMusicRecommendations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMusic = async (mood: string): Promise<MusicRecommendationResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<MusicRecommendationResponse>(
        endpoints.core.music,
        {
          params: { mood },
        }
      );
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Müzik önerileri alınırken hata oluştu';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchMusic, loading, error };
};

