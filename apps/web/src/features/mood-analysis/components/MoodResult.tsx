import type { RecommendResponse } from '../types/mood.types';
import { formatConfidence } from '@/shared/lib/utils/format';
import { TrackList } from './TrackList';
import './MoodResult.css';

interface MoodResultProps {
  result: RecommendResponse;
}

export const MoodResult = ({ result }: MoodResultProps) => {
  const { analysis, tracks } = result;

  return (
    <div className="mood-result">
      <div className="mood-result__header">
        <h2 className="mood-result__title">Analiz Sonucu</h2>
        <div className="mood-result__mood">
          <span className="mood-result__mood-label">Baskın Niyet:</span>
          <span className="mood-result__mood-value">{analysis.dominant_intent}</span>
        </div>
        <div className="mood-result__confidence">
          Güven: <strong>{formatConfidence(analysis.confidence)}</strong>
        </div>
        {analysis.source && (
          <div className="mood-result__source">
            Kaynak: <strong>{analysis.source}</strong>
          </div>
        )}
      </div>

      <div className="mood-result__details">
        <div className="mood-result__detail-section">
          <h3 className="mood-result__detail-section-title">Duygu Uzayı</h3>
          <div className="mood-result__detail-item">
            <span className="mood-result__detail-label">Valence:</span>
            <span className="mood-result__detail-value">{analysis.emotion_space.valence.toFixed(2)}</span>
          </div>
          <div className="mood-result__detail-item">
            <span className="mood-result__detail-label">Arousal:</span>
            <span className="mood-result__detail-value">{analysis.emotion_space.arousal.toFixed(2)}</span>
          </div>
          <div className="mood-result__detail-item">
            <span className="mood-result__detail-label">Dominance:</span>
            <span className="mood-result__detail-value">{analysis.emotion_space.dominance.toFixed(2)}</span>
          </div>
        </div>

        {analysis.intents && analysis.intents.length > 0 && (
          <div className="mood-result__detail-section">
            <h3 className="mood-result__detail-section-title">Niyetler</h3>
            <div className="mood-result__intents">
              {analysis.intents.map((intent, index) => (
                <div key={index} className="mood-result__intent-item">
                  <span className="mood-result__intent-type">{intent.type}</span>
                  <span className="mood-result__intent-weight">({(intent.weight * 100).toFixed(1)}%)</span>
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

