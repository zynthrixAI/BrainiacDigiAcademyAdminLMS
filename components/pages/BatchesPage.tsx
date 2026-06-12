'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSubjects } from '@/hooks/query/useSubjects';
import { useBatches } from '@/hooks/query/useBatches';
import { useBatchMutations } from '@/hooks/mutation/useBatchMutations';
import { useConfirm } from '@/hooks/useConfirm';
import { SubjectSelector } from '@/components/widgets/SubjectSelector';
import { BatchCard } from '@/components/widgets/BatchCard';
import { BatchFormModal } from '@/components/widgets/BatchFormModal';
import { apiErrorMessage } from '@/lib/utils/api-error';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { Card } from '@/components/ui/Card';
import { PlusIcon } from '@/components/icons/PlusIcon';
import { SearchIcon } from '@/components/icons/SearchIcon';
import { UsersIcon } from '@/components/icons/UsersIcon';
import type { Batch } from '@/types/batch';

const PUBLISH_TABS = ['All', 'Published', 'Draft'];

/** Student cohorts. Filter by a subject or view all subjects at once. */
export function BatchesPage() {
  const router = useRouter();
  const params = useSearchParams();
  const paramSubject = params.get('subject');

  const { data: subjects, isLoading: subjectsLoading } = useSubjects();

  // null = "All subjects". Seeded from the ?subject= URL param when present.
  const [subjectFilter, setSubjectFilter] = useState<string | null>(paramSubject);
  const [search, setSearch] = useState('');
  const [publish, setPublish] = useState('All');
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Batch | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { data: batches, isLoading, isError } = useBatches(
    subjectFilter ? { subject_id: subjectFilter } : {},
  );
  const { remove } = useBatchMutations();
  const confirm = useConfirm();

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (batches ?? []).filter((b) => {
      if (publish === 'Published' && !b.is_published) return false;
      if (publish === 'Draft' && b.is_published) return false;
      if (term && !b.name.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [batches, search, publish]);

  const handleDelete = async (batch: Batch) => {
    const ok = await confirm({
      title: `Delete “${batch.name}”?`,
      message: 'Its live classes and assignments are NOT deleted automatically.',
      confirmLabel: 'Delete batch',
      tone: 'danger',
    });
    if (!ok) return;
    setDeleteError(null);
    setDeletingId(batch.id);
    remove.mutate(batch.id, {
      onError: (error) => setDeleteError(apiErrorMessage(error, 'Couldn’t delete that batch.')),
      onSettled: () => setDeletingId(null),
    });
  };

  const total = batches?.length ?? 0;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col">
          <h1 className="font-display text-[26px] font-extrabold text-ink">Batches</h1>
          <span className="mt-2 text-[13px] text-muted">
            {total} {total === 1 ? 'batch' : 'batches'}
            {subjectFilter ? ' in this subject' : ' across all subjects'}
          </span>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <PlusIcon size={14} /> New batch
        </Button>
      </div>

      <div className="mb-4">
        <SubjectSelector
          subjects={subjects ?? []}
          isLoading={subjectsLoading}
          selectedId={subjectFilter}
          onSelect={setSubjectFilter}
          includeAll
        />
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-2 text-muted">
          <SearchIcon size={15} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search batch names…"
            className="w-48 min-w-0 border-0 bg-transparent text-sm text-ink outline-none placeholder:text-muted-2 sm:w-60"
          />
        </label>
        <Tabs options={PUBLISH_TABS} value={publish} onChange={setPublish} />
      </div>

      {isError && (
        <p className="mb-3 text-[13px] font-medium text-[var(--red)]">
          Couldn’t load batches. Check your connection and try again.
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
      ) : filtered.length === 0 ? (
        <Card className="flex flex-col items-center gap-2 py-14 text-center">
          <span className="text-muted-2">
            <UsersIcon size={32} />
          </span>
          <p className="font-display text-[15px] font-bold text-ink">No batches here</p>
          <p className="max-w-sm text-[13px] text-muted">
            {total === 0
              ? subjectFilter
                ? 'Create the first cohort for this subject.'
                : 'No batches yet. Create one and pick its subject.'
              : 'No batches match the current filters.'}
          </p>
          {total === 0 && (
            <Button onClick={() => setCreateOpen(true)} className="mt-2">
              <PlusIcon size={14} /> New batch
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((batch) => (
            <BatchCard
              key={batch.id}
              batch={batch}
              deleting={deletingId === batch.id}
              onManage={(b) => router.push(`/batches/${b.id}`)}
              onEdit={setEditing}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <BatchFormModal
        open={createOpen}
        subjectId={subjectFilter ?? ''}
        onClose={() => setCreateOpen(false)}
      />
      {editing && (
        <BatchFormModal
          open
          subjectId={editing.subject_id}
          batch={editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
