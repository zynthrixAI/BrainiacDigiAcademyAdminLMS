'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPlan, updatePlan, publishPlan, deletePlan } from '@/lib/api/subscriptions';
import type { PlanCreateRequest, PlanUpdateRequest } from '@/types/subscription';

/** Create / update / publish / delete subscription plans (superadmin only). */
export const usePlanMutations = () => {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['subscription-plans'] });

  const create = useMutation({
    mutationFn: (body: PlanCreateRequest) => createPlan(body),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: PlanUpdateRequest }) =>
      updatePlan(id, body),
    onSuccess: invalidate,
  });

  const publish = useMutation({
    mutationFn: (id: string) => publishPlan(id),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => deletePlan(id),
    onSuccess: invalidate,
  });

  return { create, update, publish, remove };
};
