'use client';

import { useState } from 'react';
import type { RevenuePoint, RevenueMetric } from '@/types/analytics';
import { Card } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { RevenueBarChart } from './RevenueBarChart';

interface RevenueChartCardProps {
  data: RevenuePoint[];
}

const SERIES: { label: string; metric: RevenueMetric; color: string }[] = [
  { label: 'MRR', metric: 'mrr', color: 'var(--yellow)' },
  { label: 'New', metric: 'new', color: 'var(--green)' },
  { label: 'Churn', metric: 'churn', color: 'var(--red)' },
];

const LABELS = SERIES.map((s) => s.label);

export function RevenueChartCard({ data }: RevenueChartCardProps) {
  const [label, setLabel] = useState(LABELS[0]);
  const series = SERIES.find((s) => s.label === label) ?? SERIES[0];

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <h3 className="font-display text-[15px] font-bold text-ink">
            Monthly recurring revenue
          </h3>
          <span className="text-[13px] text-muted">In thousands of PKR · last 7 months</span>
        </div>
        <Tabs options={LABELS} value={label} onChange={setLabel} />
      </div>

      <div className="mt-4">
        <RevenueBarChart data={data} metric={series.metric} color={series.color} />
      </div>
    </Card>
  );
}
