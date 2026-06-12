'use client';

import { useQuery } from '@tanstack/react-query';
import { getDashboard } from '@/lib/api/dashboard';

/** Fetches the admin dashboard snapshot. */
export const useDashboard = () =>
  useQuery({ queryKey: ['dashboard'], queryFn: getDashboard });
