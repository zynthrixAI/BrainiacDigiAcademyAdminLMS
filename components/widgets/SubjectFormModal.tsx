'use client';

import { Modal } from '@/components/ui/Modal';
import { SubjectForm } from '@/components/forms/SubjectForm';
import type { Subject } from '@/types/subject';

interface SubjectFormModalProps {
  open: boolean;
  subject?: Subject;
  onClose: () => void;
}

/** Create or edit a subject. Pass `subject` to edit. */
export function SubjectFormModal({ open, subject, onClose }: SubjectFormModalProps) {
  return (
    <Modal open={open} title={subject ? 'Edit subject' : 'New subject'} onClose={onClose}>
      {open && (
        <SubjectForm
          key={subject?.id ?? 'new'}
          subject={subject}
          onSaved={onClose}
          onCancel={onClose}
        />
      )}
    </Modal>
  );
}
