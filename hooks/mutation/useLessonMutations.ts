'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createLesson,
  updateLesson,
  deleteLesson,
  uploadLessonFiles,
} from '@/lib/api/courses';
import type { LessonCreateRequest, LessonUpdateRequest, LessonPath } from '@/types/course';

/** Lesson create/update/delete + file upload — all refresh the course tree. */
export const useLessonMutations = (courseId: string) => {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['course', courseId] });

  const create = useMutation({
    mutationFn: ({ path, body }: { path: LessonPath; body: LessonCreateRequest }) =>
      createLesson(path, body),
    onSuccess: invalidate,
  });
  const update = useMutation({
    mutationFn: ({
      path,
      lessonId,
      body,
    }: {
      path: LessonPath;
      lessonId: string;
      body: LessonUpdateRequest;
    }) => updateLesson(path, lessonId, body),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: ({ path, lessonId }: { path: LessonPath; lessonId: string }) =>
      deleteLesson(path, lessonId),
    onSuccess: invalidate,
  });
  const upload = useMutation({
    mutationFn: ({ path, files }: { path: LessonPath; files: File[] }) =>
      uploadLessonFiles(path.courseId, path.topicId, path.subtopicId, files),
  });

  return { create, update, remove, upload };
};
