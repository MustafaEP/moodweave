import { useState } from 'react';
import type { FormEvent } from 'react';
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateText(text, 10)) {
      setError('Lütfen en az 10 karakter girin');
      return;
    }

    onSubmit(text);
  };

  return (
    <form className="mood-input" onSubmit={handleSubmit}>
      <label htmlFor="mood-text" className="mood-input__label">
        Bugün nasıl hissediyorsun?
      </label>
      <textarea
        id="mood-text"
        className="mood-input__textarea"
        rows={6}
        placeholder="Duygularını, düşüncelerini veya bugün yaşadığın şeyleri yaz..."
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setError(null);
        }}
        disabled={loading}
      />
      {error && <p className="mood-input__error">{error}</p>}
      <Button type="submit" disabled={!text.trim() || loading} isLoading={loading}>
        Analiz Et
      </Button>
    </form>
  );
};

