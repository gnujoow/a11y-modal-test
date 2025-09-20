import { useRef } from 'react';
import { useSetAtom } from 'jotai';
import { openModalTypeAtom } from './atoms/modalAtom';
import { ModalPortalProvider } from './providers/ModalPortalProvider';
import ModalRoot from './modal/ModalRoot';

const ModalFormPage = () => {
  const setOpenModalType = useSetAtom(openModalTypeAtom);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <ModalPortalProvider>
      <main>
        <h1>ModalFormPage</h1>
        <button
          ref={triggerButtonRef}
          type="button"
          onClick={() => setOpenModalType('form')}
        >
          신청폼 작성하기
        </button>
        <ModalRoot triggerRef={triggerButtonRef} />
      </main>
    </ModalPortalProvider>
  );
};

export default ModalFormPage;
