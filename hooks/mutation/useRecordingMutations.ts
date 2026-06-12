'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRecording, updateRecording, deleteRecording } from '@/lib/api/recordings';
import type { RecordingCreateRequest, RecordingUpdateRequest } from '@/types/recording';

/** Recording create/update/delete — open to any authenticated admin. */
export const useRecordingMutations = () => {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['recordings'] });

  const create = useMutation({
    mutationFn: ({ liveClassId, body }: { liveClassId: string; body: RecordingCreateRequest }) =>
      createRecording(liveClassId, body),
    onSuccess: invalidate,
  });
  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: RecordingUpdateRequest }) =>
      updateRecording(id, body),
    onSuccess: (_data, { id }) => {
      invalidate();
      qc.invalidateQueries({ queryKey: ['recording', id] });
    },
  });
  const remove = useMutation({
    mutationFn: (id: string) => deleteRecording(id),
    onSuccess: invalidate,
  });

  return { create, update, remove };
};
