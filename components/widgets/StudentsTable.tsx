import type { UserProfile } from '@/types/user';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Pill } from '@/components/ui/Pill';
import { Button } from '@/components/ui/Button';
import { CheckIcon } from '@/components/icons/CheckIcon';
import { CloseIcon } from '@/components/icons/CloseIcon';
import { TrashIcon } from '@/components/icons/TrashIcon';
import { EyeIcon } from '@/components/icons/EyeIcon';
import { EditIcon } from '@/components/icons/EditIcon';
import { initialsOf, formatDate } from '@/lib/utils/format';

interface StudentsTableProps {
  users: UserProfile[];
  isLoading: boolean;
  page: number;
  pages: number;
  total: number;
  limit: number;
  deletingId: string | null;
  onPrev: () => void;
  onNext: () => void;
  onView: (user: UserProfile) => void;
  onEdit: (user: UserProfile) => void;
  onDelete: (user: UserProfile) => void;
}

const COLUMNS = ['Student', 'Level', 'Verified', 'Auth', 'Country', 'Joined', ''];

export function StudentsTable({
  users,
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
}: StudentsTableProps) {
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
                  Loading students…
                </td>
              </tr>
            )}

            {!isLoading && users.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-10 text-center text-sm text-muted">
                  No students found.
                </td>
              </tr>
            )}

            {!isLoading &&
              users.map((user) => (
                <tr key={user.id} className="align-middle">
                  <td className="border-b border-line px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar initials={initialsOf(user.name)} size={34} />
                      <div className="flex flex-col leading-[1.2]">
                        <span className="text-[13.5px] font-bold text-ink">{user.name}</span>
                        <span className="text-[13px] text-muted">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="border-b border-line px-4 py-3.5">
                    <span className="text-[13px] font-semibold text-ink">
                      {user.level ?? '—'}
                    </span>
                  </td>
                  <td className="border-b border-line px-4 py-3.5">
                    {user.is_verified ? (
                      <CheckIcon size={15} className="text-[var(--green)]" />
                    ) : (
                      <CloseIcon size={15} className="text-muted-2" />
                    )}
                  </td>
                  <td className="border-b border-line px-4 py-3.5">
                    <Pill
                      className={
                        user.auth_type === 'google'
                          ? 'bg-[#eff6ff] text-[#2a6fdb]'
                          : 'bg-[#f5f5f4] text-muted'
                      }
                    >
                      {user.auth_type}
                    </Pill>
                  </td>
                  <td className="border-b border-line px-4 py-3.5">
                    <span className="text-[13px] text-muted">{user.country ?? '—'}</span>
                  </td>
                  <td className="border-b border-line px-4 py-3.5">
                    <span className="whitespace-nowrap text-[13px] text-muted">
                      {formatDate(user.created_at)}
                    </span>
                  </td>
                  <td className="border-b border-line px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        title="View student"
                        onClick={() => onView(user)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-line bg-white text-muted transition-colors hover:border-ink hover:text-ink"
                      >
                        <EyeIcon size={14} />
                      </button>
                      <button
                        type="button"
                        title="Edit student"
                        onClick={() => onEdit(user)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-line bg-white text-muted transition-colors hover:border-ink hover:text-ink"
                      >
                        <EditIcon size={14} />
                      </button>
                      <button
                        type="button"
                        title="Delete student"
                        onClick={() => onDelete(user)}
                        disabled={deletingId === user.id}
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
