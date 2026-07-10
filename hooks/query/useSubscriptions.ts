'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getSubscriptions } from '@/lib/api/subscriptions';
import type { SubscriptionsQuery } from '@/types/subscription';

/** Paginated student subscriptions, filterable by status / search. */
export const useSubscriptions = (query: SubscriptionsQuery = {}) =>
  useQuery({
    queryKey: ['subscriptions', query],
    queryFn: () => getSubscriptions(query),
    placeholderData: keepPreviousData,
  });
