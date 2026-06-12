'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSubtopic, updateSubtopic, deleteSubtopic } from '@/lib/api/courses';
import type { SubtopicCreateRequest, SubtopicUpdateRequest } from '@/types/course';

/** Subtopic create/update/delete under a topic — all refresh the course tree. */
export const useSubtopicMutations = (courseId: string) => {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['course', courseId] });

  const create = useMutation({
    mutationFn: ({ topicId, body }: { topicId: string; body: SubtopicCreateRequest }) =>
      createSubtopic(courseId, topicId, body),
    onSuccess: invalidate,
  });
  const update = useMutation({
    mutationFn: ({
      topicId,
      subtopicId,
      body,
    }: {
      topicId: string;
      subtopicId: string;
      body: SubtopicUpdateRequest;
    }) => updateSubtopic(courseId, topicId, subtopicId, body),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: ({ topicId, subtopicId }: { topicId: string; subtopicId: string }) =>
      deleteSubtopic(courseId, topicId, subtopicId),
    onSuccess: invalidate,
  });

  return { create, update, remove };
};
