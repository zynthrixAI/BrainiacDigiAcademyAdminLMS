'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateLead } from '@/lib/api/leads';
import type { LeadUpdateRequest } from '@/types/lead';

/** Update a lead, then refresh the list and cached record. */
export const useUpdateLead = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: LeadUpdateRequest) => updateLead(id, body),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.setQueryData(['lead', id], updated);
    },
  });
};
