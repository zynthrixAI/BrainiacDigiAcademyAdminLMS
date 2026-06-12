'use client';

import { useEffect, useState } from 'react';
import { useUsers } from '@/hooks/query/useUsers';
import { useDeleteUser } from '@/hooks/mutation/useDeleteUser';
import { useConfirm } from '@/hooks/useConfirm';
import { StudentsToolbar, type LevelFilter } from '@/components/widgets/StudentsToolbar';
import { StudentsTable } from '@/components/widgets/StudentsTable';
import { UserDetailModal } from '@/components/widgets/UserDetailModal';
import type { UserProfile } from '@/types/user';

const PAGE_SIZE = 10;

/** Admin students directory: search, level filter, pagination, delete. */
export function StudentsPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState<LevelFilter>('All');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');

  // Debounce the search box and reset to the first page on a new term.
  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(id);
  }, [searchInput]);

  const { data, isLoading, isError } = useUsers({
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    level: level === 'All' ? undefined : level,
  });

  const { mutate: removeUser, error: deleteError } = useDeleteUser();
  const confirm = useConfirm();

  const handleLevelChange = (next: LevelFilter) => {
    setLevel(next);
    setPage(1);
  };

  const openView = (user: UserProfile) => {
    setSelectedId(user.id);
    setModalMode('view');
  };

  const openEdit = (user: UserProfile) => {
    setSelectedId(user.id);
    setModalMode('edit');
  };

  const handleDelete = async (user: UserProfile) => {
    const ok = await confirm({
      title: `Delete ${user.name}?`,
      message: 'This soft-deletes the account and logs them out everywhere.',
      confirmLabel: 'Delete student',
      tone: 'danger',
    });
    if (!ok) return;
    setDeletingId(user.id);
    removeUser(user.id, { onSettled: () => setDeletingId(null) });
  };

  const total = data?.total ?? 0;
  const pages = data?.pages ?? 1;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col">
          <h1 className="font-display text-[26px] font-extrabold text-ink">Students</h1>
          <span className="mt-2 text-[13px] text-muted">
            {total} {total === 1 ? 'student' : 'students'} registered
          </span>
        </div>
        <StudentsToolbar
          search={searchInput}
          onSearchChange={setSearchInput}
          level={level}
          onLevelChange={handleLevelChange}
        />
      </div>

      {isError && (
        <p className="mb-3 text-[13px] font-medium text-[var(--red)]">
          Couldn’t load students. Check your connection and try again.
        </p>
      )}
      {deleteError && (
        <p className="mb-3 text-[13px] font-medium text-[var(--red)]">
          Couldn’t delete that student — you may not have superadmin access.
        </p>
      )}

      <StudentsTable
        users={data?.items ?? []}
        isLoading={isLoading}
        page={page}
        pages={pages}
        total={total}
        limit={PAGE_SIZE}
        deletingId={deletingId}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(pages, p + 1))}
        onView={openView}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <UserDetailModal
        userId={selectedId}
        mode={modalMode}
        onModeChange={setModalMode}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}
