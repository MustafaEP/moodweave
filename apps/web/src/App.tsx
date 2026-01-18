import { useState } from 'react';
import { MoodInput } from '@/features/mood-analysis/components/MoodInput';
import { MoodResult } from '@/features/mood-analysis/components/MoodResult';
import { Layout } from '@/shared/components/layout/Layout';
import { Loading } from '@/shared/components/ui/Loading/Loading';
import { endpoints } from '@/shared/lib/api/endpoints';
import type { RecommendResponse } from '@/features/mood-analysis/types/mood.types';

function App() {
  const [result, setResult] = useState<RecommendResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (text: string) => {
    if (!text.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch(endpoints.recommend, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        throw new Error('Analiz sırasında hata oluştu');
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Bir hata oluştu';
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isLoading = loading;

  return (
    <Layout>
      <MoodInput onSubmit={handleAnalyze} loading={isLoading} />
      
      {isLoading && <Loading />}
      
      {error && (
        <div className="error-container">
          <div className="error-message">
            <div className="error-message__icon">⚠️</div>
            <div className="error-message__content">
              <h3 className="error-message__title">Bir Hata Oluştu</h3>
              <p className="error-message__text">{error}</p>
              <button 
                className="error-message__retry"
                onClick={() => setError(null)}
              >
                Tekrar Dene
              </button>
            </div>
          </div>
        </div>
      )}
      
      {result && !isLoading && <MoodResult result={result} />}
    </Layout>
  );
}

export default App;
