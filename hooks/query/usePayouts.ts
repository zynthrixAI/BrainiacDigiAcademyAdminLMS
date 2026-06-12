'use client';

import { useQuery } from '@tanstack/react-query';
import { getPayouts } from '@/lib/api/payouts';

/** Fetches teacher payouts across periods. */
export const usePayouts = () =>
  useQuery({
    queryKey: ['payouts'],
    queryFn: getPayouts,
  });
