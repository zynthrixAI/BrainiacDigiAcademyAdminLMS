'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTeacher } from '@/lib/api/teachers';
import type { TeacherCreateRequest } from '@/types/teacher';

/** Create a teacher, then refresh the list. */
export const useCreateTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: TeacherCreateRequest) => createTeacher(body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['teachers'] }),
  });
};
