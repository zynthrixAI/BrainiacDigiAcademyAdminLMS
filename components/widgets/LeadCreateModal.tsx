'use client';

import { Modal } from '@/components/ui/Modal';
import { LeadCreateForm } from '@/components/forms/LeadCreateForm';

interface LeadCreateModalProps {
  open: boolean;
  onClose: () => void;
}

/** Modal wrapper for creating a lead. */
export function LeadCreateModal({ open, onClose }: LeadCreateModalProps) {
  return (
    <Modal open={open} title="Add lead" onClose={onClose}>
      <LeadCreateForm onCreated={onClose} onCancel={onClose} />
    </Modal>
  );
}
