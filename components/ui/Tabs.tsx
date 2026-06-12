interface TabsProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

/** Segmented control. Presentational + controlled via props. */
export function Tabs({ options, value, onChange }: TabsProps) {
  return (
    <div className="inline-flex gap-1 rounded-xl bg-[#f0eeea] p-1">
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-[9px] px-3.5 py-1.5 font-display text-[13px] font-semibold transition-colors ${
              active
                ? 'bg-white text-ink shadow-[0_1px_2px_rgba(0,0,0,0.05)]'
                : 'text-muted hover:text-ink'
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
