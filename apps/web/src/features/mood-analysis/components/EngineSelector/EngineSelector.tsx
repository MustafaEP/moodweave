import type { AnalysisEngine } from '../../types/mood.types';
import './EngineSelector.css';

interface EngineSelectorProps {
  value: AnalysisEngine;
  onChange: (engine: AnalysisEngine) => void;
  disabled?: boolean;
}

const ENGINE_OPTIONS: { value: AnalysisEngine; label: string; description: string }[] = [
  { value: 'gemini', label: 'Gemini AI', description: 'Google\'ın gelişmiş AI modeli' },
  { value: 'legacy', label: 'Klasik', description: 'Kural tabanlı analiz' },
];

export const EngineSelector = ({ value, onChange, disabled }: EngineSelectorProps) => {
  return (
    <fieldset className="engine-selector" aria-label="Analiz motoru seçimi">
      <legend className="engine-selector__legend">Analiz Motoru</legend>
      <div className="engine-selector__options" role="radiogroup">
        {ENGINE_OPTIONS.map((opt) => (
          <label
            key={opt.value}
            className={`engine-selector__option ${value === opt.value ? 'engine-selector__option--active' : ''} ${disabled ? 'engine-selector__option--disabled' : ''}`}
          >
            <input
              type="radio"
              name="analysis-engine"
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              disabled={disabled}
              className="engine-selector__input sr-only"
            />
            <span className="engine-selector__label">{opt.label}</span>
            <span className="engine-selector__description">{opt.description}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
};
