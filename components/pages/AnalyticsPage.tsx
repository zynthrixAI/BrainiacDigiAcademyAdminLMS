'use client';

import { useState } from 'react';
import type { AnalyticsPeriod } from '@/types/analytics';
import { useAnalytics } from '@/hooks/query/useAnalytics';
import { AnalyticsHeader } from '@/components/widgets/AnalyticsHeader';
import { AnalyticsKpiCard } from '@/components/widgets/AnalyticsKpiCard';
import { RevenueChartCard } from '@/components/widgets/RevenueChartCard';
import { SubscriberBreakdownCard } from '@/components/widgets/SubscriberBreakdownCard';
import { TeacherPerformanceCard } from '@/components/widgets/TeacherPerformanceCard';

/** Full admin analytics composition. */
export function AnalyticsPage() {
  const [period, setPeriod] = useState<AnalyticsPeriod>('30d');
  const { data, isLoading, isError } = useAnalytics(period);

  return (
    <>
      <AnalyticsHeader period={period} onPeriodChange={setPeriod} />

      {isError && (
        <p className="text-[14px] text-[var(--red)]">
          Couldn’t load analytics. Please refresh and try again.
        </p>
      )}

      {!isError && (isLoading || !data) && (
        <p className="text-[14px] text-muted">Loading analytics…</p>
      )}

      {!isError && data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.kpis.map((kpi) => (
              <AnalyticsKpiCard key={kpi.label} kpi={kpi} />
            ))}
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <RevenueChartCard data={data.revenue} />
            <SubscriberBreakdownCard levels={data.levels} plans={data.plans} />
          </div>

          <div className="mt-4">
            <TeacherPerformanceCard teachers={data.teachers} />
          </div>
        </>
      )}
    </>
  );
}
