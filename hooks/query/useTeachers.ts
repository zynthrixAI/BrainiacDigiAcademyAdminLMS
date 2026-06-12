'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getTeachers } from '@/lib/api/teachers';
import type { TeachersQuery } from '@/types/teacher';

/** Paginated teachers list. Keeps the previous page while the next loads. */
export const useTeachers = (query: TeachersQuery) =>
  useQuery({
    queryKey: ['teachers', query],
    queryFn: () => getTeachers(query),
    placeholderData: keepPreviousData,
  });
