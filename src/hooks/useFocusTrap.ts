import { useEffect, useRef } from 'react';

interface UseFocusTrapOptions {
  isActive: boolean;
  containerRef: React.RefObject<HTMLElement>;
}

export function useFocusTrap({ isActive, containerRef }: UseFocusTrapOptions) {
  const lastFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;

    const getFocusableElements = (): HTMLElement[] => {
      const focusableSelectors = [
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'a[href]',
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]'
      ].join(', ');

      return Array.from(container.querySelectorAll(focusableSelectors))
        .filter(element => {
          const htmlElement = element as HTMLElement;
          return htmlElement.offsetParent !== null || htmlElement === document.activeElement;
        }) as HTMLElement[];
    };

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const currentElement = document.activeElement as HTMLElement;

      if (event.shiftKey) {
        // Shift + Tab: 역방향 탐색
        if (currentElement === firstElement || !container.contains(currentElement)) {
          event.preventDefault();
          lastElement.focus();
          lastFocusedElement.current = lastElement;
        }
      } else {
        // Tab: 정방향 탐색
        if (currentElement === lastElement || !container.contains(currentElement)) {
          event.preventDefault();
          firstElement.focus();
          lastFocusedElement.current = firstElement;
        }
      }
    };

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      if (container.contains(target)) {
        lastFocusedElement.current = target;
      }
    };

    document.addEventListener('keydown', handleTabKey);
    container.addEventListener('focusin', handleFocusIn);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
      container.removeEventListener('focusin', handleFocusIn);
    };
  }, [isActive, containerRef]);

  return {
    lastFocusedElement: lastFocusedElement.current
  };
}