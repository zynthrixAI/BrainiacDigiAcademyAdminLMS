import type { ReactNode } from 'react';
import { CheckIcon } from '@/components/icons/CheckIcon';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  id?: string;
  /** 'card' = bordered row (default); 'bare' = just the box + label. */
  variant?: 'card' | 'bare';
  /** Extra classes on the wrapping label (e.g. height alignment in a grid). */
  className?: string;
}

/** Custom checkbox — a visually-hidden native input drives a styled box, so it
 *  stays keyboard- and screen-reader-accessible without the default chrome. */
export function Checkbox({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  id,
  variant = 'card',
  className = '',
}: CheckboxProps) {
  const wrapper =
    variant === 'card'
      ? `flex cursor-pointer items-center gap-2.5 rounded-xl border border-line bg-white px-3.5 py-[10px] transition-colors hover:border-line-2 has-[:checked]:border-yellow has-[:disabled]:cursor-default has-[:disabled]:bg-[#faf9f7] has-[:disabled]:hover:border-line`
      : 'flex cursor-pointer items-center gap-2.5 has-[:disabled]:cursor-default';

  return (
    <label className={`${wrapper} ${className}`}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span
        className="grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[6px] border border-line-2 bg-white text-ink transition-colors [&>svg]:opacity-0 peer-checked:border-yellow peer-checked:bg-yellow peer-checked:[&>svg]:opacity-100 peer-focus-visible:ring-2 peer-focus-visible:ring-yellow/40 peer-disabled:opacity-50"
      >
        <CheckIcon size={12} className="transition-opacity" />
      </span>
      {(label || description) && (
        <span className="flex flex-col leading-tight">
          {label && (
            <span className="text-[13.5px] font-medium text-ink peer-disabled:text-muted">
              {label}
            </span>
          )}
          {description && <span className="text-[12px] text-muted">{description}</span>}
        </span>
      )}
    </label>
  );
}
