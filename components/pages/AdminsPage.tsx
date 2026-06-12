'use client';

import { useState } from 'react';
import { useProfile } from '@/hooks/query/useProfile';
import { useAdmins } from '@/hooks/query/useAdmins';
import { useAdminMutations } from '@/hooks/mutation/useAdminMutations';
import { useConfirm } from '@/hooks/useConfirm';
import { AdminsTable } from '@/components/widgets/AdminsTable';
import { AdminFormModal } from '@/components/widgets/AdminFormModal';
import { apiErrorMessage } from '@/lib/utils/api-error';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PlusIcon } from '@/components/icons/PlusIcon';
import { ShieldIcon } from '@/components/icons/ShieldIcon';
import type { AdminProfile } from '@/types/admin';

/** Admin-account management — superadmin only. List, create, edit, delete. */
export function AdminsPage() {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const isSuperadmin = profile?.role === 'superadmin';

  const { data: admins, isLoading, isError } = useAdmins(isSuperadmin);
  const { remove } = useAdminMutations();
  const confirm = useConfirm();

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<AdminProfile | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (profileLoading || !profile) {
    return <p className="text-[14px] text-muted">Loading…</p>;
  }

  if (!isSuperadmin) {
    return (
      <Card className="flex flex-col items-center gap-2 py-14 text-center">
        <span className="text-muted-2">
          <ShieldIcon size={32} />
        </span>
        <p className="font-display text-[15px] font-bold text-ink">Superadmin only</p>
        <p className="max-w-sm text-[13px] text-muted">
          Admin-account management is restricted to the superadmin. Ask them to add or change
          admin accounts.
        </p>
      </Card>
    );
  }

  const handleDelete = async (admin: AdminProfile) => {
    const ok = await confirm({
      title: `Delete ${admin.name}?`,
      message: 'This soft-deletes the admin account — they can no longer sign in.',
      confirmLabel: 'Delete admin',
      tone: 'danger',
    });
    if (!ok) return;
    setDeleteError(null);
    setDeletingId(admin.id);
    remove.mutate(admin.id, {
      onError: (error) => setDeleteError(apiErrorMessage(error, 'Couldn’t delete that admin.')),
      onSettled: () => setDeletingId(null),
    });
  };

  const total = admins?.length ?? 0;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col">
          <h1 className="font-display text-[26px] font-extrabold text-ink">Admins</h1>
          <span className="mt-2 text-[13px] text-muted">
            {total} {total === 1 ? 'admin account' : 'admin accounts'}
          </span>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <PlusIcon size={14} /> Add admin
        </Button>
      </div>

      {isError && (
        <p className="mb-3 text-[13px] font-medium text-[var(--red)]">
          Couldn’t load admins. Check your connection and try again.
        </p>
      )}
      {deleteError && (
        <p className="mb-3 text-[13px] font-medium text-[var(--red)]">{deleteError}</p>
      )}

      <AdminsTable
        admins={admins ?? []}
        isLoading={isLoading}
        currentAdminId={profile.id}
        deletingId={deletingId}
        onEdit={setEditing}
        onDelete={handleDelete}
      />

      <AdminFormModal open={createOpen} onClose={() => setCreateOpen(false)} />
      {editing && <AdminFormModal open admin={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
