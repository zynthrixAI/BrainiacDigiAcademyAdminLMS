import type { RobinQuery } from '@/types/robin-query';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Button } from '@/components/ui/Button';
import { EyeIcon } from '@/components/icons/EyeIcon';
import { SendIcon } from '@/components/icons/SendIcon';
import { UserIcon } from '@/components/icons/UserIcon';

interface RobinQueryCardProps {
  query: RobinQuery;
  onView: (query: RobinQuery) => void;
  onReassign: (query: RobinQuery) => void;
}

export function RobinQueryCard({ query, onView, onReassign }: RobinQueryCardProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-[240px] flex-1 flex-col">
          <div className="flex items-center gap-2">
            {query.flagged && <Pill className="bg-[#fdeaea] text-[var(--red)]">Flagged</Pill>}
            <Pill className="bg-[#e8f0fe] text-[#2a6fdb]">{query.subject}</Pill>
            <span className="text-[12px] text-muted">· {query.time}</span>
          </div>
          <p className="mb-1.5 mt-2.5 font-display text-[14.5px] font-semibold leading-[1.45] text-ink">
            “{query.query}”
          </p>
          <div className="flex flex-wrap items-center gap-2 text-[12.5px] text-muted">
            <span className="inline-flex items-center gap-1.5">
              <UserIcon size={12} /> {query.student}
            </span>
            <span>·</span>
            <span>Assigned to {query.teacher}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => onView(query)}>
            <EyeIcon size={13} /> View thread
          </Button>
          {query.flagged && (
            <Button onClick={() => onReassign(query)}>
              <SendIcon size={13} /> Reassign
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
