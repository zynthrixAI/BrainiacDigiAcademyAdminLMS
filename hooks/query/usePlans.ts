'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getPlans } from '@/lib/api/subscriptions';
import type { PlansQuery } from '@/types/subscription';

/** Paginated subscription plans, filterable by name search / status. */
export const usePlans = (query: PlansQuery = {}) =>
  useQuery({
    queryKey: ['subscription-plans', query],
    queryFn: () => getPlans(query),
    placeholderData: keepPreviousData,
  });
