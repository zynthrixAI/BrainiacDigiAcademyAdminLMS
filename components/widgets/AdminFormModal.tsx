'use client';

import { Modal } from '@/components/ui/Modal';
import { AdminForm } from '@/components/forms/AdminForm';
import type { AdminProfile } from '@/types/admin';

interface AdminFormModalProps {
  open: boolean;
  admin?: AdminProfile;
  onClose: () => void;
}

/** Create or edit an admin. Pass `admin` to edit. */
export function AdminFormModal({ open, admin, onClose }: AdminFormModalProps) {
  return (
    <Modal open={open} title={admin ? 'Edit admin' : 'Add admin'} onClose={onClose}>
      {open && (
        <AdminForm key={admin?.id ?? 'new'} admin={admin} onSaved={onClose} onCancel={onClose} />
      )}
    </Modal>
  );
}
