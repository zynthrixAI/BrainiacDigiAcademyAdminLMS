'use client';

import { useContext } from 'react';
import { ConfirmContext } from '@/context/ConfirmProvider';

/** Imperative confirmation: `const ok = await confirm({ title, ... })`.
 *  Must be used under <ConfirmProvider> (wired in the root layout). */
export const useConfirm = () => {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within a ConfirmProvider');
  return ctx.confirm;
};
