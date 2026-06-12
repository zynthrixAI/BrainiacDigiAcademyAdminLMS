'use client';

import { Modal } from '@/components/ui/Modal';
import { useLesson } from '@/hooks/query/useLesson';
import { LessonForm } from '@/components/forms/LessonForm';
import type { LessonPath } from '@/types/course';

interface LessonFormModalProps {
  open: boolean;
  path: LessonPath;
  /** null = create mode; otherwise edit that lesson. */
  lessonId: string | null;
  defaultOrder?: number;
  onClose: () => void;
}

/** Create or edit a lesson. In edit mode it fetches the full lesson first. */
export function LessonFormModal({
  open,
  path,
  lessonId,
  defaultOrder,
  onClose,
}: LessonFormModalProps) {
  const { data, isLoading, isError } = useLesson(path, open ? lessonId : null);
  const title = lessonId ? 'Edit lesson' : 'New lesson';

  return (
    <Modal open={open} title={title} onClose={onClose}>
      {lessonId ? (
        <>
          {isLoading && <p className="py-6 text-center text-sm text-muted">Loading…</p>}
          {isError && (
            <p className="py-6 text-center text-sm text-[var(--red)]">
              Couldn’t load this lesson.
            </p>
          )}
          {data && (
            <LessonForm
              key={data.id}
              path={path}
              lesson={data}
              onSaved={onClose}
              onCancel={onClose}
            />
          )}
        </>
      ) : (
        open && (
          <LessonForm
            key="new"
            path={path}
            defaultOrder={defaultOrder}
            onSaved={onClose}
            onCancel={onClose}
          />
        )
      )}
    </Modal>
  );
}
