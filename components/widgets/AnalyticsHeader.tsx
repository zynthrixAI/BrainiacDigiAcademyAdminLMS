'use client';

import type { AnalyticsPeriod } from '@/types/analytics';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { DownIcon } from '@/components/icons/DownIcon';

interface AnalyticsHeaderProps {
  period: AnalyticsPeriod;
  onPeriodChange: (period: AnalyticsPeriod) => void;
}

const PERIODS: { label: string; value: AnalyticsPeriod }[] = [
  { label: '7 days', value: '7d' },
  { label: '30 days', value: '30d' },
  { label: '90 days', value: '90d' },
  { label: 'This year', value: 'year' },
];

const LABELS = PERIODS.map((p) => p.label);

export function AnalyticsHeader({ period, onPeriodChange }: AnalyticsHeaderProps) {
  const activeLabel = PERIODS.find((p) => p.value === period)?.label ?? LABELS[1];

  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="flex flex-col">
        <h1 className="font-display text-[26px] font-extrabold tracking-[-0.01em] text-ink">
          Analytics
        </h1>
        <span className="mt-1 text-[13px] text-muted">
          Revenue, students, and teacher performance across the platform
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Tabs
          options={LABELS}
          value={activeLabel}
          onChange={(label) => {
            const next = PERIODS.find((p) => p.label === label);
            if (next) onPeriodChange(next.value);
          }}
        />
        <Button variant="ghost">
          <DownIcon size={13} /> Export
        </Button>
      </div>
    </div>
  );
}
