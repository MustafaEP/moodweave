import { Button } from '../Button/Button';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  return (
    <div className="error-fallback">
      <h2>Bir hata oluştu</h2>
      <pre>{error.message}</pre>
      <Button onClick={resetErrorBoundary}>Tekrar Dene</Button>
    </div>
  );
};

