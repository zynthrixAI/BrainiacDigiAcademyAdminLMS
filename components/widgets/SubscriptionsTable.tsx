import type { AdminSubscription, SubscriptionStatus } from '@/types/subscription';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Button } from '@/components/ui/Button';
import { BoltIcon } from '@/components/icons/BoltIcon';
import { formatPkr, intervalLabel, formatDate } from '@/lib/utils/format';

interface SubscriptionsTableProps {
  subscriptions: AdminSubscription[];
  isLoading: boolean;
  /** Superadmin only — hides the Activate action when false. */
  canManage: boolean;
  page: number;
  pages: number;
  total: number;
  limit: number;
  /** Subscription id with an activate in flight. */
  busyId: string | null;
  onPrev: () => void;
  onNext: () => void;
  onActivate: (subscription: AdminSubscription) => void;
}

const COLUMNS = ['Student', 'Plan', 'Price', 'Status', 'Started', 'Expires', ''];

const STATUS_PILL: Record<SubscriptionStatus, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-[#e7f4ee] text-[var(--green)]' },
  pending: { label: 'Pending', className: 'bg-[#f5f5f4] text-muted' },
  expired: { label: 'Expired', className: 'bg-[#fdeaea] text-[var(--red)]' },
};

/** Student subscriptions table with an Activate action on pending/expired
 *  rows. "GRANT-" basket ids mark admin-granted (comped) access. */
export function SubscriptionsTable({
  subscriptions,
  isLoading,
  canManage,
  page,
  pages,
  total,
  limit,
  busyId,
  onPrev,
  onNext,
  onActivate,
}: SubscriptionsTableProps) {
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
                const granted = s.payfast_basket_id?.startsWith('GRANT-') ?? false;
                const canActivate = canManage && s.status !== 'active';
                return (
                  <tr key={s.id} className="align-middle">
                    <td className="border-b border-line px-4 py-3.5">
                      <div className="flex flex-col leading-[1.2]">
                        <span className="text-[13.5px] font-bold text-ink">{s.user_name}</span>
                        <span className="text-[13px] text-muted">{s.user_email}</span>
                      </div>
                    </td>
                    <td className="border-b border-line px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col leading-[1.2]">
                          <span className="text-[13px] font-semibold text-ink">{s.plan_name}</span>
                          <span className="text-[12px] text-muted">
                            {intervalLabel(s.interval)}
                          </span>
                        </div>
                        {granted && (
                          <Pill className="bg-[#e8f0fe] text-[#2a6fdb]">Granted</Pill>
                        )}
                      </div>
                    </td>
                    <td className="border-b border-line px-4 py-3.5">
                      <span className="whitespace-nowrap font-display text-[13.5px] font-bold text-ink">
                        {formatPkr(s.price)}
                      </span>
                    </td>
                    <td className="border-b border-line px-4 py-3.5">
                      <Pill className={pill.className}>{pill.label}</Pill>
                    </td>
                    <td className="border-b border-line px-4 py-3.5">
                      <span className="whitespace-nowrap text-[13px] text-muted">
                        {s.started_at ? formatDate(s.started_at) : '—'}
                      </span>
                    </td>
                    <td className="border-b border-line px-4 py-3.5">
                      <span className="whitespace-nowrap text-[13px] text-muted">
                        {s.expires_at ? formatDate(s.expires_at) : '—'}
                      </span>
                    </td>
                    <td className="border-b border-line px-4 py-3.5">
                      {canActivate && (
                        <div className="flex justify-end">
                          <Button
                            variant="ghost"
                            onClick={() => onActivate(s)}
                            disabled={busyId === s.id}
                            className="whitespace-nowrap px-2.5 py-1.5 text-xs"
                          >
                            <BoltIcon size={13} />
                            {busyId === s.id ? 'Activating…' : 'Activate'}
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
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
