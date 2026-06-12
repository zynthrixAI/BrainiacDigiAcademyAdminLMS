'use client';

import type { RobinQuery } from '@/types/robin-query';
import { Modal } from '@/components/ui/Modal';
import { Pill } from '@/components/ui/Pill';
import { UserIcon } from '@/components/icons/UserIcon';

interface RobinQueryModalProps {
  query: RobinQuery | null;
  onClose: () => void;
}

/** Read-only thread view for a single Robin query. */
export function RobinQueryModal({ query, onClose }: RobinQueryModalProps) {
  if (!query) return null;

  return (
    <Modal open title="Robin query" onClose={onClose} size="sm">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {query.flagged && <Pill className="bg-[#fdeaea] text-[var(--red)]">Flagged</Pill>}
          <Pill className="bg-[#e8f0fe] text-[#2a6fdb]">{query.subject}</Pill>
          <span className="text-[12px] text-muted">· {query.time}</span>
        </div>

        <p className="font-display text-[15px] font-semibold leading-[1.5] text-ink">
          “{query.query}”
        </p>

        <div className="flex flex-col gap-2 rounded-xl border border-line bg-[#faf9f7] p-3.5 text-[13px]">
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted">Student</span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
              <UserIcon size={13} /> {query.student}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted">Assigned teacher</span>
            <span className="font-semibold text-ink">{query.teacher}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
