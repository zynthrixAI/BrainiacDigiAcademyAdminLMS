'use client';

import { useQuery } from '@tanstack/react-query';
import { getRecording } from '@/lib/api/recordings';

/** Fetch a single recording by id. Disabled until an id is provided. */
export const useRecording = (id: string | null) =>
  useQuery({
    queryKey: ['recording', id],
    queryFn: () => getRecording(id as string),
    enabled: id !== null,
  });
