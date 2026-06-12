'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollLead } from '@/lib/api/leads';

/** Enroll a lead as a student, then refresh the list and cached record. */
export const useEnrollLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => enrollLead(id),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.setQueryData(['lead', result.lead.id], result.lead);
    },
  });
};
