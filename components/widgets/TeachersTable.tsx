import type { Teacher } from '@/types/teacher';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Pill } from '@/components/ui/Pill';
import { Button } from '@/components/ui/Button';
import { EyeIcon } from '@/components/icons/EyeIcon';
import { EditIcon } from '@/components/icons/EditIcon';
import { TrashIcon } from '@/components/icons/TrashIcon';
import { initialsOf, formatDate, teacherLevelLabel } from '@/lib/utils/format';

interface TeachersTableProps {
  teachers: Teacher[];
  isLoading: boolean;
  page: number;
  pages: number;
  total: number;
  limit: number;
  deletingId: string | null;
  onPrev: () => void;
  onNext: () => void;
  onView: (teacher: Teacher) => void;
  onEdit: (teacher: Teacher) => void;
  onDelete: (teacher: Teacher) => void;
}

const COLUMNS = ['Teacher', 'Level', 'Status', 'Phone', 'Joined', ''];

export function TeachersTable({
  teachers,
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
}: TeachersTableProps) {
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
                  Loading teachers…
                </td>
              </tr>
            )}

            {!isLoading && teachers.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-10 text-center text-sm text-muted">
                  No teachers found.
                </td>
              </tr>
            )}

            {!isLoading &&
              teachers.map((teacher) => (
                <tr key={teacher.id} className="align-middle">
                  <td className="border-b border-line px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar
                        initials={initialsOf(teacher.name)}
                        src={teacher.profile_picture}
                        size={34}
                      />
                      <div className="flex flex-col leading-[1.2]">
                        <span className="text-[13.5px] font-bold text-ink">{teacher.name}</span>
                        <span className="text-[13px] text-muted">{teacher.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="border-b border-line px-4 py-3.5">
                    <span className="text-[13px] font-semibold text-ink">
                      {teacherLevelLabel(teacher.level)}
                    </span>
                  </td>
                  <td className="border-b border-line px-4 py-3.5">
                    {teacher.is_active ? (
                      <Pill className="bg-[#ecfdf5] text-[var(--green)]">Active</Pill>
                    ) : (
                      <Pill className="bg-[#f5f5f4] text-muted">Inactive</Pill>
                    )}
                  </td>
                  <td className="border-b border-line px-4 py-3.5">
                    <span className="text-[13px] text-muted">{teacher.phone ?? '—'}</span>
                  </td>
                  <td className="border-b border-line px-4 py-3.5">
                    <span className="whitespace-nowrap text-[13px] text-muted">
                      {formatDate(teacher.created_at)}
                    </span>
                  </td>
                  <td className="border-b border-line px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        title="View teacher"
                        onClick={() => onView(teacher)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-line bg-white text-muted transition-colors hover:border-ink hover:text-ink"
                      >
                        <EyeIcon size={14} />
                      </button>
                      <button
                        type="button"
                        title="Edit teacher"
                        onClick={() => onEdit(teacher)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-line bg-white text-muted transition-colors hover:border-ink hover:text-ink"
                      >
                        <EditIcon size={14} />
                      </button>
                      <button
                        type="button"
                        title="Delete teacher"
                        onClick={() => onDelete(teacher)}
                        disabled={deletingId === teacher.id}
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
