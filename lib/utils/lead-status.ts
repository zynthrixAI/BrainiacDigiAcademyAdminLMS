import type { LeadStatus, LeadStage } from '@/types/lead';

/** Pipeline stages — order, labels, colours and copy from the BDA design. */
export const LEAD_STAGES: LeadStage[] = [
  { id: 'lead', label: 'Lead', desc: 'Form submission, awaiting outreach', color: '#6b7280' },
  { id: 'applied', label: 'Applied', desc: 'Trial booked or completed', color: '#2a6fdb' },
  { id: 'enrolled', label: 'Enrolled', desc: 'Paid, onboarding pending', color: '#caa106' },
  { id: 'active', label: 'Active student', desc: 'Subscription active, attending', color: '#1f8a5b' },
  { id: 'alumni', label: 'Alumni', desc: 'Graduated, retained for referrals', color: '#7e57c2' },
];

export const LEAD_STATUSES: LeadStatus[] = LEAD_STAGES.map((s) => s.id);

const STAGE_BY_ID = LEAD_STAGES.reduce<Record<LeadStatus, LeadStage>>(
  (acc, stage) => {
    acc[stage.id] = stage;
    return acc;
  },
  {} as Record<LeadStatus, LeadStage>,
);

export const leadStage = (status: LeadStatus): LeadStage => STAGE_BY_ID[status];

export const leadStatusLabel = (status: LeadStatus): string => STAGE_BY_ID[status].label;

/** Inline style for a status pill — tinted background + the stage colour as text. */
export const leadPillStyle = (status: LeadStatus) => {
  const { color } = STAGE_BY_ID[status];
  return {
    backgroundColor: `color-mix(in srgb, ${color} 14%, white)`,
    color,
  };
};
