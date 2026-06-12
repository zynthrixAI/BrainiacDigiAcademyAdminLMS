import type { Kpi } from '@/types/dashboard';
import { Card } from '@/components/ui/Card';

interface KpiCardProps {
  kpi: Kpi;
}

export function KpiCard({ kpi }: KpiCardProps) {
  const { label, value, delta, deltaPositive, sub, icon: Icon, accent } = kpi;

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-[10.5px] font-bold uppercase tracking-[0.06em] text-muted">
            {label}
          </span>
          <div className="mt-2 font-display text-[28px] font-extrabold tracking-[-0.01em] text-ink">
            {value}
          </div>
        </div>
        <span
          className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-[10px]"
          style={{
            background: `color-mix(in srgb, ${accent} 14%, white)`,
            color: accent,
          }}
        >
          <Icon size={16} />
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2">
        {delta && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
              deltaPositive
                ? 'bg-[#ecfdf5] text-[var(--green)]'
                : 'bg-[#fef2f2] text-[var(--red)]'
            }`}
          >
            {deltaPositive ? '▲' : '▼'} {delta}
          </span>
        )}
        <span className="text-[13px] text-muted">{sub}</span>
      </div>
    </Card>
  );
}
