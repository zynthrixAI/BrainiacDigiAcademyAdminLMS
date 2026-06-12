import type { RevenuePoint, RevenueMetric } from '@/types/analytics';

interface RevenueBarChartProps {
  data: RevenuePoint[];
  metric: RevenueMetric;
  color: string;
  height?: number;
}

/** Vertical bar chart of a single revenue series, value labelled above each bar. */
export function RevenueBarChart({ data, metric, color, height = 220 }: RevenueBarChartProps) {
  const max = Math.max(...data.map((d) => d[metric]), 1);

  return (
    <div className="flex items-end gap-2 pt-5" style={{ height }}>
      {data.map((d) => (
        <div key={d.month} className="flex flex-1 flex-col items-center gap-1.5">
          <div
            className="relative w-full rounded-t-md"
            style={{
              height: `${(d[metric] / max) * (height - 30)}px`,
              background: color,
            }}
          >
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-[10px] font-bold text-ink">
              {d[metric]}
            </span>
          </div>
          <span className="text-[10px] text-muted">{d.month}</span>
        </div>
      ))}
    </div>
  );
}
