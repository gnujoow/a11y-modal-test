import { useEffect } from 'react';

interface UseEscapeKeyOptions {
  isActive?: boolean;
  onEscape: () => void;
}

export function useEscapeKey({
  isActive = true,
  onEscape,
}: UseEscapeKeyOptions) {
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Esc') {
        event.preventDefault();
        onEscape();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, onEscape]);
}
