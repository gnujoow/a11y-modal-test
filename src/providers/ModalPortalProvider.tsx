import { createContext, useContext, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalPortalContextValue {
  mountNode: HTMLElement | null;
}

const ModalPortalContext = createContext<ModalPortalContextValue | undefined>(undefined);

interface ModalPortalProviderProps {
  children: ReactNode;
  containerId?: string;
}

export function ModalPortalProvider({
  children,
  containerId = 'modal-mount-point'
}: ModalPortalProviderProps) {
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (containerRef.current && !mountNode) {
      setMountNode(containerRef.current);
    }
  }, [mountNode]);

  return (
    <ModalPortalContext.Provider value={{ mountNode }}>
      {children}
      <div
        ref={containerRef}
        id={containerId}
        style={{ position: 'fixed', pointerEvents: 'none' }}
      />
    </ModalPortalContext.Provider>
  );
}

export function useModalPortal() {
  const context = useContext(ModalPortalContext);
  if (!context) {
    throw new Error('useModalPortal must be used within ModalPortalProvider');
  }
  return context.mountNode;
}

interface ModalPortalProps {
  children: ReactNode;
}

export function ModalPortal({ children }: ModalPortalProps) {
  const mountNode = useModalPortal();

  if (!mountNode) {
    return null;
  }

  return createPortal(children, mountNode);
}