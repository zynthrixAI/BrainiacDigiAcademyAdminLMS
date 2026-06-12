'use client';

import { useState } from 'react';
import { useLead } from '@/hooks/query/useLead';
import { useEnrollLead } from '@/hooks/mutation/useEnrollLead';
import { useConfirm } from '@/hooks/useConfirm';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { LeadProfilePanel } from './LeadProfilePanel';
import type { LeadEnrollResponse } from '@/types/lead';

type ModalMode = 'view' | 'edit';

interface LeadDetailModalProps {
  leadId: string | null;
  mode: ModalMode;
  onModeChange: (mode: ModalMode) => void;
  onClose: () => void;
}

/** Fetches a lead, shows the profile panel, and handles enrollment. */
export function LeadDetailModal({
  leadId,
  mode,
  onModeChange,
  onClose,
}: LeadDetailModalProps) {
  const { data, isLoading, isError } = useLead(leadId);
  const { mutate: enroll, isPending: enrolling } = useEnrollLead();
  const confirm = useConfirm();

  const [enrollResult, setEnrollResult] = useState<LeadEnrollResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const open = leadId !== null;
  const title = enrollResult
    ? 'Lead enrolled'
    : mode === 'edit'
      ? 'Edit lead'
      : 'Lead details';

  const close = () => {
    setEnrollResult(null);
    setCopied(false);
    onClose();
  };

  const handleEnroll = async () => {
    if (!data) return;
    const ok = await confirm({
      title: `Enroll ${data.name} as a student?`,
      message: 'This creates their student account and a one-time password.',
      confirmLabel: 'Enroll',
    });
    if (!ok) return;
    enroll(data.id, { onSuccess: (result) => setEnrollResult(result) });
  };

  const copyPassword = async () => {
    if (!enrollResult) return;
    await navigator.clipboard.writeText(enrollResult.generated_password);
    setCopied(true);
  };

  return (
    <Modal open={open} title={title} onClose={close}>
      {enrollResult ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-ink">
            <strong>{enrollResult.lead.name}</strong> is now enrolled as a student. Share this
            one-time password now — it cannot be retrieved again.
          </p>
          <div className="flex items-center gap-2 rounded-xl border border-line bg-[#faf9f7] px-3.5 py-3">
            <code className="flex-1 select-all font-mono text-[15px] font-bold tracking-wide text-ink">
              {enrollResult.generated_password}
            </code>
            <Button type="button" variant="ghost" onClick={copyPassword} className="px-3 py-1.5 text-xs">
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <div className="flex justify-end border-t border-line pt-4">
            <Button type="button" onClick={close}>
              Done
            </Button>
          </div>
        </div>
      ) : (
        <>
          {isLoading && <p className="py-6 text-center text-sm text-muted">Loading…</p>}
          {isError && (
            <p className="py-6 text-center text-sm text-[var(--red)]">
              Couldn’t load this lead.
            </p>
          )}
          {data && (
            <LeadProfilePanel
              key={`${data.id}-${mode}`}
              lead={data}
              editing={mode === 'edit'}
              enrolling={enrolling}
              onEdit={() => onModeChange('edit')}
              onCancel={() => onModeChange('view')}
              onClose={close}
              onEnroll={handleEnroll}
            />
          )}
        </>
      )}
    </Modal>
  );
}
