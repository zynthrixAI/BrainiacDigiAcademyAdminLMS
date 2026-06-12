/** Reporting window for the analytics screen. */
export type AnalyticsPeriod = '7d' | '30d' | '90d' | 'year';

/** Series toggled on the revenue chart. */
export type RevenueMetric = 'mrr' | 'new' | 'churn';

export interface AnalyticsKpi {
  label: string;
  value: string;
  /** Change copy, e.g. "6.8% MoM" or "+39 this month". */
  change: string;
  /** Arrow glyph direction; 'none' hides the arrow. */
  trend: 'up' | 'down' | 'none';
  /** Whether the change is good news (drives the green/red colour). */
  positive: boolean;
}

/** One month of revenue, carrying every toggleable series. */
export interface RevenuePoint {
  month: string;
  mrr: number;
  new: number;
  churn: number;
}

/** A slice of the subscriber base (by level or by plan). */
export interface SubscriberSlice {
  label: string;
  count: number;
  pct: number;
  color: string;
}

export interface TeacherPerformance {
  id: string;
  name: string;
  initials: string;
  subject: string;
  students: number;
  /** Percentage. */
  viewership: number;
  /** Percentage. */
  attendance: number;
  /** Human label, e.g. "1.4 days". */
  turnaround: string;
  revenue: string;
  /** Composite score (viewership × attendance × turnaround). */
  score: number;
}

export interface AnalyticsData {
  kpis: AnalyticsKpi[];
  revenue: RevenuePoint[];
  /** A-Level vs O-Level split. */
  levels: SubscriberSlice[];
  /** Subscription plan mix. */
  plans: SubscriberSlice[];
  teachers: TeacherPerformance[];
}
