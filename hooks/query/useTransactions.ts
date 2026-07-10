'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getTransactions } from '@/lib/api/subscriptions';
import type { TransactionsQuery } from '@/types/subscription';

/** Paginated payment transactions, filterable by status / purpose / search. */
export const useTransactions = (query: TransactionsQuery = {}) =>
  useQuery({
    queryKey: ['transactions', query],
    queryFn: () => getTransactions(query),
    placeholderData: keepPreviousData,
  });
