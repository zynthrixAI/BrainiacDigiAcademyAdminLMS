'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getBatches } from '@/lib/api/batches';
import type { BatchesQuery } from '@/types/batch';

/** Batches list. Pass `{}` for all subjects, or filter by subject / teacher.
 *  Pass `null` to disable the query entirely (e.g. before subjects load). */
export const useBatches = (query: BatchesQuery | null) =>
  useQuery({
    queryKey: ['batches', query],
    queryFn: () => getBatches(query as BatchesQuery),
    enabled: query !== null,
    placeholderData: keepPreviousData,
  });
