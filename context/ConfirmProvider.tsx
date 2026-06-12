'use client';

import { createContext, useCallback, useRef, useState, type ReactNode } from 'react';
import type { ConfirmOptions } from '@/types/confirm';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface ConfirmContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

export const ConfirmContext = createContext<ConfirmContextValue | null>(null);

interface ConfirmState {
  open: boolean;
  options: ConfirmOptions;
}

const INITIAL: ConfirmState = { open: false, options: { title: '' } };

/** Provides an imperative `confirm(options) => Promise<boolean>` and renders a
 *  single shared confirmation dialog. Replaces window.confirm. */
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConfirmState>(INITIAL);
  const resolver = useRef<((result: boolean) => void) | null>(null);

  const confirm = useCallback((options: ConfirmOptions) => {
    setState({ open: true, options });
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const settle = (result: boolean) => {
    setState((prev) => ({ ...prev, open: false }));
    resolver.current?.(result);
    resolver.current = null;
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <ConfirmDialog
        open={state.open}
        title={state.options.title}
        message={state.options.message}
        confirmLabel={state.options.confirmLabel}
        cancelLabel={state.options.cancelLabel}
        tone={state.options.tone}
        onConfirm={() => settle(true)}
        onCancel={() => settle(false)}
      />
    </ConfirmContext.Provider>
  );
}
