'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { activateSubscription, grantSubscription } from '@/lib/api/subscriptions';
import type { GrantSubscriptionRequest } from '@/types/subscription';

/** Activate / grant student subscriptions (superadmin only). */
export const useSubscriptionMutations = () => {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['subscriptions'] });

  const activate = useMutation({
    mutationFn: (id: string) => activateSubscription(id),
    onSuccess: invalidate,
  });

  const grant = useMutation({
    mutationFn: (body: GrantSubscriptionRequest) => grantSubscription(body),
    onSuccess: invalidate,
  });

  return { activate, grant };
};
