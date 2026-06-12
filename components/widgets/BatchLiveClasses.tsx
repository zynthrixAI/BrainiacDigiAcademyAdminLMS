'use client';

import { useState } from 'react';
import type { LiveClass, LiveClassStatus } from '@/types/live-class';
import { useBatchLiveClasses } from '@/hooks/query/useBatchLiveClasses';
import { liveClassStage } from '@/lib/utils/live-class-status';
import { formatDateTime } from '@/lib/utils/format';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { GlobeIcon } from '@/components/icons/GlobeIcon';
import { LiveClassAttendanceModal } from './LiveClassAttendanceModal';

interface BatchLiveClassesProps {
  batchId: string;
}

const PAGE_SIZE = 10;
const STATUS_TABS = ['All', 'Scheduled', 'Live', 'Ended', 'Cancelled', 'Past due'];
const STATUS_BY_TAB: Record<string, LiveClassStatus | undefined> = {
  All: undefined,
  Scheduled: 'scheduled',
  Live: 'live',
  Ended: 'ended',
  Cancelled: 'cancelled',
  'Past due': 'past_due',
};

const COLUMNS = ['Class', 'When', 'Status', 'Links', 'Attendance'];

/** Read-only list of a batch's live classes. Admins observe only — the
 *  lifecycle (schedule/start/end/cancel) is owned by the assigned teacher. */
export function BatchLiveClasses({ batchId }: BatchLiveClassesProps) {
  const [statusTab, setStatusTab] = useState('All');
  const [page, setPage] = useState(1);
  const [attendanceFor, setAttendanceFor] = useState<LiveClass | null>(null);

  const { data, isLoading, isError } = useBatchLiveClasses(batchId, {
    page,
    limit: PAGE_SIZE,
    status: STATUS_BY_TAB[statusTab],
  });

  const handleTab = (tab: string) => {
    setStatusTab(tab);
    setPage(1);
  };

  const items = data?.items ?? [];
  const pages = data?.pages ?? 1;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[12.5px] text-muted">
          Read-only — live classes are scheduled by the assigned teacher.
        </p>
        <div className="overflow-x-auto">
          <Tabs options={STATUS_TABS} value={statusTab} onChange={handleTab} />
        </div>
      </div>

      {isError && (
        <p className="text-[13px] font-medium text-[var(--red)]">
          Couldn’t load live classes. Check your connection and try again.
        </p>
      )}

      <Card className="overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                {COLUMNS.map((col) => (
                  <th
                    key={col}
                    className="border-b border-line bg-[#faf9f7] px-4 py-3 text-[10.5px] font-bold uppercase tracking-[0.08em] text-muted"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={COLUMNS.length} className="px-4 py-10 text-center text-sm text-muted">
                    Loading live classes…
                  </td>
                </tr>
              )}

              {!isLoading && items.length === 0 && (
                <tr>
                  <td colSpan={COLUMNS.length} className="px-4 py-10 text-center text-sm text-muted">
                    No live classes for this batch yet.
                  </td>
                </tr>
              )}

              {!isLoading &&
                items.map((lc) => {
                  const stage = liveClassStage(lc.status);
                  const canViewAttendance = lc.status === 'live' || lc.status === 'ended';
                  return (
                    <tr key={lc.id} className="align-middle">
                      <td className="border-b border-line px-4 py-3.5">
                        <div className="flex flex-col leading-[1.3]">
                          <span className="text-[13.5px] font-bold text-ink">{lc.title}</span>
                          <span className="text-[12.5px] text-muted">{lc.total_duration} min</span>
                        </div>
                      </td>
                      <td className="border-b border-line px-4 py-3.5">
                        <span className="whitespace-nowrap text-[13px] text-muted">
                          {formatDateTime(lc.scheduled_at)}
                        </span>
                      </td>
                      <td className="border-b border-line px-4 py-3.5">
                        <Pill className={stage.pill}>{stage.label}</Pill>
                        {lc.status === 'cancelled' && lc.cancel_reason && (
                          <span className="mt-1 block max-w-[180px] text-[11.5px] text-muted">
                            {lc.cancel_reason}
                          </span>
                        )}
                      </td>
                      <td className="border-b border-line px-4 py-3.5">
                        {lc.status === 'live' ? (
                          <div className="flex items-center gap-1">
                            {lc.meeting_url && (
                              <a
                                href={lc.meeting_url}
                                target="_blank"
                                rel="noreferrer"
                                title="Open meeting link"
                                className="inline-flex h-8 items-center gap-1 rounded-[10px] border border-line bg-white px-2.5 text-[12px] font-semibold text-muted transition-colors hover:border-ink hover:text-ink"
                              >
                                <GlobeIcon size={13} /> Join
                              </a>
                            )}
                            {lc.host_url && (
                              <a
                                href={lc.host_url}
                                target="_blank"
                                rel="noreferrer"
                                title="Open host link (admin/teacher only)"
                                className="inline-flex h-8 items-center rounded-[10px] border border-line bg-white px-2.5 text-[12px] font-semibold text-muted transition-colors hover:border-ink hover:text-ink"
                              >
                                Host
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-[12.5px] text-muted-2">—</span>
                        )}
                      </td>
                      <td className="border-b border-line px-4 py-3.5">
                        {canViewAttendance ? (
                          <button
                            type="button"
                            onClick={() => setAttendanceFor(lc)}
                            className="rounded-[10px] border border-line bg-white px-2.5 py-1.5 text-[12px] font-bold text-ink transition-colors hover:border-ink"
                          >
                            View attendance
                          </button>
                        ) : (
                          <span className="text-[12.5px] text-muted-2">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </Card>

      {items.length > 0 && pages > 1 && (
        <div className="flex items-center justify-between gap-3">
          <span className="text-[13px] text-muted">
            Page {page} of {pages}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-2.5 py-1.5 text-xs"
            >
              ← Prev
            </Button>
            <Button
              variant="ghost"
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page >= pages}
              className="px-2.5 py-1.5 text-xs"
            >
              Next →
            </Button>
          </div>
        </div>
      )}

      <LiveClassAttendanceModal
        liveClass={attendanceFor}
        onClose={() => setAttendanceFor(null)}
      />
    </div>
  );
}
