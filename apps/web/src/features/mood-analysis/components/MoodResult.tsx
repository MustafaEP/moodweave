import type { RecommendResponse } from '../types/mood.types';
import { formatConfidence } from '@/shared/lib/utils/format';
import { TrackList } from './TrackList';
import './MoodResult.css';

interface MoodResultProps {
  result: RecommendResponse;
}

const getEmotionEmoji = (intent: string) => {
  const emojiMap: Record<string, string> = {
    'joy': '😊',
    'happy': '😄',
    'sad': '😢',
    'angry': '😠',
    'fear': '😨',
    'love': '❤️',
    'surprise': '😲',
    'excited': '🤩',
    'calm': '😌',
    'energetic': '⚡',
    'melancholy': '🌧️',
    'peaceful': '☮️',
  };
  return emojiMap[intent.toLowerCase()] || '🎵';
};

const getValenceColor = (value: number) => {
  if (value > 0.6) return 'positive';
  if (value < 0.4) return 'negative';
  return 'neutral';
};

const getArousalColor = (value: number) => {
  if (value > 0.6) return 'high';
  if (value < 0.4) return 'low';
  return 'medium';
};

export const MoodResult = ({ result }: MoodResultProps) => {
  const { analysis, tracks } = result;
  const emoji = getEmotionEmoji(analysis.dominant_intent);

  return (
    <div className="mood-result">
      <div className="mood-result__header">
        <div className="mood-result__emoji-container">
          <span className="mood-result__emoji">{emoji}</span>
        </div>
        <h2 className="mood-result__title">Analiz Tamamlandı!</h2>
        <div className="mood-result__mood">
          <span className="mood-result__mood-label">Ruh Haliniz:</span>
          <span className="mood-result__mood-value">{analysis.dominant_intent}</span>
        </div>
        <div className="mood-result__meta">
          <div className="mood-result__confidence">
            <span className="mood-result__meta-icon">📊</span>
            <span>Güven: <strong>{formatConfidence(analysis.confidence)}</strong></span>
          </div>
          {analysis.source && (
            <div className="mood-result__source">
              <span className="mood-result__meta-icon">🔍</span>
              <span>Kaynak: <strong>{analysis.source}</strong></span>
            </div>
          )}
        </div>
      </div>

      <div className="mood-result__details">
        <h3 className="mood-result__section-title">
          <span>💫</span>
          Duygu Analizi
        </h3>
        
        <div className="mood-result__emotion-grid">
          <div className="mood-result__emotion-card">
            <div className="mood-result__emotion-icon">😊</div>
            <div className="mood-result__emotion-content">
              <span className="mood-result__emotion-label">Valence</span>
              <span className="mood-result__emotion-sublabel">(Pozitiflik)</span>
              <div className={`mood-result__emotion-bar mood-result__emotion-bar--${getValenceColor(analysis.emotion_space.valence)}`}>
                <div 
                  className="mood-result__emotion-fill"
                  style={{ width: `${analysis.emotion_space.valence * 100}%` }}
                />
              </div>
              <span className="mood-result__emotion-value">
                {(analysis.emotion_space.valence * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          <div className="mood-result__emotion-card">
            <div className="mood-result__emotion-icon">⚡</div>
            <div className="mood-result__emotion-content">
              <span className="mood-result__emotion-label">Arousal</span>
              <span className="mood-result__emotion-sublabel">(Enerji)</span>
              <div className={`mood-result__emotion-bar mood-result__emotion-bar--${getArousalColor(analysis.emotion_space.arousal)}`}>
                <div 
                  className="mood-result__emotion-fill"
                  style={{ width: `${analysis.emotion_space.arousal * 100}%` }}
                />
              </div>
              <span className="mood-result__emotion-value">
                {(analysis.emotion_space.arousal * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          <div className="mood-result__emotion-card">
            <div className="mood-result__emotion-icon">💪</div>
            <div className="mood-result__emotion-content">
              <span className="mood-result__emotion-label">Dominance</span>
              <span className="mood-result__emotion-sublabel">(Kontrol)</span>
              <div className="mood-result__emotion-bar mood-result__emotion-bar--neutral">
                <div 
                  className="mood-result__emotion-fill"
                  style={{ width: `${analysis.emotion_space.dominance * 100}%` }}
                />
              </div>
              <span className="mood-result__emotion-value">
                {(analysis.emotion_space.dominance * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {analysis.reasoning && (
          <div className="mood-result__reasoning-section">
            <h4 className="mood-result__reasoning-title">
              <span>🤖</span>
              AI Açıklaması
            </h4>
            <div className="mood-result__reasoning-content">
              <p className="mood-result__reasoning-summary">
                {analysis.reasoning.summary}
              </p>
              {analysis.reasoning.details && analysis.reasoning.details.length > 0 && (
                <ul className="mood-result__reasoning-details">
                  {analysis.reasoning.details.map((detail, index) => (
                    <li key={index} className="mood-result__reasoning-detail">
                      {detail}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {analysis.intents && analysis.intents.length > 0 && (
          <div className="mood-result__intents-section">
            <h4 className="mood-result__intents-title">
              <span>🎯</span>
              Tespit Edilen Duygular
            </h4>
            <div className="mood-result__intents">
              {analysis.intents.map((intent, index) => (
                <div key={index} className="mood-result__intent-item">
                  <span className="mood-result__intent-type">{intent.type}</span>
                  <div className="mood-result__intent-bar">
                    <div 
                      className="mood-result__intent-fill"
                      style={{ width: `${intent.weight * 100}%` }}
                    />
                  </div>
                  <span className="mood-result__intent-weight">
                    {(intent.weight * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {tracks && tracks.length > 0 && (
        <TrackList tracks={tracks} />
      )}
    </div>
  );
};

