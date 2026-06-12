import type { InputHTMLAttributes, ReactNode } from 'react';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  /** Optional leading icon rendered inside the input frame. */
  icon?: ReactNode;
  /** Optional element rendered at the far right of the label row (e.g. a link). */
  labelAction?: ReactNode;
}

/**
 * Labeled input with a leading icon. Presentational atom — the value is fully
 * controlled by the parent via props; this component holds no state.
 */
export function TextField({ label, icon, labelAction, id, ...rest }: TextFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="font-display text-[12.5px] font-bold text-ink-2">
          {label}
        </label>
        {labelAction}
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-2.5 focus-within:border-yellow has-[:disabled]:bg-[#faf9f7]">
        {icon && <span className="text-muted">{icon}</span>}
        <input
          id={id}
          className="min-w-0 flex-1 border-0 bg-transparent text-sm text-ink outline-none placeholder:text-muted-2 disabled:cursor-default"
          {...rest}
        />
      </div>
    </div>
  );
}
