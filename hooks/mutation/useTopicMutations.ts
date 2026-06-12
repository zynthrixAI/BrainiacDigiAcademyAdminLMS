'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTopic, updateTopic, deleteTopic } from '@/lib/api/courses';
import type { TopicCreateRequest, TopicUpdateRequest } from '@/types/course';

/** Topic create/update/delete — all refresh the course tree. */
export const useTopicMutations = (courseId: string) => {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['course', courseId] });

  const create = useMutation({
    mutationFn: (body: TopicCreateRequest) => createTopic(courseId, body),
    onSuccess: invalidate,
  });
  const update = useMutation({
    mutationFn: ({ topicId, body }: { topicId: string; body: TopicUpdateRequest }) =>
      updateTopic(courseId, topicId, body),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (topicId: string) => deleteTopic(courseId, topicId),
    onSuccess: invalidate,
  });

  return { create, update, remove };
};
