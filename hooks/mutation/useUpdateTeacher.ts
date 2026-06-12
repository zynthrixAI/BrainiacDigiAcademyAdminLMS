'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTeacher } from '@/lib/api/teachers';
import type { TeacherUpdateRequest } from '@/types/teacher';

/** Update a teacher, then refresh the list and cached profile. */
export const useUpdateTeacher = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: TeacherUpdateRequest) => updateTeacher(id, body),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      queryClient.setQueryData(['teacher', id], updated);
    },
  });
};
