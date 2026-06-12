import type { RecentEnrolment } from '@/types/dashboard';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Pill } from '@/components/ui/Pill';

interface RecentEnrolmentsCardProps {
  enrolments: RecentEnrolment[];
}

const initialsOf = (name: string): string =>
  name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');

export function RecentEnrolmentsCard({ enrolments }: RecentEnrolmentsCardProps) {
  return (
    <Card>
      <h3 className="font-display text-[15px] font-bold text-ink">Recent enrolments</h3>
      <span className="text-[13px] text-muted">Last 7 days</span>

      <div className="mt-4 flex flex-col gap-3">
        {enrolments.map((enrolment, i) => (
          <div
            key={enrolment.id}
            className={`flex items-center gap-3 ${
              i ? 'border-t border-dashed border-line-2 pt-2.5' : ''
            }`}
          >
            <Avatar
              initials={initialsOf(enrolment.name)}
              size={34}
              className="bg-yellow-soft text-yellow-ink"
            />
            <div className="flex min-w-0 flex-1 flex-col leading-[1.2]">
              <span className="text-[13px] font-bold text-ink">{enrolment.name}</span>
              <span className="text-[13px] text-muted">
                {enrolment.level} · {enrolment.created}
              </span>
            </div>
            <Pill
              className={
                enrolment.stage === 'active'
                  ? 'bg-[#ecfdf5] text-[var(--green)]'
                  : 'bg-yellow-soft text-yellow-ink'
              }
            >
              {enrolment.stage}
            </Pill>
          </div>
        ))}
      </div>
    </Card>
  );
}
