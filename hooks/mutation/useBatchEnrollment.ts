'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollStudent, unenrollStudent } from '@/lib/api/batches';
import type { BatchDetail } from '@/types/batch';

/** Enroll / unenroll students for one batch. Both return the refreshed batch,
 *  which we push straight into the cache and also invalidate the list count. */
export const useBatchEnrollment = (batchId: string) => {
  const qc = useQueryClient();
  const onSuccess = (data: BatchDetail) => {
    qc.setQueryData(['batch', batchId], data);
    qc.invalidateQueries({ queryKey: ['batches'] });
  };

  const enroll = useMutation({
    mutationFn: (studentId: string) => enrollStudent(batchId, studentId),
    onSuccess,
  });
  const unenroll = useMutation({
    mutationFn: (studentId: string) => unenrollStudent(batchId, studentId),
    onSuccess,
  });

  return { enroll, unenroll };
};
