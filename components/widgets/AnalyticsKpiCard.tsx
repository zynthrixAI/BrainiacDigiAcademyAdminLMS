import type { AnalyticsKpi } from '@/types/analytics';
import { Card } from '@/components/ui/Card';

interface AnalyticsKpiCardProps {
  kpi: AnalyticsKpi;
}

const ARROW: Record<AnalyticsKpi['trend'], string> = {
  up: '▲',
  down: '▼',
  none: '',
};

export function AnalyticsKpiCard({ kpi }: AnalyticsKpiCardProps) {
  const { label, value, change, trend, positive } = kpi;

  return (
    <Card>
      <span className="text-[10.5px] font-bold uppercase tracking-[0.06em] text-muted">
        {label}
      </span>
      <div className="mt-1.5 font-display text-[26px] font-extrabold tracking-[-0.01em] text-ink">
        {value}
      </div>
      <span
        className="mt-1 block text-[13px] font-bold"
        style={{ color: positive ? 'var(--green)' : 'var(--red)' }}
      >
        {ARROW[trend] && `${ARROW[trend]} `}
        {change}
      </span>
    </Card>
  );
}
