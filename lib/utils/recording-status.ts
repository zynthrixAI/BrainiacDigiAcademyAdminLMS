import type { RecordingStatus, RecordingStage } from '@/types/recording';

/** processing → draft → pending_edit → published. */
export const RECORDING_STAGES: RecordingStage[] = [
  {
    value: 'processing',
    label: 'Processing',
    pill: 'bg-[#eff6ff] text-[#2a6fdb]',
    desc: 'Encoder still running',
  },
  {
    value: 'draft',
    label: 'Draft',
    pill: 'bg-[#f5f5f4] text-muted',
    desc: 'Held back from students',
  },
  {
    value: 'pending_edit',
    label: 'Pending edit',
    pill: 'bg-[#fff7ed] text-[#c2680a]',
    desc: 'Flagged for re-edit',
  },
  {
    value: 'published',
    label: 'Published',
    pill: 'bg-[#ecfdf5] text-[var(--green)]',
    desc: 'Visible to students',
  },
];

const STAGE_BY_VALUE: Record<RecordingStatus, RecordingStage> = RECORDING_STAGES.reduce(
  (acc, stage) => {
    acc[stage.value] = stage;
    return acc;
  },
  {} as Record<RecordingStatus, RecordingStage>,
);

export const recordingStage = (status: RecordingStatus): RecordingStage =>
  STAGE_BY_VALUE[status] ?? RECORDING_STAGES[1];

/** Options for a status <Select>. */
export const RECORDING_STATUS_OPTIONS = RECORDING_STAGES.map((s) => ({
  label: s.label,
  value: s.value,
}));
