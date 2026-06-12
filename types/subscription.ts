/** Lifecycle state of a student's subscription. */
export type SubscriptionStatus = 'active' | 'trial' | 'grace' | 'cancelled';

/** Selectable filter (the status tabs, plus an "all" pseudo-tab). */
export type SubscriptionTab = 'all' | SubscriptionStatus;

export interface Subscription {
  id: string;
  student: string;
  /** 'A Level' | 'O Level'. */
  level: string;
  plan: string;
  /** Human label for when the plan started, e.g. "Sep 2024". */
  started: string;
  /** Total paid to date, in PKR. */
  paid: number;
  status: SubscriptionStatus;
  /** Next billing/expiry event copy, e.g. "15 Aug 2026" or "Grace ends 20 May". */
  next: string;
  /** PayPro gateway reference, or "—" for trials. */
  paypro: string;
}

export interface SubscriptionKpi {
  label: string;
  value: string;
  note: string;
  /** Drives the note colour. */
  tone: 'green' | 'ink' | 'red';
}

/** Facet counts for the status tabs (computed server-side over the full set). */
export interface SubscriptionCounts {
  all: number;
  active: number;
  trial: number;
  grace: number;
  cancelled: number;
}

export interface SubscriptionsData {
  /** Sub-title summary line, e.g. "342 active · MRR Rs. 515k · ARR Rs. 6.18M". */
  summary: string;
  kpis: SubscriptionKpi[];
  counts: SubscriptionCounts;
  items: Subscription[];
}
