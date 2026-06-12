'use client';

import { useState } from 'react';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { DownIcon } from '@/components/icons/DownIcon';

interface DashboardHeaderProps {
  dateLabel: string;
}

const RANGES = ['Today', '7 days', '30 days', 'This year'];

export function DashboardHeader({ dateLabel }: DashboardHeaderProps) {
  const [range, setRange] = useState(RANGES[0]);

  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="flex flex-col">
        <h1 className="font-display text-[28px] font-extrabold text-ink">
          Operations overview
        </h1>
        <span className="mt-2 text-[13px] text-muted">{dateLabel}</span>
      </div>
      <div className="flex items-center gap-2">
        <Tabs options={RANGES} value={range} onChange={setRange} />
        <Button variant="ghost" className="px-3 py-2">
          <DownIcon size={13} /> Export report
        </Button>
      </div>
    </div>
  );
}
