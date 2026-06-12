'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRobinQueries } from '@/hooks/query/useRobinQueries';
import { useConfirm } from '@/hooks/useConfirm';
import { RobinQueryCard } from '@/components/widgets/RobinQueryCard';
import { RobinQueryModal } from '@/components/widgets/RobinQueryModal';
import { Card } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { DownIcon } from '@/components/icons/DownIcon';
import { SearchIcon } from '@/components/icons/SearchIcon';
import { rowsToCsv, downloadCsv } from '@/lib/utils/csv';
import type { RobinQuery } from '@/types/robin-query';

const TABS = ['All', 'Flagged'];

/** Platform-wide Robin (AI tutor) query log: KPIs, filters, query feed. */
export function RobinLogPage() {
  const { data, isLoading, isError } = useRobinQueries();
  const confirm = useConfirm();

  const [tab, setTab] = useState('All');
  const [subject, setSubject] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [viewing, setViewing] = useState<RobinQuery | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setSearch(searchInput.trim().toLowerCase()), 300);
    return () => clearTimeout(id);
  }, [searchInput]);

  const items = useMemo(() => data?.items ?? [], [data?.items]);
  const flaggedCount = items.filter((q) => q.flagged).length;

  const subjectOptions = useMemo(() => {
    const subjects = Array.from(new Set(items.map((q) => q.subject))).sort();
    return [
      { label: 'All subjects', value: '' },
      ...subjects.map((s) => ({ label: s, value: s })),
    ];
  }, [items]);

  const visible = useMemo(
    () =>
      items.filter((q) => {
        if (tab === 'Flagged' && !q.flagged) return false;
        if (subject && q.subject !== subject) return false;
        if (search && !`${q.query} ${q.student} ${q.teacher}`.toLowerCase().includes(search)) {
          return false;
        }
        return true;
      }),
    [items, tab, subject, search],
  );

  const handleReassign = async (query: RobinQuery) => {
    const ok = await confirm({
      title: `Reassign to ${query.teacher}?`,
      message: `Flag this ${query.subject} query for ${query.teacher} to review Robin’s answer and follow up with ${query.student}.`,
      confirmLabel: 'Reassign',
    });
    if (!ok) return;
    // No backend yet — wire to a reassign mutation once the endpoint exists.
  };

  const handleExport = () => {
    const rows = visible.map((q) => [
      q.flagged ? 'Flagged' : 'OK',
      q.subject,
      q.student,
      q.teacher,
      q.time,
      q.query,
    ]);
    const csv = rowsToCsv(['Status', 'Subject', 'Student', 'Teacher', 'Time', 'Query'], rows);
    downloadCsv('robin-queries.csv', csv);
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col">
          <h1 className="font-display text-[26px] font-extrabold text-ink">Robin AI queries</h1>
          <span className="mt-2 text-[13px] text-muted">
            Platform-wide log · {flaggedCount} flagged for teacher attention
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Tabs options={TABS} value={tab} onChange={setTab} />
          <Button variant="ghost" onClick={handleExport} disabled={!data}>
            <DownIcon size={13} /> Export
          </Button>
        </div>
      </div>

      {isError && (
        <p className="mb-3 text-[13px] font-medium text-[var(--red)]">
          Couldn’t load the query log. Check your connection and try again.
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
              <span className="text-[13px] text-muted">{kpi.note}</span>
            </Card>
          ))}
        </div>
      )}

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="w-full max-w-[200px]">
          <Select options={subjectOptions} value={subject} onChange={setSubject} searchable />
        </div>
        <label className="flex w-full max-w-xs items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-2 text-muted focus-within:border-yellow">
          <SearchIcon size={15} />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search query, student or teacher…"
            className="w-full min-w-0 border-0 bg-transparent text-sm text-ink outline-none placeholder:text-muted-2"
          />
        </label>
      </div>

      {isLoading && <p className="text-[14px] text-muted">Loading queries…</p>}

      {data && visible.length === 0 && (
        <Card className="py-12 text-center">
          <p className="text-[14px] text-muted">No queries match these filters.</p>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {visible.map((query) => (
          <RobinQueryCard
            key={query.id}
            query={query}
            onView={setViewing}
            onReassign={handleReassign}
          />
        ))}
      </div>

      <RobinQueryModal query={viewing} onClose={() => setViewing(null)} />
    </div>
  );
}
