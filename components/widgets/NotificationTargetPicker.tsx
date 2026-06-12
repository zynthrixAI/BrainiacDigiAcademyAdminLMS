import type { ComponentType } from 'react';
import type { NotificationTarget } from '@/types/notification';
import type { IconProps } from '@/components/icons/Icon';
import { UsersIcon } from '@/components/icons/UsersIcon';
import { LayersIcon } from '@/components/icons/LayersIcon';
import { UserIcon } from '@/components/icons/UserIcon';

interface NotificationTargetPickerProps {
  value: NotificationTarget;
  onChange: (target: NotificationTarget) => void;
}

interface TargetOption {
  id: NotificationTarget;
  label: string;
  description: string;
  icon: ComponentType<Omit<IconProps, 'd'>>;
}

const OPTIONS: TargetOption[] = [
  { id: 'all', label: 'All users', description: 'Everyone on the platform', icon: UsersIcon },
  { id: 'batch', label: 'Specific batch', description: 'Students enrolled in one batch', icon: LayersIcon },
  { id: 'student', label: 'Single student', description: 'One specific student', icon: UserIcon },
];

/** Radio-style picker for the notification target. */
export function NotificationTargetPicker({ value, onChange }: NotificationTargetPickerProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-display text-[12px] font-bold text-ink-2">Send to</label>
      <div role="radiogroup" className="grid gap-2 sm:grid-cols-3">
        {OPTIONS.map((o) => {
          const active = o.id === value;
          const Glyph = o.icon;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(o.id)}
              className={`flex items-start gap-2.5 rounded-xl px-3.5 py-3 text-left transition-colors ${
                active
                  ? 'border border-yellow bg-yellow-soft'
                  : 'border border-line bg-white hover:border-line-2'
              }`}
            >
              <span style={{ color: active ? 'var(--yellow-ink)' : 'var(--muted)' }}>
                <Glyph size={16} />
              </span>
              <span className="flex flex-col leading-[1.25]">
                <span className="text-[13px] font-bold text-ink">{o.label}</span>
                <span className="text-[11px] text-muted">{o.description}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
