'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { StudentPicker, type PickedStudent } from '@/components/widgets/StudentPicker';
import { usePlans } from '@/hooks/query/usePlans';
import { useSubscriptionMutations } from '@/hooks/mutation/useSubscriptionMutations';
import { apiErrorMessage } from '@/lib/utils/api-error';
import { formatPkr, intervalLabel } from '@/lib/utils/format';

interface GrantSubscriptionModalProps {
  open: boolean;
  onClose: () => void;
}

/** Grant a student a free, immediately-active subscription (superadmin only).
 *  Only published plans are offered — the backend rejects drafts. */
export function GrantSubscriptionModal({ open, onClose }: GrantSubscriptionModalProps) {
  const [student, setStudent] = useState<PickedStudent | null>(null);
  const [planId, setPlanId] = useState('');

  const { data: planData, isLoading: plansLoading } = usePlans({
    status: 'published',
    limit: 100,
  });
  const { grant } = useSubscriptionMutations();

  const planOptions = (planData?.items ?? []).map((p) => ({
    label: p.name,
    value: p.id,
    description: `${formatPkr(p.price)} · ${intervalLabel(p.interval)}`,
  }));

  const reset = () => {
    setStudent(null);
    setPlanId('');
    grant.reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    if (!student || !planId) return;
    grant.mutate(
      { user_id: student.id, plan_id: planId },
      { onSuccess: handleClose },
    );
  };

  const errorText = grant.error
    ? apiErrorMessage(grant.error, 'Couldn’t grant the subscription. Please try again.')
    : null;

  return (
    <Modal
      open={open}
      title="Grant subscription"
      onClose={handleClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!student || !planId || grant.isPending}>
            {grant.isPending ? 'Granting…' : 'Grant subscription'}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <p className="text-[13px] text-muted">
          Grants free, immediately-active access to a published plan and emails the student. No
          payment is involved.
        </p>

        <div className="flex flex-col gap-2">
          <span className="font-display text-[12.5px] font-bold text-ink-2">Student</span>
          <StudentPicker value={student} onChange={setStudent} />
        </div>

        <Select
          id="grant-plan"
          label="Plan"
          options={planOptions}
          value={planId}
          onChange={setPlanId}
          placeholder={plansLoading ? 'Loading plans…' : 'Select a published plan…'}
          disabled={plansLoading}
          searchable
        />

        {!plansLoading && planOptions.length === 0 && (
          <p className="text-[13px] text-muted">
            No published plans yet — publish a plan first to grant access.
          </p>
        )}

        {errorText && <p className="text-[13px] font-medium text-[var(--red)]">{errorText}</p>}
      </div>
    </Modal>
  );
}
