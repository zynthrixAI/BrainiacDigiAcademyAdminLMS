'use client';

import { useMemo, useState } from 'react';
import type { Batch } from '@/types/batch';
import type { Recording, RecordingStatus } from '@/types/recording';
import { useRecordings } from '@/hooks/query/useRecordings';
import { useBatchLiveClasses } from '@/hooks/query/useBatchLiveClasses';
import { useRecordingMutations } from '@/hooks/mutation/useRecordingMutations';
import { useConfirm } from '@/hooks/useConfirm';
import { apiErrorMessage } from '@/lib/utils/api-error';
import { RecordingsTable } from '@/components/widgets/RecordingsTable';
import { RecordingFormModal } from '@/components/widgets/RecordingFormModal';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { PlusIcon } from '@/components/icons/PlusIcon';

interface BatchRecordingsProps {
  batch: Batch;
}

const STATUS_TABS = ['All', 'Processing', 'Draft', 'Pending edit', 'Published'];
const STATUS_BY_TAB: Record<string, RecordingStatus | undefined> = {
  All: undefined,
  Processing: 'processing',
  Draft: 'draft',
  'Pending edit': 'pending_edit',
  Published: 'published',
};

/** Recordings for one batch — full CRUD. Create attaches to one of the batch's
 *  live classes (picked from a dropdown rather than a raw ObjectId). */
export function BatchRecordings({ batch }: BatchRecordingsProps) {
  const [statusTab, setStatusTab] = useState('All');
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Recording | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const query = useMemo(
    () => ({ batch_id: batch.id, status: STATUS_BY_TAB[statusTab] }),
    [batch.id, statusTab],
  );

  const { data, isLoading, isError } = useRecordings(query);
  const { remove } = useRecordingMutations();
  const confirm = useConfirm();

  // Live classes of this batch populate the create-mode picker.
  const { data: liveClasses } = useBatchLiveClasses(batch.id, { limit: 100 });

  const handleDelete = async (recording: Recording) => {
    const ok = await confirm({
      title: `Delete “${recording.title}”?`,
      message: 'This recording will be removed. This cannot be undone.',
      confirmLabel: 'Delete recording',
      tone: 'danger',
    });
    if (!ok) return;
    setDeleteError(null);
    setDeletingId(recording.id);
    remove.mutate(recording.id, {
      onError: (error) =>
        setDeleteError(apiErrorMessage(error, 'Couldn’t delete that recording.')),
      onSettled: () => setDeletingId(null),
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="overflow-x-auto">
          <Tabs options={STATUS_TABS} value={statusTab} onChange={setStatusTab} />
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <PlusIcon size={14} /> Add recording
        </Button>
      </div>

      {isError && (
        <p className="text-[13px] font-medium text-[var(--red)]">
          Couldn’t load recordings. Check your connection and try again.
        </p>
      )}
      {deleteError && (
        <p className="text-[13px] font-medium text-[var(--red)]">{deleteError}</p>
      )}

      <RecordingsTable
        recordings={data ?? []}
        isLoading={isLoading}
        deletingId={deletingId}
        onEdit={setEditing}
        onDelete={handleDelete}
      />

      <RecordingFormModal
        open={createOpen}
        liveClasses={liveClasses?.items ?? []}
        onClose={() => setCreateOpen(false)}
      />
      {editing && (
        <RecordingFormModal open recording={editing} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}
