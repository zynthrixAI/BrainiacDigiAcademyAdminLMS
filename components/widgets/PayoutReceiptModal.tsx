'use client';

import type { Payout } from '@/types/payout';
import { Modal } from '@/components/ui/Modal';
import { Pill } from '@/components/ui/Pill';

interface PayoutReceiptModalProps {
  payout: Payout | null;
  onClose: () => void;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line py-2.5 last:border-0">
      <span className="text-[12.5px] font-medium text-muted">{label}</span>
      <span className="text-right text-[13.5px] font-semibold text-ink">{children}</span>
    </div>
  );
}

/** Read-only receipt for a processed payout. */
export function PayoutReceiptModal({ payout, onClose }: PayoutReceiptModalProps) {
  if (!payout) return null;

  return (
    <Modal open title={`Payout · ${payout.teacher}`} onClose={onClose} size="sm">
      <div className="flex flex-col">
        <Row label="Period">
          <Pill className="bg-[#f5f5f4] text-muted">{payout.period}</Pill>
        </Row>
        <Row label="Status">
          <Pill className="bg-[#e7f4ee] text-[var(--green)]">Processed</Pill>
        </Row>
        {payout.processed_at && <Row label="Processed on">{payout.processed_at}</Row>}
        <Row label="Students">{payout.students}</Row>
        <Row label="Gross revenue">
          <span className="font-mono text-[12.5px]">Rs. {payout.gross_revenue.toLocaleString()}</span>
        </Row>
        <Row label="Platform fee (30%)">
          <span className="font-mono text-[12.5px] text-muted">
            Rs. {payout.platform_fee.toLocaleString()}
          </span>
        </Row>
        <Row label="Teacher amount (70%)">
          <span className="font-display font-extrabold">
            Rs. {payout.teacher_amount.toLocaleString()}
          </span>
        </Row>
      </div>
    </Modal>
  );
}
