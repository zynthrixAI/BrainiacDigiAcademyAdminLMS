import type { Payout } from '@/types/payout';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { EyeIcon } from '@/components/icons/EyeIcon';
import { initialsOf } from '@/lib/utils/format';

interface PayoutsTableProps {
  payouts: Payout[];
  isLoading: boolean;
  /** Id currently being marked processed (disables that row's button). */
  processingId: string | null;
  onMarkProcessed: (payout: Payout) => void;
  onViewReceipt: (payout: Payout) => void;
}

const COLUMNS = [
  'Teacher',
  'Period',
  'Students',
  'Gross revenue',
  'Platform fee (30%)',
  'Teacher amount (70%)',
  'Status',
  '',
];

export function PayoutsTable({
  payouts,
  isLoading,
  processingId,
  onMarkProcessed,
  onViewReceipt,
}: PayoutsTableProps) {
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
                  Loading payouts…
                </td>
              </tr>
            )}

            {!isLoading && payouts.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-10 text-center text-sm text-muted">
                  No payouts in this view.
                </td>
              </tr>
            )}

            {!isLoading &&
              payouts.map((p) => (
                <tr key={p.id} className="align-middle">
                  <td className="border-b border-line px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar initials={initialsOf(p.teacher)} size={32} />
                      <span className="text-[13.5px] font-bold text-ink">{p.teacher}</span>
                    </div>
                  </td>
                  <td className="border-b border-line px-4 py-3.5">
                    <Pill className="bg-[#f5f5f4] text-muted">{p.period}</Pill>
                  </td>
                  <td className="border-b border-line px-4 py-3.5">
                    <span className="text-[13px] text-ink">{p.students}</span>
                  </td>
                  <td className="border-b border-line px-4 py-3.5">
                    <span className="whitespace-nowrap font-mono text-[12.5px] text-ink">
                      Rs. {p.gross_revenue.toLocaleString()}
                    </span>
                  </td>
                  <td className="border-b border-line px-4 py-3.5">
                    <span className="whitespace-nowrap font-mono text-[12.5px] text-muted">
                      Rs. {p.platform_fee.toLocaleString()}
                    </span>
                  </td>
                  <td className="border-b border-line px-4 py-3.5">
                    <span className="whitespace-nowrap font-display text-[14px] font-extrabold text-ink">
                      Rs. {p.teacher_amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="border-b border-line px-4 py-3.5">
                    {p.status === 'pending' ? (
                      <Pill className="bg-[#fdf0d5] text-[#9a6a00]">Pending</Pill>
                    ) : (
                      <>
                        <Pill className="bg-[#e7f4ee] text-[var(--green)]">Processed</Pill>
                        {p.processed_at && (
                          <div className="mt-1.5 text-[11.5px] text-muted">{p.processed_at}</div>
                        )}
                      </>
                    )}
                  </td>
                  <td className="border-b border-line px-4 py-3.5">
                    <div className="flex justify-end">
                      {p.status === 'pending' ? (
                        <Button
                          onClick={() => onMarkProcessed(p)}
                          disabled={processingId === p.id}
                          className="!px-3 !py-1.5 !text-[11.5px]"
                        >
                          {processingId === p.id ? 'Marking…' : 'Mark processed'}
                        </Button>
                      ) : (
                        <button
                          type="button"
                          title="View receipt"
                          onClick={() => onViewReceipt(p)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-line bg-white text-muted transition-colors hover:border-ink hover:text-ink"
                        >
                          <EyeIcon size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
