'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getRecordings } from '@/lib/api/recordings';
import type { RecordingsQuery } from '@/types/recording';

/** Recordings list (filterable). Any authenticated admin can read. */
export const useRecordings = (query: RecordingsQuery) =>
  useQuery({
    queryKey: ['recordings', query],
    queryFn: () => getRecordings(query),
    placeholderData: keepPreviousData,
  });
