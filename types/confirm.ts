import type { ReactNode } from 'react';

/** Options for an imperative confirmation dialog (see useConfirm). */
export interface ConfirmOptions {
  title: string;
  message?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** 'danger' renders a red confirm button for destructive actions. */
  tone?: 'default' | 'danger';
}
