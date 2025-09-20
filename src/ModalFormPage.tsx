import { useRef } from 'react';
import { useOpenFormModal } from './api/modalApi';
import ModalRoot from './modal/ModalRoot';
import { ModalPortalProvider } from './providers/ModalPortalProvider';

const ModalFormPage = () => {
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const openFormModal = useOpenFormModal();

  const handleOpenModal = async () => {
    try {
      const result = await openFormModal();
      if (result) {
        console.log('폼 제출 결과:', result);
        alert(`제출 완료!\n이름: ${result.name}\n이메일: ${result.email}`);
      } else {
        console.log('폼이 취소되었습니다.');
      }
    } catch (error) {
      console.error('모달 오류:', error);
    }
  };

  return (
    <ModalPortalProvider>
      <main>
        <h1>ModalFormPage</h1>
        <button ref={triggerButtonRef} type="button" onClick={handleOpenModal}>
          신청폼 작성하기
        </button>
        <ModalRoot triggerRef={triggerButtonRef} />
      </main>
    </ModalPortalProvider>
  );
};

export default ModalFormPage;
