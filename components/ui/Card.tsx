import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/** Elevated surface container. Presentational atom. */
export function Card({ children, className = '', ...rest }: CardProps) {
  return (
    <div
      className={`rounded-[var(--radius)] border border-line bg-bg-elev p-5 shadow-[0_1px_0_rgba(28,27,27,0.02),0_1px_2px_rgba(28,27,27,0.03)] ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
