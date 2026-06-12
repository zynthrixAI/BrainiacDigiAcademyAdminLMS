'use client';

import { useQuery } from '@tanstack/react-query';
import { getLesson } from '@/lib/api/courses';
import type { LessonPath } from '@/types/course';

/** Fetch a full lesson for editing. Disabled until a lesson id is provided. */
export const useLesson = (path: LessonPath, lessonId: string | null) =>
  useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => getLesson(path, lessonId as string),
    enabled: lessonId !== null,
  });
