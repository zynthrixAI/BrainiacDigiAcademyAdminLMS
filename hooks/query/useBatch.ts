'use client';

import { useQuery } from '@tanstack/react-query';
import { getBatch } from '@/lib/api/batches';

/** Fetch a single batch with its enrolled students. Disabled until an id is set. */
export const useBatch = (id: string | null) =>
  useQuery({
    queryKey: ['batch', id],
    queryFn: () => getBatch(id as string),
    enabled: id !== null,
  });
