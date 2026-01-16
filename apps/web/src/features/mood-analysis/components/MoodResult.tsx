import type { MoodAnalysisResult } from '../types/mood.types';
import { formatConfidence } from '@/shared/lib/utils/format';
import { TrackList } from './TrackList';
import './MoodResult.css';

interface MoodResultProps {
  result: MoodAnalysisResult;
}

export const MoodResult = ({ result }: MoodResultProps) => {
  return (
    <div className="mood-result">
      <div className="mood-result__header">
        <h2 className="mood-result__title">Analiz Sonucu</h2>
        <div className="mood-result__mood">
          <span className="mood-result__mood-label">Ruh Hali:</span>
          <span className="mood-result__mood-value">{result.mood}</span>
        </div>
        <div className="mood-result__confidence">
          Güven: <strong>{formatConfidence(result.confidence)}</strong>
        </div>
      </div>

      {result.suggestions && result.suggestions.length > 0 && (
        <div className="mood-result__suggestions">
          <h3 className="mood-result__suggestions-title">Önerilen Müzik Türleri</h3>
          <ul className="mood-result__suggestions-list">
            {result.suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}

      {result.tracks && result.tracks.length > 0 && (
        <TrackList tracks={result.tracks} />
      )}
    </div>
  );
};

