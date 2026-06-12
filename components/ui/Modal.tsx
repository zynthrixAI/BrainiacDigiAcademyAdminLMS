'use client';

import { useEffect, type ReactNode } from 'react';
import { CloseIcon } from '@/components/icons/CloseIcon';

type ModalSize = 'sm' | 'md' | 'lg';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
}

const MAX_WIDTH: Record<ModalSize, string> = {
  sm: 'max-w-[420px]',
  md: 'max-w-[520px]',
  lg: 'max-w-[720px]',
};

/** Centered modal dialog with backdrop, Esc-to-close, and scroll lock. */
export function Modal({ open, title, onClose, children, footer, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="animate-overlay-in absolute inset-0 bg-black/40"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`animate-dialog-in relative z-10 flex max-h-[90vh] w-full ${MAX_WIDTH[size]} flex-col overflow-hidden rounded-[var(--radius)] border border-line bg-bg-elev shadow-[0_20px_60px_rgba(0,0,0,0.25)]`}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h3 className="font-display text-[16px] font-extrabold text-ink">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-black/[0.04]"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {footer && <div className="border-t border-line px-5 py-3">{footer}</div>}
      </div>
    </div>
  );
}
