'use client';

import { Modal } from '@/components/ui/Modal';
import { CourseForm } from '@/components/forms/CourseForm';
import type { Course } from '@/types/course';

interface CourseFormModalProps {
  open: boolean;
  subjectId: string;
  course?: Course;
  onClose: () => void;
}

/** Create or edit a course. Pass `course` to edit. */
export function CourseFormModal({ open, subjectId, course, onClose }: CourseFormModalProps) {
  return (
    <Modal open={open} title={course ? 'Edit course' : 'New course'} onClose={onClose}>
      {open && (
        <CourseForm
          key={course?.id ?? 'new'}
          subjectId={subjectId}
          course={course}
          onSaved={onClose}
          onCancel={onClose}
        />
      )}
    </Modal>
  );
}
