'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from '@/lib/api/users';
import type { AdminUserUpdateRequest } from '@/types/user';

/** Update a user, then refresh the list and the cached profile. */
export const useUpdateUser = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: AdminUserUpdateRequest) => updateUser(id, body),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.setQueryData(['user', id], updated);
    },
  });
};
