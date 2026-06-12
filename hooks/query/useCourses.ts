'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getCourses } from '@/lib/api/courses';
import type { CoursesQuery } from '@/types/course';

/** Paginated courses for a subject. Disabled until a subject is chosen. */
export const useCourses = (query: CoursesQuery | null) =>
  useQuery({
    queryKey: ['courses', query],
    queryFn: () => getCourses(query as CoursesQuery),
    enabled: query !== null && Boolean(query.subject_id),
    placeholderData: keepPreviousData,
  });
