interface PayoutSummaryCardProps {
  period: string;
  teacherCount: number;
  gross: number;
  fee: number;
  net: number;
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="flex flex-col">
      <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-white/50">
        {label}
      </span>
      <span
        className="font-display text-[22px] font-extrabold"
        style={accent ? { color: 'var(--yellow)' } : undefined}
      >
        Rs. {value.toLocaleString()}
      </span>
    </div>
  );
}

/** Dark gradient hero summarising the pending payout period (70/30 split). */
export function PayoutSummaryCard({ period, teacherCount, gross, fee, net }: PayoutSummaryCardProps) {
  return (
    <div
      className="mb-5 rounded-[var(--radius)] p-5 text-white"
      style={{ background: 'linear-gradient(135deg, #1c1b1b 0%, #2a2926 100%)' }}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="inline-flex w-fit items-center rounded-full bg-[rgba(249,195,35,0.18)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--yellow)]">
            {period} period
          </span>
          <div className="mt-2 font-display text-[32px] font-extrabold">
            Rs. {net.toLocaleString()}
          </div>
          <span className="text-[13px] text-white/60">
            across {teacherCount} {teacherCount === 1 ? 'teacher' : 'teachers'} · 70/30 split
          </span>
        </div>
        <div className="flex flex-wrap gap-6">
          <Stat label="Gross revenue" value={gross} />
          <Stat label="Platform fee (30%)" value={fee} />
          <Stat label="To teachers (70%)" value={net} accent />
        </div>
      </div>
    </div>
  );
}
