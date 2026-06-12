import type { ReactNode } from 'react';

interface PillProps {
  children: ReactNode;
  className?: string;
}

/** Small uppercase badge. Presentational atom. */
export function Pill({ children, className = '' }: PillProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em] ${className}`}
    >
      {children}
    </span>
  );
}
