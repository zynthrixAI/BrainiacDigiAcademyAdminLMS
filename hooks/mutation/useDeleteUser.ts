'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUser } from '@/lib/api/users';

/** Soft-delete a user, then refresh the users list. */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
};
