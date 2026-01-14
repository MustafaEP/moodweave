import { useState } from 'react';

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<null | {
    mood: string;
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
    <div style={{ maxWidth: 600, margin: '50px auto', fontFamily: 'Arial' }}>
      <h1>MoodWeave 🎧</h1>

      <textarea
        rows={4}
        style={{ width: '100%', padding: 10 }}
        placeholder="Bugün nasıl hissediyorsun?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={analyzeMood}
        disabled={!text || loading}
        style={{ marginTop: 10, padding: '10px 20px' }}
      >
        {loading ? 'Analiz ediliyor...' : 'Analiz Et'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>Sonuç</h3>
          <p>
            Ruh Hali: <strong>{result.mood}</strong>
          </p>
          <p>Güven: %{Math.round(result.confidence * 100)}</p>
        </div>
      )}
    </div>
  );
}

export default App;
