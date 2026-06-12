'use client';

import { useMemo, useState } from 'react';
import { useSubjectsList } from '@/hooks/query/useSubjectsList';
import { useSubjectMutations } from '@/hooks/mutation/useSubjectMutations';
import { useConfirm } from '@/hooks/useConfirm';
import { SubjectCard } from '@/components/widgets/SubjectCard';
import { SubjectFormModal } from '@/components/widgets/SubjectFormModal';
import { apiErrorMessage } from '@/lib/utils/api-error';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { Card } from '@/components/ui/Card';
import { PlusIcon } from '@/components/icons/PlusIcon';
import { LayersIcon } from '@/components/icons/LayersIcon';
import type { Subject } from '@/types/subject';

const PAGE_SIZE = 9;
const PUBLISH_TABS = ['All', 'Published', 'Draft'];

/** Top-level subject catalogue — create/edit/delete. Subjects scope batches & courses. */
export function SubjectsPage() {
  const [page, setPage] = useState(1);
  const [publish, setPublish] = useState('All');
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Subject | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const isPublished = publish === 'All' ? undefined : publish === 'Published';

  const query = useMemo(
    () => ({ page, limit: PAGE_SIZE, is_published: isPublished }),
    [page, isPublished],
  );

  const { data, isLoading, isError } = useSubjectsList(query);
  const { remove } = useSubjectMutations();
  const confirm = useConfirm();

  const handlePublishChange = (next: string) => {
    setPublish(next);
    setPage(1);
  };

  const handleDelete = async (subject: Subject) => {
    const ok = await confirm({
      title: `Delete “${subject.name}”?`,
      message:
        'Its batches, courses and live classes are NOT deleted automatically — clean them up first to avoid orphaned content.',
      confirmLabel: 'Delete subject',
      tone: 'danger',
    });
    if (!ok) return;
    setDeleteError(null);
    setDeletingId(subject.id);
    remove.mutate(subject.id, {
      onError: (error) =>
        setDeleteError(apiErrorMessage(error, 'Couldn’t delete that subject.')),
      onSettled: () => setDeletingId(null),
    });
  };

  const subjects = data?.items ?? [];
  const total = data?.total ?? 0;
  const pages = data?.pages ?? 1;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col">
          <h1 className="font-display text-[26px] font-extrabold text-ink">Subjects</h1>
          <span className="mt-2 text-[13px] text-muted">
            {total} {total === 1 ? 'subject' : 'subjects'}
          </span>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <PlusIcon size={14} /> New subject
        </Button>
      </div>

      <div className="mb-5">
        <Tabs options={PUBLISH_TABS} value={publish} onChange={handlePublishChange} />
      </div>

      {isError && (
        <p className="mb-3 text-[13px] font-medium text-[var(--red)]">
          Couldn’t load subjects. Check your connection and try again.
        </p>
      )}
      {deleteError && (
        <p className="mb-3 text-[13px] font-medium text-[var(--red)]">{deleteError}</p>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-[var(--radius)] bg-line" />
          ))}
        </div>
      ) : subjects.length === 0 ? (
        <Card className="flex flex-col items-center gap-2 py-14 text-center">
          <span className="text-muted-2">
            <LayersIcon size={32} />
          </span>
          <p className="font-display text-[15px] font-bold text-ink">No subjects yet</p>
          <p className="max-w-sm text-[13px] text-muted">
            Create your first subject — it’s the top-level area that batches, courses and
            live classes hang off.
          </p>
          <Button onClick={() => setCreateOpen(true)} className="mt-2">
            <PlusIcon size={14} /> New subject
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              deleting={deletingId === subject.id}
              onEdit={setEditing}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {subjects.length > 0 && (
        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="text-[13px] text-muted">
            Page {page} of {pages}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-2.5 py-1.5 text-xs"
            >
              ← Prev
            </Button>
            <Button
              variant="ghost"
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page >= pages}
              className="px-2.5 py-1.5 text-xs"
            >
              Next →
            </Button>
          </div>
        </div>
      )}

      <SubjectFormModal open={createOpen} onClose={() => setCreateOpen(false)} />
      {editing && (
        <SubjectFormModal open subject={editing} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}
