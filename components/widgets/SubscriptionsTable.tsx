import type { Subscription, SubscriptionStatus } from '@/types/subscription';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { EyeIcon } from '@/components/icons/EyeIcon';
import { DownIcon } from '@/components/icons/DownIcon';

interface SubscriptionsTableProps {
  subscriptions: Subscription[];
  isLoading: boolean;
  onView: (subscription: Subscription) => void;
}

const COLUMNS = ['Student', 'Level', 'Plan', 'Paid to date', 'Status', 'Next event', 'PayPro ref', ''];

const STATUS_PILL: Record<SubscriptionStatus, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-[#e7f4ee] text-[var(--green)]' },
  trial: { label: 'Trial', className: 'bg-[#e8f0fe] text-[#2a6fdb]' },
  grace: { label: 'Grace', className: 'bg-[#fdeaea] text-[var(--red)]' },
  cancelled: { label: 'Cancelled', className: 'bg-[#f5f5f4] text-muted' },
};

export function SubscriptionsTable({ subscriptions, isLoading, onView }: SubscriptionsTableProps) {
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
                  Loading subscriptions…
                </td>
              </tr>
            )}

            {!isLoading && subscriptions.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-10 text-center text-sm text-muted">
                  No subscriptions in this view.
                </td>
              </tr>
            )}

            {!isLoading &&
              subscriptions.map((s) => {
                const pill = STATUS_PILL[s.status];
                return (
                  <tr key={s.id} className="align-middle">
                    <td className="border-b border-line px-4 py-3.5">
                      <span className="text-[13.5px] font-semibold text-ink">{s.student}</span>
                    </td>
                    <td className="border-b border-line px-4 py-3.5">
                      <Pill className="bg-[#f5f5f4] text-muted">{s.level}</Pill>
                    </td>
                    <td className="border-b border-line px-4 py-3.5">
                      <div className="flex flex-col leading-[1.2]">
                        <span className="text-[13px] font-semibold text-ink">{s.plan}</span>
                        <span className="text-[12px] text-muted">Started {s.started}</span>
                      </div>
                    </td>
                    <td className="border-b border-line px-4 py-3.5">
                      <span className="whitespace-nowrap font-display text-[13.5px] font-bold text-ink">
                        Rs. {s.paid.toLocaleString()}
                      </span>
                    </td>
                    <td className="border-b border-line px-4 py-3.5">
                      <Pill className={pill.className}>{pill.label}</Pill>
                    </td>
                    <td className="border-b border-line px-4 py-3.5">
                      <span className="whitespace-nowrap text-[13px] text-muted">{s.next}</span>
                    </td>
                    <td className="border-b border-line px-4 py-3.5">
                      <span className="font-mono text-[11px] text-muted">{s.paypro}</span>
                    </td>
                    <td className="border-b border-line px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          title="View subscription"
                          onClick={() => onView(s)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-line bg-white text-muted transition-colors hover:border-ink hover:text-ink"
                        >
                          <EyeIcon size={13} />
                        </button>
                        <button
                          type="button"
                          title="More"
                          onClick={() => onView(s)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-line bg-white text-muted transition-colors hover:border-ink hover:text-ink"
                        >
                          <DownIcon size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
