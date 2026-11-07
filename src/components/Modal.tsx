import { useEffect, useRef, type ReactNode } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
}

/** Wrapper do <dialog> nativo estilizado como modal HUD com retículos nos cantos. */
export default function Modal({ open, onClose, children, maxWidth = 'max-w-sm' }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className={`fixed inset-0 z-50 p-4 m-auto bg-transparent w-full ${maxWidth} text-on-surface`}
    >
      {open && (
        <div className="bg-surface-container-lowest border-2 border-primary-container p-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
          <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-primary-container" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary-container" />
          <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-primary-container" />
          <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-primary-container" />
          {children}
        </div>
      )}
    </dialog>
  );
}

