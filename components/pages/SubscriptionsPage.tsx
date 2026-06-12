'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSubscriptions } from '@/hooks/query/useSubscriptions';
import { SubscriptionsTable } from '@/components/widgets/SubscriptionsTable';
import { SubscriptionDetailModal } from '@/components/widgets/SubscriptionDetailModal';
import { Card } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { DownIcon } from '@/components/icons/DownIcon';
import { SearchIcon } from '@/components/icons/SearchIcon';
import { rowsToCsv, downloadCsv } from '@/lib/utils/csv';
import type { Subscription, SubscriptionTab } from '@/types/subscription';

const TAB_ORDER: SubscriptionTab[] = ['all', 'active', 'trial', 'grace', 'cancelled'];
const TAB_LABEL: Record<SubscriptionTab, string> = {
  all: 'All',
  active: 'Active',
  trial: 'Trial',
  grace: 'Grace',
  cancelled: 'Cancelled',
};

const KPI_TONE: Record<'green' | 'ink' | 'red', string> = {
  green: 'var(--green)',
  ink: 'var(--ink)',
  red: 'var(--red)',
};

/** Admin subscriptions / billing screen: KPIs, status tabs, search, table. */
export function SubscriptionsPage() {
  const { data, isLoading, isError } = useSubscriptions();
  const [tab, setTab] = useState<SubscriptionTab>('all');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Subscription | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setSearch(searchInput.trim().toLowerCase()), 300);
    return () => clearTimeout(id);
  }, [searchInput]);

  const counts = data?.counts;
  const tabLabels = TAB_ORDER.map((key) =>
    key === 'all'
      ? TAB_LABEL.all
      : `${TAB_LABEL[key]}${counts ? ` · ${counts[key]}` : ''}`,
  );
  const activeLabel = tabLabels[TAB_ORDER.indexOf(tab)];

  const visible = useMemo(() => {
    const items = data?.items ?? [];
    return items.filter((s) => {
      if (tab !== 'all' && s.status !== tab) return false;
      if (search && !s.student.toLowerCase().includes(search)) return false;
      return true;
    });
  }, [data?.items, tab, search]);

  const handleExport = () => {
    const rows = visible.map((s) => [
      s.student,
      s.level,
      s.plan,
      s.started,
      s.paid,
      s.status,
      s.next,
      s.paypro,
    ]);
    const csv = rowsToCsv(
      ['Student', 'Level', 'Plan', 'Started', 'Paid', 'Status', 'Next event', 'PayPro ref'],
      rows,
    );
    downloadCsv(`subscriptions-${tab}.csv`, csv);
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col">
          <h1 className="font-display text-[26px] font-extrabold text-ink">Subscriptions</h1>
          <span className="mt-2 text-[13px] text-muted">
            {data?.summary ?? 'Billing, plans, and renewals across the platform'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {data && (
            <Tabs
              options={tabLabels}
              value={activeLabel}
              onChange={(label) => {
                const next = TAB_ORDER[tabLabels.indexOf(label)];
                if (next) setTab(next);
              }}
            />
          )}
          <Button variant="ghost" onClick={handleExport} disabled={!data}>
            <DownIcon size={13} /> Export CSV
          </Button>
        </div>
      </div>

      {isError && (
        <p className="mb-3 text-[13px] font-medium text-[var(--red)]">
          Couldn’t load subscriptions. Check your connection and try again.
        </p>
      )}

      {data && (
        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {data.kpis.map((kpi) => (
            <Card key={kpi.label} className="!p-4">
              <span className="text-[10.5px] font-bold uppercase tracking-[0.06em] text-muted">
                {kpi.label}
              </span>
              <div className="mt-1.5 font-display text-[22px] font-extrabold text-ink">
                {kpi.value}
              </div>
              <span className="text-[13px] font-semibold" style={{ color: KPI_TONE[kpi.tone] }}>
                {kpi.note}
              </span>
            </Card>
          ))}
        </div>
      )}

      <div className="mb-5">
        <label className="flex w-full max-w-xs items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-2 text-muted focus-within:border-yellow">
          <SearchIcon size={15} />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by student…"
            className="w-full min-w-0 border-0 bg-transparent text-sm text-ink outline-none placeholder:text-muted-2"
          />
        </label>
      </div>

      <SubscriptionsTable subscriptions={visible} isLoading={isLoading} onView={setSelected} />

      <SubscriptionDetailModal subscription={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
