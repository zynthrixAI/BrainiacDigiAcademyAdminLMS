'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTeacher } from '@/lib/api/teachers';

/** Soft-delete a teacher, then refresh the list. */
export const useDeleteTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTeacher(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['teachers'] }),
  });
};
