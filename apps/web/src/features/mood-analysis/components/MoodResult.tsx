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
          <span className="mood-result__mood-label">Ruh Hali:</span>
          <span className="mood-result__mood-value">{analysis.dominant_mood}</span>
        </div>
        <div className="mood-result__confidence">
          Güven: <strong>{formatConfidence(analysis.confidence)}</strong>
        </div>
      </div>

      <div className="mood-result__details">
        <div className="mood-result__detail-item">
          <span className="mood-result__detail-label">Müzik Amacı:</span>
          <span className="mood-result__detail-value">{analysis.music_intent}</span>
        </div>
        <div className="mood-result__detail-item">
          <span className="mood-result__detail-label">Enerji Seviyesi:</span>
          <span className="mood-result__detail-value">{analysis.energy_level}</span>
        </div>
        <div className="mood-result__detail-item">
          <span className="mood-result__detail-label">Valence:</span>
          <span className="mood-result__detail-value">{analysis.valence}</span>
        </div>
      </div>

      {tracks && tracks.length > 0 && (
        <TrackList tracks={tracks} />
      )}
    </div>
  );
};

