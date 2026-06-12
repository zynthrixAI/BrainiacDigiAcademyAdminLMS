'use client';

import { Modal } from '@/components/ui/Modal';
import { BatchForm } from '@/components/forms/BatchForm';
import type { Batch } from '@/types/batch';

interface BatchFormModalProps {
  open: boolean;
  subjectId: string;
  batch?: Batch;
  onClose: () => void;
}

/** Create or edit a batch. Pass `batch` to edit. */
export function BatchFormModal({ open, subjectId, batch, onClose }: BatchFormModalProps) {
  return (
    <Modal open={open} title={batch ? 'Edit batch' : 'New batch'} onClose={onClose}>
      {open && (
        <BatchForm
          key={batch?.id ?? 'new'}
          subjectId={subjectId}
          batch={batch}
          onSaved={onClose}
          onCancel={onClose}
        />
      )}
    </Modal>
  );
}
