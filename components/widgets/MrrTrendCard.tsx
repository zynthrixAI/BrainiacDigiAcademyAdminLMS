'use client';

import { useState } from 'react';
import type { MrrSummary, RevenueMonth } from '@/types/dashboard';
import { Card } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { RevenueSparkline } from './RevenueSparkline';

interface MrrTrendCardProps {
  months: RevenueMonth[];
  summary: MrrSummary;
}

const SERIES = ['MRR', 'New subs', 'Churn'];

export function MrrTrendCard({ months, summary }: MrrTrendCardProps) {
  const [series, setSeries] = useState(SERIES[0]);

  const stats: { label: string; value: string; tone?: 'green' | 'red' }[] = [
    { label: 'ARR projection', value: summary.arrProjection },
    { label: 'Net new (May)', value: summary.netNew, tone: 'green' },
    { label: 'Churned (May)', value: summary.churned, tone: 'red' },
    { label: 'A vs O Level split', value: summary.levelSplit },
  ];

  return (
    <Card>
      <div className="mb-4 flex items-start justify-between">
        <div className="flex flex-col">
          <h3 className="font-display text-[15px] font-bold text-ink">MRR trend</h3>
          <span className="text-[13px] text-muted">
            Last 7 months · all subscription tiers
          </span>
        </div>
        <Tabs options={SERIES} value={series} onChange={setSeries} />
      </div>

      <RevenueSparkline months={months} />

      <div className="mt-4 flex flex-wrap justify-between gap-4 border-t border-line pt-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col">
            <span className="text-[13px] text-muted">{stat.label}</span>
            <span
              className="font-display text-[18px] font-extrabold"
              style={
                stat.tone
                  ? { color: stat.tone === 'green' ? 'var(--green)' : 'var(--red)' }
                  : undefined
              }
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
