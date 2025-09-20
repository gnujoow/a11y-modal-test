import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { openModalTypeAtom } from '../atoms/modalAtom';

export interface FormData {
  name: string;
  email: string;
}

export function useOpenFormModal() {
  const [, setOpenModalType] = useAtom(openModalTypeAtom);

  return useCallback((): Promise<FormData | null> => {
    return new Promise((resolve) => {
      // 모달 결과를 받을 이벤트 리스너 등록
      const handleModalResult = (event: CustomEvent<FormData | null>) => {
        document.removeEventListener('modal-form-result', handleModalResult as EventListener);
        resolve(event.detail);
      };

      document.addEventListener('modal-form-result', handleModalResult as EventListener, { once: true });

      // 모달 열기
      setOpenModalType('form');
    });
  }, [setOpenModalType]);
}