'use client';

import { useQuery } from '@tanstack/react-query';
import { getSubscriptions } from '@/lib/api/subscriptions';

/** Fetches the subscriptions snapshot (KPIs, facet counts, and rows). */
export const useSubscriptions = () =>
  useQuery({
    queryKey: ['subscriptions'],
    queryFn: getSubscriptions,
  });
