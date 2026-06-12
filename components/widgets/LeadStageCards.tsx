'use client';

import { LEAD_STAGES } from '@/lib/utils/lead-status';
import type { LeadAnalytics, LeadStatusFilter } from '@/types/lead';

interface LeadStageCardsProps {
  analytics: LeadAnalytics | undefined;
  active: LeadStatusFilter;
  onSelect: (value: LeadStatusFilter) => void;
}

/** KPI strip: one card per pipeline stage. Click to filter; click again to clear. */
export function LeadStageCards({ analytics, active, onSelect }: LeadStageCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {LEAD_STAGES.map((stage) => {
        const isActive = active === stage.id;
        const count = analytics ? analytics[stage.id] : 0;
        return (
          <button
            key={stage.id}
            type="button"
            onClick={() => onSelect(isActive ? 'all' : stage.id)}
            className={`flex flex-col rounded-[var(--radius)] border bg-bg-elev p-3.5 text-left shadow-[0_1px_0_rgba(28,27,27,0.02),0_1px_2px_rgba(28,27,27,0.03)] transition-colors ${
              isActive ? 'border-ink ring-1 ring-ink' : 'border-line hover:border-line-2'
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: stage.color }}
              />
              <span className="font-display text-[12px] font-bold text-ink">{stage.label}</span>
            </div>
            <span className="mt-1.5 font-display text-[22px] font-extrabold leading-none text-ink">
              {count}
            </span>
            <span className="mt-1.5 text-[10.5px] leading-snug text-muted">{stage.desc}</span>
          </button>
        );
      })}
    </div>
  );
}
