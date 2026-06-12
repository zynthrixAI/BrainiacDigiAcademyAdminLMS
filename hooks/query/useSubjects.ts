'use client';

import { useQuery } from '@tanstack/react-query';
import { getSubjects } from '@/lib/api/subjects';

/** All subjects, for scoping the course catalogue. Cached for the session. */
export const useSubjects = () =>
  useQuery({
    queryKey: ['subjects'],
    queryFn: getSubjects,
    staleTime: 5 * 60 * 1000,
  });
