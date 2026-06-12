'use client';

import { useQuery } from '@tanstack/react-query';
import type { AnalyticsPeriod } from '@/types/analytics';
import { getAnalytics } from '@/lib/api/analytics';

/** Fetches the analytics snapshot for a reporting window. */
export const useAnalytics = (period: AnalyticsPeriod) =>
  useQuery({
    queryKey: ['analytics', period],
    queryFn: () => getAnalytics(period),
  });
