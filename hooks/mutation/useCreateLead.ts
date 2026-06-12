'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLead } from '@/lib/api/leads';
import type { LeadCreateRequest } from '@/types/lead';

/** Create a lead, then refresh the list. */
export const useCreateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: LeadCreateRequest) => createLead(body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leads'] }),
  });
};
