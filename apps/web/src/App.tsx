import { useState } from 'react';

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<null | {
    mood: string;
    suggestions: string[];
    confidence: number;
  }>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeMood = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        throw new Error('API error');
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError('Analiz sırasında hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>MoodWeave</h1>

      <textarea
        rows={4}
        placeholder="Bugün nasıl hissediyorsun?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={analyzeMood}
        disabled={!text || loading}
      >
        {loading ? 'Analiz ediliyor...' : 'Analiz Et'}
      </button>

      {error && <p>{error}</p>}

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>Sonuç</h3>
          <p>
            Ruh Hali: <strong>{result.mood}</strong>
          </p>
          <p>Güven: %{Math.round(result.confidence * 100)}</p>

          {result.suggestions && (
            <>
              <h4>Önerilen Müzik Türleri</h4>
              <ul>
                {result.suggestions.map((s: string) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

    </div>
  );
}

export default App;
