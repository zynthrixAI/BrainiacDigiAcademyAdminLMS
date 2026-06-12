'use client';

import { useQuery } from '@tanstack/react-query';
import { getTeacher } from '@/lib/api/teachers';

/** Fetch a single teacher by id. Disabled until an id is provided. */
export const useTeacher = (id: string | null) =>
  useQuery({
    queryKey: ['teacher', id],
    queryFn: () => getTeacher(id as string),
    enabled: id !== null,
  });
