'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteLead } from '@/lib/api/leads';

/** Hard-delete a lead, then refresh the list. */
export const useDeleteLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteLead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leads'] }),
  });
};
