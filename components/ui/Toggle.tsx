interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  /** Accessible label when no visible text sits beside the switch. */
  'aria-label'?: string;
}

/** Custom on/off switch. A real checkbox drives it, so it stays keyboard- and
 *  screen-reader-accessible without the native chrome. */
export function Toggle({ checked, onChange, disabled = false, id, ...rest }: ToggleProps) {
  return (
    <label
      className={`relative inline-flex h-6 w-11 shrink-0 items-center ${
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
      }`}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
        aria-label={rest['aria-label']}
      />
      <span className="absolute inset-0 rounded-full bg-[#d1d5db] transition-colors peer-checked:bg-ink peer-focus-visible:ring-2 peer-focus-visible:ring-yellow/50" />
      <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.18)] transition-transform peer-checked:translate-x-5" />
    </label>
  );
}
