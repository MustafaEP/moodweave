import { useState } from 'react';
import { useMoodAnalysis } from '@/features/mood-analysis/hooks/useMoodAnalysis';
import { useMusicRecommendations } from '@/features/mood-analysis/hooks/useMusicRecommendations';
import { MoodInput } from '@/features/mood-analysis/components/MoodInput';
import { MoodResult } from '@/features/mood-analysis/components/MoodResult';
import { Layout } from '@/shared/components/layout/Layout';
import { Loading } from '@/shared/components/ui/Loading/Loading';
import type { MoodAnalysisResult } from '@/features/mood-analysis/types/mood.types';

function App() {
  const [result, setResult] = useState<MoodAnalysisResult | null>(null);
  const { analyzeMood, loading: analysisLoading, error: analysisError } = useMoodAnalysis();
  const { fetchMusic, loading: musicLoading } = useMusicRecommendations();

  const handleAnalyze = async (text: string) => {
    const analysisResult = await analyzeMood(text);
    if (analysisResult) {
      const musicResult = await fetchMusic(analysisResult.mood);
      setResult({
        ...analysisResult,
        tracks: musicResult?.tracks,
      });
    }
  };

  const isLoading = analysisLoading || musicLoading;

  return (
    <Layout>
      <MoodInput onSubmit={handleAnalyze} loading={isLoading} />
      
      {isLoading && <Loading />}
      
      {analysisError && (
        <div className="alert alert-danger error-container">
          {analysisError}
        </div>
      )}
      
      {result && !isLoading && <MoodResult result={result} />}
    </Layout>
  );
}

export default App;
