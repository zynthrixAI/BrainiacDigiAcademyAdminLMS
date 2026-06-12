'use client';

import { Modal } from '@/components/ui/Modal';
import { RecordingForm } from '@/components/forms/RecordingForm';
import type { Recording } from '@/types/recording';
import type { LiveClass } from '@/types/live-class';

interface RecordingFormModalProps {
  open: boolean;
  recording?: Recording;
  /** Batch live classes for the create-mode picker. */
  liveClasses?: LiveClass[];
  onClose: () => void;
}

/** Create or edit a recording. Pass `recording` to edit. */
export function RecordingFormModal({
  open,
  recording,
  liveClasses,
  onClose,
}: RecordingFormModalProps) {
  return (
    <Modal open={open} title={recording ? 'Edit recording' : 'Add recording'} onClose={onClose}>
      {open && (
        <RecordingForm
          key={recording?.id ?? 'new'}
          recording={recording}
          liveClasses={liveClasses}
          onSaved={onClose}
          onCancel={onClose}
        />
      )}
    </Modal>
  );
}
