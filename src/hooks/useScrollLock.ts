import { useEffect } from 'react';

interface UseScrollLockOptions {
  isLocked?: boolean;
}

export function useScrollLock({ isLocked = true }: UseScrollLockOptions = {}) {
  useEffect(() => {
    if (!isLocked) return;

    const documentBody = document.body;

    // Store original styles
    const originalOverflow = documentBody.style.overflow;

    // Apply scroll lock
    documentBody.style.overflow = 'hidden';

    // Cleanup function
    return () => {
      documentBody.style.overflow = originalOverflow;
    };
  }, [isLocked]);
}
