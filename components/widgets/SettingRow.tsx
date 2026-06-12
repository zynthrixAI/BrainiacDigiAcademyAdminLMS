import type { ReactNode } from 'react';

interface SettingRowProps {
  label: string;
  description: string;
  children: ReactNode;
}

/** Label + description on the left, control on the right. Divider on top. */
export function SettingRow({ label, description, children }: SettingRowProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-t border-line py-4">
      <div className="flex min-w-[240px] flex-1 flex-col">
        <span className="font-display text-[13.5px] font-bold text-ink">{label}</span>
        <span className="mt-1 text-[12.5px] leading-[1.5] text-muted">{description}</span>
      </div>
      <div className="min-w-[200px]">{children}</div>
    </div>
  );
}
