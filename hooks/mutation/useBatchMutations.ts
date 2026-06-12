'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBatch, updateBatch, deleteBatch } from '@/lib/api/batches';
import type { BatchCreateRequest, BatchUpdateRequest } from '@/types/batch';

/** Batch create/update/delete. Writes require superadmin (403 otherwise). */
export const useBatchMutations = () => {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['batches'] });

  const create = useMutation({
    mutationFn: (body: BatchCreateRequest) => createBatch(body),
    onSuccess: invalidate,
  });
  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: BatchUpdateRequest }) =>
      updateBatch(id, body),
    onSuccess: (_data, { id }) => {
      invalidate();
      qc.invalidateQueries({ queryKey: ['batch', id] });
    },
  });
  const remove = useMutation({
    mutationFn: (id: string) => deleteBatch(id),
    onSuccess: invalidate,
  });

  return { create, update, remove };
};
