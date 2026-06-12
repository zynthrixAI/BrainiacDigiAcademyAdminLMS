'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getBatchLiveClasses } from '@/lib/api/live-classes';
import type { LiveClassesQuery } from '@/types/live-class';

/** Paginated live classes for a batch. Disabled until a batch id is set. */
export const useBatchLiveClasses = (batchId: string | null, query: LiveClassesQuery = {}) =>
  useQuery({
    queryKey: ['live-classes', batchId, query],
    queryFn: () => getBatchLiveClasses(batchId as string, query),
    enabled: batchId !== null,
    placeholderData: keepPreviousData,
  });
