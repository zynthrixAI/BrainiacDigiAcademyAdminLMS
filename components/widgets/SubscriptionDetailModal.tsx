'use client';

import type { Subscription, SubscriptionStatus } from '@/types/subscription';
import { Modal } from '@/components/ui/Modal';
import { Pill } from '@/components/ui/Pill';

interface SubscriptionDetailModalProps {
  subscription: Subscription | null;
  onClose: () => void;
}

const STATUS_PILL: Record<SubscriptionStatus, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-[#e7f4ee] text-[var(--green)]' },
  trial: { label: 'Trial', className: 'bg-[#e8f0fe] text-[#2a6fdb]' },
  grace: { label: 'Grace', className: 'bg-[#fdeaea] text-[var(--red)]' },
  cancelled: { label: 'Cancelled', className: 'bg-[#f5f5f4] text-muted' },
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line py-2.5 last:border-0">
      <span className="text-[12.5px] font-medium text-muted">{label}</span>
      <span className="text-right text-[13.5px] font-semibold text-ink">{children}</span>
    </div>
  );
}

/** Read-only detail view of a single subscription. */
export function SubscriptionDetailModal({ subscription, onClose }: SubscriptionDetailModalProps) {
  if (!subscription) return null;
  const pill = STATUS_PILL[subscription.status];

  return (
    <Modal open title={subscription.student} onClose={onClose} size="sm">
      <div className="flex flex-col">
        <Row label="Level">
          <Pill className="bg-[#f5f5f4] text-muted">{subscription.level}</Pill>
        </Row>
        <Row label="Status">
          <Pill className={pill.className}>{pill.label}</Pill>
        </Row>
        <Row label="Plan">{subscription.plan}</Row>
        <Row label="Started">{subscription.started}</Row>
        <Row label="Paid to date">
          <span className="font-display font-bold">Rs. {subscription.paid.toLocaleString()}</span>
        </Row>
        <Row label="Next event">{subscription.next}</Row>
        <Row label="PayPro ref">
          <span className="font-mono text-[12px] text-muted">{subscription.paypro}</span>
        </Row>
      </div>
    </Modal>
  );
}
