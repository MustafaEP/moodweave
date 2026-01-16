import { useState } from 'react';

type Track = {
  title: string;
  artist: string;
  spotify_url: string;
  image?: string | null;
}

type Result = {
  mood: string;
  confidence: number;
  suggestions?: string[];
  tracks?: Track[];
}

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<Result | null>(null);
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
      
      const musicRes = await fetch('/api/core/music?mood=${data.mood}');
      const musicData = await musicRes.json();

      setResult({
        ...data,
        tracks: musicData.tracks,
      });
    } catch (err) {
      setError('Analiz sırasında hata oluştu');
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
      {result?.tracks && (
        <div style={{ marginTop: 30 }}>
          <h3>Önerilen Şarkılar 🎶</h3>

          <div style={{ display: 'grid', gap: 16 }}>
            {result.tracks.map((track, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: 16,
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  padding: 12,
                }}
              >
                {track.image && (
                  <img
                    src={track.image}
                    alt={track.title}
                    style={{ width: 80, height: 80, borderRadius: 6 }}
                  />
                )}

                <div>
                  <h4 style={{ margin: 0 }}>{track.title}</h4>
                  <p style={{ margin: '4px 0' }}>{track.artist}</p>

                  <a
                    href={track.spotify_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Spotify’da Aç →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


    </div>
  );
}

export default App;
