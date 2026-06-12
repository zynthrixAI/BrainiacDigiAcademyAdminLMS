'use client';

import { useMemo, useState } from 'react';
import { usePayouts } from '@/hooks/query/usePayouts';
import { useConfirm } from '@/hooks/useConfirm';
import { PayoutSummaryCard } from '@/components/widgets/PayoutSummaryCard';
import { PayoutsTable } from '@/components/widgets/PayoutsTable';
import { PayoutReceiptModal } from '@/components/widgets/PayoutReceiptModal';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { DownIcon } from '@/components/icons/DownIcon';
import { CheckIcon } from '@/components/icons/CheckIcon';
import { rowsToCsv, downloadCsv } from '@/lib/utils/csv';
import type { Payout, PayoutTab } from '@/types/payout';

const TAB_ORDER: PayoutTab[] = ['pending', 'processed', 'all'];

/** Admin payouts: pending dues summary, status tabs, and the payout table.
 *  Mark-processed is local-only until the payouts endpoint exists. */
export function PayoutsPage() {
  const { data, isLoading, isError } = usePayouts();
  const confirm = useConfirm();

  const [tab, setTab] = useState<PayoutTab>('pending');
  // Ids marked processed in this session — local-only; swap for a real mutation later.
  const [processedIds, setProcessedIds] = useState<Record<string, true>>({});
  const [receipt, setReceipt] = useState<Payout | null>(null);

  const payouts = useMemo<Payout[]>(
    () =>
      (data ?? []).map((p) =>
        processedIds[p.id] && p.status === 'pending'
          ? { ...p, status: 'processed', processed_at: 'Just now' }
          : p,
      ),
    [data, processedIds],
  );

  const pending = payouts.filter((p) => p.status === 'pending');
  const totalPending = pending.reduce((s, p) => s + p.teacher_amount, 0);
  const grossPending = pending.reduce((s, p) => s + p.gross_revenue, 0);
  const feePending = pending.reduce((s, p) => s + p.platform_fee, 0);

  const tabLabels = TAB_ORDER.map((key) =>
    key === 'pending' ? `Pending · ${pending.length}` : key === 'processed' ? 'Processed' : 'All',
  );
  const activeLabel = tabLabels[TAB_ORDER.indexOf(tab)];

  const visible = tab === 'all' ? payouts : payouts.filter((p) => p.status === tab);

  const handleMark = async (payout: Payout) => {
    const ok = await confirm({
      title: `Mark ${payout.teacher} as processed?`,
      message: `Confirms Rs. ${payout.teacher_amount.toLocaleString()} was paid out for ${payout.period}.`,
      confirmLabel: 'Mark processed',
    });
    if (!ok) return;
    setProcessedIds((prev) => ({ ...prev, [payout.id]: true }));
  };

  const handleMarkAll = async () => {
    if (pending.length === 0) return;
    const ok = await confirm({
      title: `Mark all ${pending.length} payouts as processed?`,
      message: `Confirms Rs. ${totalPending.toLocaleString()} was paid out across ${pending.length} teachers.`,
      confirmLabel: 'Mark all processed',
    });
    if (!ok) return;
    setProcessedIds((prev) => {
      const next = { ...prev };
      pending.forEach((p) => {
        next[p.id] = true;
      });
      return next;
    });
  };

  const handleExport = () => {
    const rows = visible.map((p) => [
      p.teacher,
      p.period,
      p.students,
      p.gross_revenue,
      p.platform_fee,
      p.teacher_amount,
      p.status,
      p.processed_at ?? '',
    ]);
    const csv = rowsToCsv(
      ['Teacher', 'Period', 'Students', 'Gross', 'Platform fee', 'Teacher amount', 'Status', 'Processed on'],
      rows,
    );
    downloadCsv(`payouts-${tab}.csv`, csv);
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col">
          <h1 className="font-display text-[26px] font-extrabold text-ink">Payouts</h1>
          <span className="mt-2 text-[13px] text-muted">
            {pending.length} pending · Rs. {totalPending.toLocaleString()} due to teachers
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
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
            <DownIcon size={13} /> Export bank file
          </Button>
          <Button onClick={handleMarkAll} disabled={pending.length === 0}>
            <CheckIcon size={13} /> Mark all processed
          </Button>
        </div>
      </div>

      {isError && (
        <p className="mb-3 text-[13px] font-medium text-[var(--red)]">
          Couldn’t load payouts. Check your connection and try again.
        </p>
      )}

      {pending.length > 0 && (
        <PayoutSummaryCard
          period={pending[0].period}
          teacherCount={pending.length}
          gross={grossPending}
          fee={feePending}
          net={totalPending}
        />
      )}

      <PayoutsTable
        payouts={visible}
        isLoading={isLoading}
        processingId={null}
        onMarkProcessed={handleMark}
        onViewReceipt={setReceipt}
      />

      <PayoutReceiptModal payout={receipt} onClose={() => setReceipt(null)} />
    </div>
  );
}
