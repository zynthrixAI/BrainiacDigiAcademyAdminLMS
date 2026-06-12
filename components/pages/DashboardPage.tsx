'use client';

import { useDashboard } from '@/hooks/query/useDashboard';
import { DashboardHeader } from '@/components/widgets/DashboardHeader';
import { KpiCard } from '@/components/widgets/KpiCard';
import { MrrTrendCard } from '@/components/widgets/MrrTrendCard';
import { ActionQueueCard } from '@/components/widgets/ActionQueueCard';
import { TopTeachersCard } from '@/components/widgets/TopTeachersCard';
import { RecentEnrolmentsCard } from '@/components/widgets/RecentEnrolmentsCard';
import { TodaysClassesCard } from '@/components/widgets/TodaysClassesCard';

/** Full admin dashboard composition. */
export function DashboardPage() {
  const { data, isLoading, isError } = useDashboard();

  if (isError) {
    return (
      <p className="text-[14px] text-[var(--red)]">
        Couldn’t load the dashboard. Please refresh and try again.
      </p>
    );
  }

  if (isLoading || !data) {
    return <p className="text-[14px] text-muted">Loading dashboard…</p>;
  }

  return (
    <>
      <DashboardHeader dateLabel={data.dateLabel} />

      <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
        {data.kpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <MrrTrendCard months={data.revenueTrend} summary={data.mrrSummary} />
        <ActionQueueCard items={data.actionQueue} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <TopTeachersCard teachers={data.topTeachers} />
        <RecentEnrolmentsCard enrolments={data.recentEnrolments} />
        <TodaysClassesCard classes={data.todaysClasses} />
      </div>
    </>
  );
}
