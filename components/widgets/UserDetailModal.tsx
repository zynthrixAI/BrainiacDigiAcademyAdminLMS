'use client';

import { useUser } from '@/hooks/query/useUser';
import { Modal } from '@/components/ui/Modal';
import { UserProfilePanel } from './UserProfilePanel';

type ModalMode = 'view' | 'edit';

interface UserDetailModalProps {
  userId: string | null;
  mode: ModalMode;
  onModeChange: (mode: ModalMode) => void;
  onClose: () => void;
}

/** Fetches a user and shows their profile in one panel — view or edit. */
export function UserDetailModal({
  userId,
  mode,
  onModeChange,
  onClose,
}: UserDetailModalProps) {
  const { data, isLoading, isError } = useUser(userId);
  const open = userId !== null;
  const title = mode === 'edit' ? 'Edit student' : 'Student details';

  return (
    <Modal open={open} title={title} onClose={onClose}>
      {isLoading && <p className="py-6 text-center text-sm text-muted">Loading…</p>}
      {isError && (
        <p className="py-6 text-center text-sm text-[var(--red)]">
          Couldn’t load this student.
        </p>
      )}
      {data && (
        <UserProfilePanel
          key={`${data.id}-${mode}`}
          user={data}
          editing={mode === 'edit'}
          onEdit={() => onModeChange('edit')}
          onCancel={() => onModeChange('view')}
          onClose={onClose}
        />
      )}
    </Modal>
  );
}
