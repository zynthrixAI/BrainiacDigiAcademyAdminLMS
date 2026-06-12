'use client';

import { useQuery } from '@tanstack/react-query';
import { getLead } from '@/lib/api/leads';

/** Fetch a single lead by id. Disabled until an id is provided. */
export const useLead = (id: string | null) =>
  useQuery({
    queryKey: ['lead', id],
    queryFn: () => getLead(id as string),
    enabled: id !== null,
  });
