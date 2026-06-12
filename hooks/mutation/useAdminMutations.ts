'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAdmin, updateAdmin, deleteAdmin } from '@/lib/api/admins';
import type { AdminCreateRequest, AdminUpdateRequest } from '@/types/admin';

/** Create / update / delete admin accounts (superadmin only). */
export const useAdminMutations = () => {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['admins'] });

  const create = useMutation({
    mutationFn: (body: AdminCreateRequest) => createAdmin(body),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: AdminUpdateRequest }) =>
      updateAdmin(id, body),
    onSuccess: () => {
      invalidate();
      // Editing yourself changes your own profile too.
      qc.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteAdmin(id),
    onSuccess: invalidate,
  });

  return { create, update, remove };
};
