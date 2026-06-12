import type { Lead } from '@/types/lead';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EyeIcon } from '@/components/icons/EyeIcon';
import { EditIcon } from '@/components/icons/EditIcon';
import { TrashIcon } from '@/components/icons/TrashIcon';
import { formatDate, teacherLevelLabel } from '@/lib/utils/format';
import { leadStatusLabel, leadPillStyle } from '@/lib/utils/lead-status';

interface LeadsTableProps {
  leads: Lead[];
  isLoading: boolean;
  page: number;
  pages: number;
  total: number;
  limit: number;
  deletingId: string | null;
  onPrev: () => void;
  onNext: () => void;
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

const COLUMNS = ['Name', 'Contact', 'Level', 'Stage', 'Source', 'Created', ''];

const PILL_BASE =
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em]';

export function LeadsTable({
  leads,
  isLoading,
  page,
  pages,
  total,
  limit,
  deletingId,
  onPrev,
  onNext,
  onView,
  onEdit,
  onDelete,
}: LeadsTableProps) {
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
                  Loading leads…
                </td>
              </tr>
            )}

            {!isLoading && leads.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-10 text-center text-sm text-muted">
                  No leads found.
                </td>
              </tr>
            )}

            {!isLoading &&
              leads.map((lead) => (
                <tr key={lead.id} className="align-middle">
                  <td className="border-b border-line px-4 py-3.5">
                    <div className="flex flex-col leading-[1.2]">
                      <span className="text-[13.5px] font-bold text-ink">{lead.name}</span>
                      <span className="text-[13px] text-muted">{lead.parent?.name ?? '—'}</span>
                    </div>
                  </td>
                  <td className="border-b border-line px-4 py-3.5">
                    <div className="flex flex-col leading-[1.3]">
                      <span className="text-[13px] text-ink">{lead.email}</span>
                      <span className="font-mono text-[12.5px] text-muted">{lead.phone}</span>
                    </div>
                  </td>
                  <td className="border-b border-line px-4 py-3.5">
                    <span className={`${PILL_BASE} bg-[#f5f5f4] text-muted`}>
                      {lead.level ? teacherLevelLabel(lead.level) : '—'}
                    </span>
                  </td>
                  <td className="border-b border-line px-4 py-3.5">
                    <span className={PILL_BASE} style={leadPillStyle(lead.status)}>
                      {leadStatusLabel(lead.status)}
                    </span>
                  </td>
                  <td className="border-b border-line px-4 py-3.5">
                    <span className="text-[13px] text-muted">
                      {lead.source.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="border-b border-line px-4 py-3.5">
                    <span className="whitespace-nowrap text-[13px] text-muted">
                      {formatDate(lead.created_at)}
                    </span>
                  </td>
                  <td className="border-b border-line px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        title="View lead"
                        onClick={() => onView(lead)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-line bg-white text-muted transition-colors hover:border-ink hover:text-ink"
                      >
                        <EyeIcon size={14} />
                      </button>
                      <button
                        type="button"
                        title="Edit lead"
                        onClick={() => onEdit(lead)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-line bg-white text-muted transition-colors hover:border-ink hover:text-ink"
                      >
                        <EditIcon size={14} />
                      </button>
                      <button
                        type="button"
                        title="Delete lead"
                        onClick={() => onDelete(lead)}
                        disabled={deletingId === lead.id}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-line bg-white text-muted transition-colors hover:border-[var(--red)] hover:text-[var(--red)] disabled:opacity-50"
                      >
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
