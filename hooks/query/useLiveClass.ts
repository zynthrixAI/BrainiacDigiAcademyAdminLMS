'use client';

import { useQuery } from '@tanstack/react-query';
import { getLiveClass } from '@/lib/api/live-classes';

/** A single live class. Disabled until an id is set. */
export const useLiveClass = (id: string | null) =>
  useQuery({
    queryKey: ['live-class', id],
    queryFn: () => getLiveClass(id as string),
    enabled: id !== null,
  });
