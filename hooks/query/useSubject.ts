'use client';

import { useQuery } from '@tanstack/react-query';
import { getSubject } from '@/lib/api/subjects';

/** Fetch a single subject by id. Disabled until an id is provided. */
export const useSubject = (id: string | null) =>
  useQuery({
    queryKey: ['subject', id],
    queryFn: () => getSubject(id as string),
    enabled: id !== null,
  });
