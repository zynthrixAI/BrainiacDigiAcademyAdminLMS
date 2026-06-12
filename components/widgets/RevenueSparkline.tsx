import type { RevenueMonth } from '@/types/dashboard';

interface RevenueSparklineProps {
  months: RevenueMonth[];
}

const W = 720;
const H = 180;
const PAD = 20;

/** Area + line sparkline of monthly MRR. Presentational. */
export function RevenueSparkline({ months }: RevenueSparklineProps) {
  const values = months.map((m) => m.mrr);
  const max = Math.max(...values);
  const min = Math.min(...values);

  const points = months.map((m, i) => {
    const x = PAD + (i / (months.length - 1)) * (W - PAD * 2);
    const y = H - PAD - ((m.mrr - min) / (max - min || 1)) * (H - PAD * 2);
    return [x, y] as const;
  });

  const line = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`)
    .join(' ');
  const area = `${line} L ${points[points.length - 1][0].toFixed(1)} ${H - PAD} L ${points[0][0].toFixed(1)} ${H - PAD} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full">
      <defs>
        <linearGradient id="mrr-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f9c323" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#f9c323" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#mrr-gradient)" />
      <path
        d={line}
        fill="none"
        stroke="#f9c323"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {points.map((p, i) => {
        const last = i === points.length - 1;
        return (
          <g key={months[i].month}>
            <circle
              cx={p[0]}
              cy={p[1]}
              r={last ? 5 : 3}
              fill={last ? '#f9c323' : '#fff'}
              stroke="#f9c323"
              strokeWidth="2"
            />
            <text x={p[0]} y={H - 4} textAnchor="middle" fontSize="10" fill="#9ca3af">
              {months[i].month}
            </text>
            {last && (
              <text
                x={p[0]}
                y={p[1] - 12}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill="#1c1b1b"
              >
                Rs.{months[i].mrr}k
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
