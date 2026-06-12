'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getSubjectsList } from '@/lib/api/subjects';
import type { SubjectsQuery } from '@/types/subject';

/** Paginated subjects for the management page. Keeps the previous page while loading. */
export const useSubjectsList = (query: SubjectsQuery) =>
  useQuery({
    queryKey: ['subjects', query],
    queryFn: () => getSubjectsList(query),
    placeholderData: keepPreviousData,
  });
