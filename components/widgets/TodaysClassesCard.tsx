import type { LiveClassSummary } from '@/types/dashboard';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';

interface TodaysClassesCardProps {
  classes: LiveClassSummary[];
}

export function TodaysClassesCard({ classes }: TodaysClassesCardProps) {
  const liveCount = classes.filter((c) => c.live).length;

  return (
    <Card>
      <h3 className="font-display text-[15px] font-bold text-ink">Today&apos;s live classes</h3>
      <span className="text-[13px] text-muted">
        {classes.length} classes · {liveCount} live now
      </span>

      <div className="mt-4 flex flex-col gap-3">
        {classes.map((item, i) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 ${
              i ? 'border-t border-dashed border-line-2 pt-2.5' : ''
            }`}
          >
            <span
              className="inline-flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg font-display text-[10px] font-extrabold text-white"
              style={{ background: item.subjectColor }}
            >
              {item.subjectCode}
            </span>
            <div className="flex min-w-0 flex-1 flex-col leading-[1.2]">
              <span className="truncate text-[13px] font-bold text-ink">{item.title}</span>
              <span className="text-[13px] text-muted">
                {item.teacher} · {item.batch}
              </span>
            </div>
            {item.live ? (
              <Pill className="bg-[#fef2f2] text-[var(--red)]">● Live</Pill>
            ) : (
              <span className="whitespace-nowrap text-[13px] font-semibold text-muted">
                {item.time}
              </span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
