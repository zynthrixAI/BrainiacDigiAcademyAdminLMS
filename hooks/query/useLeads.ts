'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getLeads } from '@/lib/api/leads';
import type { LeadsQuery } from '@/types/lead';

/** Paginated leads list. Keeps the previous page while the next loads. */
export const useLeads = (query: LeadsQuery) =>
  useQuery({
    queryKey: ['leads', query],
    queryFn: () => getLeads(query),
    placeholderData: keepPreviousData,
  });
