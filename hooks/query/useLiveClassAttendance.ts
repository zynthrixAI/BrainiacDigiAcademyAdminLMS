'use client';

import { useQuery } from '@tanstack/react-query';
import { getLiveClassAttendance } from '@/lib/api/live-classes';

/** Attendance report for a live class. Disabled until an id is set. */
export const useLiveClassAttendance = (id: string | null) =>
  useQuery({
    queryKey: ['live-class-attendance', id],
    queryFn: () => getLiveClassAttendance(id as string),
    enabled: id !== null,
  });
