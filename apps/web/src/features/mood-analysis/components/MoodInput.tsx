import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { Button } from '@/shared/components/ui/Button/Button';
import { validateText } from '@/shared/lib/utils/validation';
import './MoodInput.css';

interface MoodInputProps {
  onSubmit: (text: string) => void;
  loading?: boolean;
}

export const MoodInput = ({ onSubmit, loading }: MoodInputProps) => {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  const minChars = 10;
  const maxChars = 500;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateText(text, minChars)) {
      setError(`Lütfen en az ${minChars} karakter girin`);
      return;
    }

    if (text.length > maxChars) {
      setError(`Maksimum ${maxChars} karakter girebilirsiniz`);
      return;
    }

    onSubmit(text);
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    setCharCount(newText.length);
    setError(null);
  };

  const getCharCountClass = () => {
    if (charCount < minChars) return 'mood-input__char-count--warning';
    if (charCount > maxChars * 0.9) return 'mood-input__char-count--danger';
    return 'mood-input__char-count--success';
  };

  return (
    <form className={`mood-input ${isFocused ? 'mood-input--focused' : ''}`} onSubmit={handleSubmit}>
      <div className="mood-input__header">
        <label htmlFor="mood-text" className="mood-input__label">
          <span className="mood-input__emoji">💭</span>
          Bugün nasıl hissediyorsun?
        </label>
        <p className="mood-input__description">
          Duygularınızı, düşüncelerinizi paylaşın. Yapay zekamız sizin için en uygun müzikleri bulacak.
        </p>
      </div>
      
      <div className="mood-input__textarea-wrapper">
        <textarea
          id="mood-text"
          className="mood-input__textarea"
          rows={6}
          placeholder="Örneğin: Bugün çok mutluyum, güneşli bir gün geçirdim ve arkadaşlarımla harika vakit geçirdim..."
          value={text}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={loading}
          maxLength={maxChars}
        />
        <div className="mood-input__char-indicator">
          <span className={`mood-input__char-count ${getCharCountClass()}`}>
            {charCount} / {maxChars}
          </span>
          {charCount >= minChars && (
            <span className="mood-input__check">✓</span>
          )}
        </div>
      </div>

      {error && (
        <div className="mood-input__error">
          <span className="mood-input__error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}
      
      <Button 
        type="submit" 
        disabled={!text.trim() || charCount < minChars || loading} 
        isLoading={loading}
        size="lg"
      >
        {loading ? 'Analiz Ediliyor...' : '🎵 Analiz Et ve Müzik Öner'}
      </Button>

      <div className="mood-input__tips">
        <p className="mood-input__tips-title">💡 İpuçları:</p>
        <ul className="mood-input__tips-list">
          <li>Ne hissettiğinizi açık bir şekilde ifade edin</li>
          <li>Detaylı yazarsanız daha iyi öneriler alırsınız</li>
          <li>Pozitif veya negatif, tüm duygular değerlidir</li>
        </ul>
      </div>
    </form>
  );
};

