import { useState } from 'react';
import { apiClient } from '@/shared/lib/api/client';
import { endpoints } from '@/shared/lib/api/endpoints';
import type { MoodAnalysisResult } from '../types/mood.types';

export const useMoodAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeMood = async (text: string): Promise<MoodAnalysisResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<MoodAnalysisResult>(
        endpoints.ai.analyze,
        { text }
      );
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Analiz sırasında hata oluştu';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { analyzeMood, loading, error };
};

