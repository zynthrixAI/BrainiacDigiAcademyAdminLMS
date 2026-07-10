import type { PlanStatus, SubscriptionPlan } from '@/types/subscription';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Button } from '@/components/ui/Button';
import { EditIcon } from '@/components/icons/EditIcon';
import { GlobeIcon } from '@/components/icons/GlobeIcon';
import { TrashIcon } from '@/components/icons/TrashIcon';
import { formatPkr, intervalLabel, formatDate } from '@/lib/utils/format';

interface PlansTableProps {
  plans: SubscriptionPlan[];
  isLoading: boolean;
  /** Superadmin only — hides all write actions when false. */
  canManage: boolean;
  page: number;
  pages: number;
  total: number;
  limit: number;
  /** Plan id with a publish/delete in flight (disables its action buttons). */
  busyId: string | null;
  onPrev: () => void;
  onNext: () => void;
  onEdit: (plan: SubscriptionPlan) => void;
  onPublish: (plan: SubscriptionPlan) => void;
  onDelete: (plan: SubscriptionPlan) => void;
}

const COLUMNS = ['Plan', 'Price', 'Interval', 'Status', 'Created', 'Updated', ''];

const STATUS_PILL: Record<PlanStatus, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-[#f5f5f4] text-muted' },
  published: { label: 'Published', className: 'bg-[#e7f4ee] text-[var(--green)]' },
};

/** Subscription plans table. Draft rows: edit / publish / delete. Published
 *  rows: edit only (publishing is one-way, published plans can't be deleted). */
export function PlansTable({
  plans,
  isLoading,
  canManage,
  page,
  pages,
  total,
  limit,
  busyId,
  onPrev,
  onNext,
  onEdit,
  onPublish,
  onDelete,
}: PlansTableProps) {
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
                  Loading plans…
                </td>
              </tr>
            )}

            {!isLoading && plans.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-10 text-center text-sm text-muted">
                  No plans found.
                </td>
              </tr>
            )}

            {!isLoading &&
              plans.map((plan) => {
                const pill = STATUS_PILL[plan.status];
                const isDraft = plan.status === 'draft';
                const busy = busyId === plan.id;
                return (
                  <tr key={plan.id} className="align-middle">
                    <td className="border-b border-line px-4 py-3.5">
                      <div className="flex max-w-[320px] flex-col leading-[1.3]">
                        <span className="text-[13.5px] font-bold text-ink">{plan.name}</span>
                        <span className="truncate text-[12.5px] text-muted">
                          {plan.description}
                        </span>
                      </div>
                    </td>
                    <td className="border-b border-line px-4 py-3.5">
                      <span className="whitespace-nowrap font-display text-[13.5px] font-bold text-ink">
                        {formatPkr(plan.price)}
                      </span>
                    </td>
                    <td className="border-b border-line px-4 py-3.5">
                      <span className="whitespace-nowrap text-[13px] text-muted">
                        {intervalLabel(plan.interval)}
                      </span>
                    </td>
                    <td className="border-b border-line px-4 py-3.5">
                      <Pill className={pill.className}>{pill.label}</Pill>
                    </td>
                    <td className="border-b border-line px-4 py-3.5">
                      <span className="whitespace-nowrap text-[13px] text-muted">
                        {formatDate(plan.created_at)}
                      </span>
                    </td>
                    <td className="border-b border-line px-4 py-3.5">
                      <span className="whitespace-nowrap text-[13px] text-muted">
                        {formatDate(plan.updated_at)}
                      </span>
                    </td>
                    <td className="border-b border-line px-4 py-3.5">
                      {canManage && (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            title="Edit plan"
                            onClick={() => onEdit(plan)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-line bg-white text-muted transition-colors hover:border-ink hover:text-ink"
                          >
                            <EditIcon size={14} />
                          </button>
                          {isDraft && (
                            <>
                              <button
                                type="button"
                                title="Publish plan"
                                onClick={() => onPublish(plan)}
                                disabled={busy}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-line bg-white text-muted transition-colors hover:border-[var(--green)] hover:text-[var(--green)] disabled:opacity-50"
                              >
                                <GlobeIcon size={14} />
                              </button>
                              <button
                                type="button"
                                title="Delete draft"
                                onClick={() => onDelete(plan)}
                                disabled={busy}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-line bg-white text-muted transition-colors hover:border-[var(--red)] hover:text-[var(--red)] disabled:opacity-50"
                              >
                                <TrashIcon size={14} />
                              </button>
                            </>
                          )}
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
