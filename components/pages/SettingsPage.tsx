'use client';

import { MaintenanceSettingsCard } from '@/components/widgets/MaintenanceSettingsCard';
import { MarqueeSettingsCard } from '@/components/widgets/MarqueeSettingsCard';

/** Global platform settings — maintenance window and marquee banner. */
export function SettingsPage() {
  return (
    <div>
      <div className="mb-5 flex flex-col">
        <h1 className="font-display text-[26px] font-extrabold text-ink">Website settings</h1>
        <span className="mt-2 text-[13px] text-muted">
          Maintenance window and the student-facing marquee banner
        </span>
      </div>

      <div className="flex flex-col gap-4">
        <MaintenanceSettingsCard />
        <MarqueeSettingsCard />
      </div>
    </div>
  );
}
