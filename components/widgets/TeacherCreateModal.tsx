'use client';

import { Modal } from '@/components/ui/Modal';
import { TeacherCreateForm } from '@/components/forms/TeacherCreateForm';

interface TeacherCreateModalProps {
  open: boolean;
  onClose: () => void;
}

/** Modal wrapper for creating a teacher. */
export function TeacherCreateModal({ open, onClose }: TeacherCreateModalProps) {
  return (
    <Modal open={open} title="Add teacher" onClose={onClose}>
      <TeacherCreateForm onCreated={onClose} onCancel={onClose} />
    </Modal>
  );
}
