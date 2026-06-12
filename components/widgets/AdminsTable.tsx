import type { AdminProfile } from '@/types/admin';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Pill } from '@/components/ui/Pill';
import { EditIcon } from '@/components/icons/EditIcon';
import { TrashIcon } from '@/components/icons/TrashIcon';
import { initialsOf, formatDate } from '@/lib/utils/format';

interface AdminsTableProps {
  admins: AdminProfile[];
  isLoading: boolean;
  /** The signed-in admin's id — its row can't be deleted. */
  currentAdminId: string | undefined;
  deletingId: string | null;
  onEdit: (admin: AdminProfile) => void;
  onDelete: (admin: AdminProfile) => void;
}

const COLUMNS = ['Admin', 'Role', 'Added', ''];

export function AdminsTable({
  admins,
  isLoading,
  currentAdminId,
  deletingId,
  onEdit,
  onDelete,
}: AdminsTableProps) {
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
                  Loading admins…
                </td>
              </tr>
            )}

            {!isLoading && admins.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-10 text-center text-sm text-muted">
                  No admins found.
                </td>
              </tr>
            )}

            {!isLoading &&
              admins.map((admin) => {
                const isSelf = admin.id === currentAdminId;
                const isSuperadmin = admin.role === 'superadmin';
                // Never offer delete on the superadmin or on your own account.
                const canDelete = !isSuperadmin && !isSelf;
                return (
                  <tr key={admin.id} className="align-middle">
                    <td className="border-b border-line px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar initials={initialsOf(admin.name)} size={34} />
                        <div className="flex flex-col leading-[1.2]">
                          <span className="flex items-center gap-1.5 text-[13.5px] font-bold text-ink">
                            {admin.name}
                            {isSelf && (
                              <span className="rounded-full bg-[#f0eeea] px-1.5 py-px text-[10px] font-bold text-muted">
                                You
                              </span>
                            )}
                          </span>
                          <span className="text-[13px] text-muted">{admin.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="border-b border-line px-4 py-3.5">
                      {isSuperadmin ? (
                        <Pill className="bg-[var(--yellow-soft)] text-[var(--yellow-ink)]">
                          Superadmin
                        </Pill>
                      ) : (
                        <Pill className="bg-[#f5f5f4] text-muted">Admin</Pill>
                      )}
                    </td>
                    <td className="border-b border-line px-4 py-3.5">
                      <span className="whitespace-nowrap text-[13px] text-muted">
                        {formatDate(admin.created_at)}
                      </span>
                    </td>
                    <td className="border-b border-line px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          title="Edit admin"
                          onClick={() => onEdit(admin)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-line bg-white text-muted transition-colors hover:border-ink hover:text-ink"
                        >
                          <EditIcon size={14} />
                        </button>
                        {canDelete && (
                          <button
                            type="button"
                            title="Delete admin"
                            onClick={() => onDelete(admin)}
                            disabled={deletingId === admin.id}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-line bg-white text-muted transition-colors hover:border-[var(--red)] hover:text-[var(--red)] disabled:opacity-50"
                          >
                            <TrashIcon size={14} />
                          </button>
                        )}
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
