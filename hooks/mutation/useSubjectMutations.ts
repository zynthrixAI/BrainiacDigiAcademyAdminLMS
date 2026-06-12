'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSubject, updateSubject, deleteSubject } from '@/lib/api/subjects';
import type { SubjectCreateRequest, SubjectUpdateRequest } from '@/types/subject';

/** Subject create/update/delete. Writes require superadmin (403 otherwise). */
export const useSubjectMutations = () => {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['subjects'] });

  const create = useMutation({
    mutationFn: (body: SubjectCreateRequest) => createSubject(body),
    onSuccess: invalidate,
  });
  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: SubjectUpdateRequest }) =>
      updateSubject(id, body),
    onSuccess: (_data, { id }) => {
      invalidate();
      qc.invalidateQueries({ queryKey: ['subject', id] });
    },
  });
  const remove = useMutation({
    mutationFn: (id: string) => deleteSubject(id),
    onSuccess: invalidate,
  });

  return { create, update, remove };
};
