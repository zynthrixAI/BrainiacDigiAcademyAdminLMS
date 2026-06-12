import type { SubscriberSlice } from '@/types/analytics';
import { Card } from '@/components/ui/Card';

interface SubscriberBreakdownCardProps {
  levels: SubscriberSlice[];
  plans: SubscriberSlice[];
}

export function SubscriberBreakdownCard({ levels, plans }: SubscriberBreakdownCardProps) {
  return (
    <Card>
      <h3 className="font-display text-[15px] font-bold text-ink">Subscriber breakdown</h3>
      <span className="text-[13px] text-muted">By level &amp; plan</span>

      <div className="mt-4 flex flex-col gap-4">
        {levels.map((level) => (
          <div key={level.label}>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-ink">{level.label}</span>
              <span className="text-[13px] font-bold text-ink">
                {level.count} ({level.pct}%)
              </span>
            </div>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-[#f0eeea]">
              <span
                className="block h-full rounded-full"
                style={{ width: `${level.pct}%`, background: level.color }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-line pt-4">
        {plans.map((plan) => (
          <div key={plan.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: plan.color }}
              />
              <span className="text-[13px] font-semibold text-ink">{plan.label}</span>
            </div>
            <span className="font-display text-[13px] font-bold text-ink">
              {plan.count} <span className="font-medium text-muted">· {plan.pct}%</span>
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
