import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-yellow text-ink hover:brightness-[0.97]',
  ghost: 'bg-transparent text-ink border-line-2 hover:bg-black/[0.03]',
  danger: 'bg-[var(--red)] text-white hover:brightness-[0.95]',
};

/** Presentational button atom. No business logic — behaviour comes via props. */
export function Button({
  variant = 'primary',
  children,
  className = '',
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border border-transparent px-4 py-2.5 font-display text-[13px] font-bold transition-[filter,background-color] disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
