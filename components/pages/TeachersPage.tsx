'use client';

import { useEffect, useState } from 'react';
import { useTeachers } from '@/hooks/query/useTeachers';
import { useDeleteTeacher } from '@/hooks/mutation/useDeleteTeacher';
import { useConfirm } from '@/hooks/useConfirm';
import { TeachersTable } from '@/components/widgets/TeachersTable';
import { TeacherDetailModal } from '@/components/widgets/TeacherDetailModal';
import { TeacherCreateModal } from '@/components/widgets/TeacherCreateModal';
import { Button } from '@/components/ui/Button';
import { PlusIcon } from '@/components/icons/PlusIcon';
import { SearchIcon } from '@/components/icons/SearchIcon';
import type { Teacher } from '@/types/teacher';

const PAGE_SIZE = 10;

/** Admin teachers directory: list, create, view/edit, delete. */
export function TeachersPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');
  const [createOpen, setCreateOpen] = useState(false);

  // Debounce the search box and reset to the first page on a new term.
  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(id);
  }, [searchInput]);

  const { data, isLoading, isError } = useTeachers({
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
  });
  const { mutate: removeTeacher, error: deleteError } = useDeleteTeacher();
  const confirm = useConfirm();

  const openView = (teacher: Teacher) => {
    setSelectedId(teacher.id);
    setModalMode('view');
  };

  const openEdit = (teacher: Teacher) => {
    setSelectedId(teacher.id);
    setModalMode('edit');
  };

  const handleDelete = async (teacher: Teacher) => {
    const ok = await confirm({
      title: `Delete ${teacher.name}?`,
      message: 'This revokes their login. Reassign their batches first if needed.',
      confirmLabel: 'Delete teacher',
      tone: 'danger',
    });
    if (!ok) return;
    setDeletingId(teacher.id);
    removeTeacher(teacher.id, { onSettled: () => setDeletingId(null) });
  };

  const total = data?.total ?? 0;
  const pages = data?.pages ?? 1;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col">
          <h1 className="font-display text-[26px] font-extrabold text-ink">Teachers</h1>
          <span className="mt-2 text-[13px] text-muted">
            {total} {total === 1 ? 'teacher' : 'teachers'}
          </span>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <PlusIcon size={14} /> Add teacher
        </Button>
      </div>

      <div className="mb-5">
        <label className="flex w-full max-w-xs items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-2 text-muted focus-within:border-yellow">
          <SearchIcon size={15} />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full min-w-0 border-0 bg-transparent text-sm text-ink outline-none placeholder:text-muted-2"
          />
        </label>
      </div>

      {isError && (
        <p className="mb-3 text-[13px] font-medium text-[var(--red)]">
          Couldn’t load teachers. Check your connection and try again.
        </p>
      )}
      {deleteError && (
        <p className="mb-3 text-[13px] font-medium text-[var(--red)]">
          Couldn’t delete that teacher. Please try again.
        </p>
      )}

      <TeachersTable
        teachers={data?.items ?? []}
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

      <TeacherDetailModal
        teacherId={selectedId}
        mode={modalMode}
        onModeChange={setModalMode}
        onClose={() => setSelectedId(null)}
      />

      <TeacherCreateModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}
