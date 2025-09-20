import { useAtom } from 'jotai';
import { useEffect, useId } from 'react';
import { openModalTypeAtom } from '../atoms/modalAtom';
import { ModalPortal } from '../providers/ModalPortalProvider';
import FormModal from './FormModal';

const ModalRoot = () => {
  const [openModalType, setOpenModalType] = useAtom(openModalTypeAtom);
  const modalTitleId = useId();

  useEffect(() => {
    if (openModalType) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setOpenModalType(null);
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [openModalType, setOpenModalType]);

  if (!openModalType) return null;

  const renderModalContent = () => {
    switch (openModalType) {
      case 'form':
        return <FormModal />;
      case 'more_modals':
        return <div>More modals content</div>;
      default:
        return null;
    }
  };

  return (
    <ModalPortal>
      <>
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
          }}
          onClick={() => setOpenModalType(null)}
          aria-hidden="true"
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={modalTitleId}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 1001,
            maxWidth: '500px',
            width: '90%',
          }}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          onKeyUp={(e) => e.stopPropagation()}
          onKeyPress={(e) => e.stopPropagation()}
        >
          {renderModalContent()}
        </div>
      </>
    </ModalPortal>
  );
};

export default ModalRoot;
