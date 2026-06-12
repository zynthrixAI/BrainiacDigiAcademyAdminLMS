'use client';

import { useQuery } from '@tanstack/react-query';
import { getRobinQueries } from '@/lib/api/robin-log';

/** Fetches the platform-wide Robin (AI tutor) query log. */
export const useRobinQueries = () =>
  useQuery({
    queryKey: ['robin-queries'],
    queryFn: getRobinQueries,
  });
