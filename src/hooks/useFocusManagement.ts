import { useEffect, useRef } from 'react';

interface UseFocusManagementOptions {
  isOpen: boolean;
  containerRef: React.RefObject<HTMLElement>;
  triggerRef?: React.RefObject<HTMLElement>;
  titleElementSelector?: string;
  restoreFocus?: boolean;
}

export function useFocusManagement({
  isOpen,
  containerRef,
  triggerRef,
  titleElementSelector = 'h1, h2, h3, h4, h5, h6, [role="heading"]',
  restoreFocus = true
}: UseFocusManagementOptions) {
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      // 현재 포커스된 요소 저장 (트리거 버튼)
      previousActiveElement.current = document.activeElement as HTMLElement;

      // 모달 컨테이너 내에서 제목 요소로 포커스 이동
      const focusTitle = () => {
        if (!containerRef.current) return;

        const titleElement = containerRef.current.querySelector(titleElementSelector) as HTMLElement;
        console.log('Trying to focus title:', titleElement, 'with selector:', titleElementSelector);
        console.log('Container:', containerRef.current);

        if (titleElement) {
          // tabindex가 이미 설정되어 있지 않으면 설정
          if (!titleElement.hasAttribute('tabindex')) {
            titleElement.setAttribute('tabindex', '-1');
          }
          titleElement.focus();
          console.log('Title focused, activeElement:', document.activeElement);
        } else {
          console.warn('Title element not found with selector:', titleElementSelector);
          console.warn('Available elements in container:', containerRef.current.innerHTML);
        }
      };

      // 더 긴 delay로 모달이 완전히 렌더링된 후 포커스 이동
      const timeoutId = setTimeout(focusTitle, 100);

      return () => {
        clearTimeout(timeoutId);
      };
    } else if (restoreFocus) {
      // 모달이 닫힐 때 원래 요소로 포커스 복귀
      if (triggerRef?.current) {
        triggerRef.current.focus();
      } else if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }
  }, [isOpen, containerRef, triggerRef, titleElementSelector, restoreFocus]);

  return {
    previousActiveElement: previousActiveElement.current
  };
}