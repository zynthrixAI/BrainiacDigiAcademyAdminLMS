'use client';

import { Modal } from '@/components/ui/Modal';
import { PlanForm } from '@/components/forms/PlanForm';
import type { SubscriptionPlan } from '@/types/subscription';

interface PlanFormModalProps {
  open: boolean;
  plan?: SubscriptionPlan;
  onClose: () => void;
}

/** Create or edit a subscription plan. Pass `plan` to edit. */
export function PlanFormModal({ open, plan, onClose }: PlanFormModalProps) {
  return (
    <Modal open={open} title={plan ? 'Edit plan' : 'New plan'} onClose={onClose}>
      {open && (
        <PlanForm key={plan?.id ?? 'new'} plan={plan} onSaved={onClose} onCancel={onClose} />
      )}
    </Modal>
  );
}
