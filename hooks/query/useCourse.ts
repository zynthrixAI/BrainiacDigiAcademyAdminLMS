'use client';

import { useQuery } from '@tanstack/react-query';
import { getCourse } from '@/lib/api/courses';

/** A single course with its full topic/subtopic/lesson tree. */
export const useCourse = (id: string | null) =>
  useQuery({
    queryKey: ['course', id],
    queryFn: () => getCourse(id as string),
    enabled: id !== null,
  });
