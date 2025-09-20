import { useAtom } from 'jotai';
import { useCallback, useId, useRef } from 'react';
import { openModalTypeAtom } from '../atoms/modalAtom';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { useFocusManagement } from '../hooks/useFocusManagement';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useScrollLock } from '../hooks/useScrollLock';
import { ModalPortal } from '../providers/ModalPortalProvider';
import FormModal from './FormModal';

interface ModalRootProps {
  triggerRef?: React.RefObject<HTMLElement>;
}

const ModalRoot = ({ triggerRef }: ModalRootProps) => {
  const [openModalType, setOpenModalType] = useAtom(openModalTypeAtom);
  const modalTitleId = useId();
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleClose = useCallback(() => {
    setOpenModalType(null);
  }, [setOpenModalType]);

  // ESC 키로 모달 닫기
  useEscapeKey({
    isActive: !!openModalType,
    onEscape: handleClose
  });

  // 배경 스크롤 방지
  useScrollLock({
    isLocked: !!openModalType
  });

  // 포커스 관리: 모달 열림/닫힘 시 포커스 이동
  useFocusManagement({
    isOpen: !!openModalType,
    containerRef: modalContainerRef,
    triggerRef,
    titleElementSelector: `#${modalTitleId}, h1, h2, h3, h4, h5, h6, [role="heading"]`
  });

  // 포커스 트랩: Tab 키 순환 네비게이션
  useFocusTrap({
    isActive: !!openModalType,
    containerRef: modalContainerRef
  });

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
        {/* Overlay - 외부 영역 클릭으로 닫기 */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            transition: prefersReducedMotion ? 'none' : 'opacity 0.2s ease-out',
          }}
          onClick={handleClose}
          aria-hidden="true"
        />
        {/* Modal Container - 내부 스크롤 지원 */}
        <div
          ref={modalContainerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={modalTitleId}
          aria-describedby={`${modalTitleId}-description`}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 1001,
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            transition: prefersReducedMotion ? 'none' : 'transform 0.2s ease-out, opacity 0.2s ease-out',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Content - 스크롤 가능한 영역 */}
          <div
            style={{
              padding: '20px',
              overflowY: 'auto',
              flex: 1,
            }}
          >
            {renderModalContent()}
          </div>
        </div>
      </>
    </ModalPortal>
  );
};

export default ModalRoot;
