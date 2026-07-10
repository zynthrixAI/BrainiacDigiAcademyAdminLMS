import { Fragment, useState } from 'react';
import type { AdminTransaction, TransactionStatus } from '@/types/subscription';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Button } from '@/components/ui/Button';
import { DownIcon } from '@/components/icons/DownIcon';
import { formatPkr, formatDateTime } from '@/lib/utils/format';

interface TransactionsTableProps {
  transactions: AdminTransaction[];
  isLoading: boolean;
  page: number;
  pages: number;
  total: number;
  limit: number;
  onPrev: () => void;
  onNext: () => void;
}

const COLUMNS = ['Buyer', 'Purpose', 'Item', 'Amount', 'Status', 'PayFast refs', 'Date', ''];

const STATUS_PILL: Record<TransactionStatus, { label: string; className: string }> = {
  paid: { label: 'Paid', className: 'bg-[#e7f4ee] text-[var(--green)]' },
  pending: { label: 'Pending', className: 'bg-[#f5f5f4] text-muted' },
  failed: { label: 'Failed', className: 'bg-[#fdeaea] text-[var(--red)]' },
};

/** Payment transactions table. Failed rows expand to show PayFast's
 *  error code/message — the support & debugging view. */
export function TransactionsTable({
  transactions,
  isLoading,
  page,
  pages,
  total,
  limit,
  onPrev,
  onNext,
}: TransactionsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <Card className="overflow-hidden !p-0">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              {COLUMNS.map((col, i) => (
                <th
                  key={col || `col-${i}`}
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
                  Loading transactions…
                </td>
              </tr>
            )}

            {!isLoading && transactions.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-10 text-center text-sm text-muted">
                  No transactions found.
                </td>
              </tr>
            )}

            {!isLoading &&
              transactions.map((t) => {
                const pill = STATUS_PILL[t.status];
                const expanded = expandedId === t.id;
                return (
                  <Fragment key={t.id}>
                    <tr className="align-middle">
                      <td className="border-b border-line px-4 py-3.5">
                        <div className="flex flex-col leading-[1.2]">
                          <span className="text-[13.5px] font-bold text-ink">{t.user_name}</span>
                          <span className="text-[13px] text-muted">{t.user_email}</span>
                        </div>
                      </td>
                      <td className="border-b border-line px-4 py-3.5">
                        <Pill className="bg-[#f5f5f4] text-muted">{t.purpose}</Pill>
                      </td>
                      <td className="border-b border-line px-4 py-3.5">
                        <span className="text-[13px] font-semibold text-ink">
                          {t.reference_name}
                        </span>
                      </td>
                      <td className="border-b border-line px-4 py-3.5">
                        <span className="whitespace-nowrap font-display text-[13.5px] font-bold text-ink">
                          {formatPkr(t.amount)}
                        </span>
                      </td>
                      <td className="border-b border-line px-4 py-3.5">
                        <Pill className={pill.className}>{pill.label}</Pill>
                      </td>
                      <td className="border-b border-line px-4 py-3.5">
                        <div className="flex flex-col leading-[1.4]">
                          <span className="font-mono text-[11px] text-muted">
                            {t.payfast_basket_id ?? '—'}
                          </span>
                          <span className="font-mono text-[11px] text-muted-2">
                            {t.payfast_transaction_id ?? '—'}
                          </span>
                        </div>
                      </td>
                      <td className="border-b border-line px-4 py-3.5">
                        <span className="whitespace-nowrap text-[13px] text-muted">
                          {t.status === 'paid' && t.paid_at
                            ? formatDateTime(t.paid_at)
                            : formatDateTime(t.created_at)}
                        </span>
                      </td>
                      <td className="border-b border-line px-4 py-3.5">
                        {t.status === 'failed' && (
                          <div className="flex justify-end">
                            <button
                              type="button"
                              title={expanded ? 'Hide error details' : 'Show error details'}
                              onClick={() => setExpandedId(expanded ? null : t.id)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-line bg-white text-muted transition-colors hover:border-ink hover:text-ink"
                            >
                              <DownIcon
                                size={13}
                                className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
                              />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                    {expanded && (
                      <tr>
                        <td colSpan={COLUMNS.length} className="border-b border-line bg-[#fdf7f7] px-4 py-3">
                          <div className="flex flex-col gap-1 text-[13px]">
                            <span className="font-bold text-[var(--red)]">
                              PayFast error {t.error_code ?? '—'}
                            </span>
                            <span className="text-ink-2">
                              {t.error_message ?? 'No error message recorded.'}
                            </span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3">
        <span className="text-[13px] text-muted">
          Showing {from}–{to} of {total}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={onPrev}
            disabled={page <= 1}
            className="px-2.5 py-1.5 text-xs"
          >
            ← Prev
          </Button>
          <Button
            variant="ghost"
            onClick={onNext}
            disabled={page >= pages}
            className="px-2.5 py-1.5 text-xs"
          >
            Next →
          </Button>
        </div>
      </div>
    </Card>
  );
}
