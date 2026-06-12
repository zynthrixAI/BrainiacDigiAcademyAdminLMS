import type { IconComponent } from './nav';

export interface Kpi {
  label: string;
  value: string;
  /** Change badge text, or null to hide the badge. */
  delta: string | null;
  deltaPositive: boolean;
  sub: string;
  icon: IconComponent;
  /** Hex accent for the icon chip. */
  accent: string;
}

export interface RevenueMonth {
  month: string;
  mrr: number;
}

export interface MrrSummary {
  arrProjection: string;
  netNew: string;
  churned: string;
  levelSplit: string;
}

export interface ActionQueueItem {
  id: string;
  title: string;
  description: string;
  action: string;
  href: string;
  urgent: boolean;
}

export interface TopTeacher {
  name: string;
  revenue: string;
  students: number;
  viewership: number;
}

export type EnrolmentStage = 'enrolled' | 'active';

export interface RecentEnrolment {
  id: string;
  name: string;
  level: string;
  created: string;
  stage: EnrolmentStage;
}

export interface LiveClassSummary {
  id: string;
  title: string;
  teacher: string;
  batch: string;
  subjectCode: string;
  subjectColor: string;
  time: string;
  live: boolean;
}

export interface DashboardData {
  dateLabel: string;
  kpis: Kpi[];
  revenueTrend: RevenueMonth[];
  mrrSummary: MrrSummary;
  actionQueue: ActionQueueItem[];
  topTeachers: TopTeacher[];
  recentEnrolments: RecentEnrolment[];
  todaysClasses: LiveClassSummary[];
}
