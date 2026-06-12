'use client';

import { useTeacher } from '@/hooks/query/useTeacher';
import { Modal } from '@/components/ui/Modal';
import { TeacherProfilePanel } from './TeacherProfilePanel';

type ModalMode = 'view' | 'edit';

interface TeacherDetailModalProps {
  teacherId: string | null;
  mode: ModalMode;
  onModeChange: (mode: ModalMode) => void;
  onClose: () => void;
}

/** Fetches a teacher and shows the profile panel — view or edit. */
export function TeacherDetailModal({
  teacherId,
  mode,
  onModeChange,
  onClose,
}: TeacherDetailModalProps) {
  const { data, isLoading, isError } = useTeacher(teacherId);
  const open = teacherId !== null;
  const title = mode === 'edit' ? 'Edit teacher' : 'Teacher details';

  return (
    <Modal open={open} title={title} onClose={onClose}>
      {isLoading && <p className="py-6 text-center text-sm text-muted">Loading…</p>}
      {isError && (
        <p className="py-6 text-center text-sm text-[var(--red)]">
          Couldn’t load this teacher.
        </p>
      )}
      {data && (
        <TeacherProfilePanel
          key={`${data.id}-${mode}`}
          teacher={data}
          editing={mode === 'edit'}
          onEdit={() => onModeChange('edit')}
          onCancel={() => onModeChange('view')}
          onClose={onClose}
        />
      )}
    </Modal>
  );
}
