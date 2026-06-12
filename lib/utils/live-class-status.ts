import type { LiveClassStatus, LiveClassStage } from '@/types/live-class';

/** Status pill metadata, in lifecycle order. */
export const LIVE_CLASS_STAGES: LiveClassStage[] = [
  { value: 'scheduled', label: 'Scheduled', pill: 'bg-[#eff6ff] text-[#2a6fdb]' },
  { value: 'live', label: '● Live', pill: 'bg-[#fef2f2] text-[var(--red)]' },
  { value: 'ended', label: 'Ended', pill: 'bg-[#ecfdf5] text-[var(--green)]' },
  { value: 'cancelled', label: 'Cancelled', pill: 'bg-[#f5f5f4] text-muted' },
  { value: 'past_due', label: 'Past due', pill: 'bg-[#fff7ed] text-[#c2680a]' },
];

const STAGE_BY_VALUE: Record<LiveClassStatus, LiveClassStage> = LIVE_CLASS_STAGES.reduce(
  (acc, stage) => {
    acc[stage.value] = stage;
    return acc;
  },
  {} as Record<LiveClassStatus, LiveClassStage>,
);

export const liveClassStage = (status: LiveClassStatus): LiveClassStage =>
  STAGE_BY_VALUE[status] ?? LIVE_CLASS_STAGES[0];
