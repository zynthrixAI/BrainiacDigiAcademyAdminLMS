import type { SubscriptionsData } from '@/types/subscription';

/**
 * Subscriptions snapshot for the billing screen. Returns mock data shaped
 * exactly as the UI consumes it — swap the body for
 * `api.get('/admins/subscriptions')` once the backend endpoint exists; the
 * signature and return type stay the same. Status filtering happens
 * client-side against `items`; `counts` carries the full-set facet totals.
 */
export const getSubscriptions = async (): Promise<SubscriptionsData> => {
  return {
    summary: '342 active · MRR Rs. 515k · ARR projection Rs. 6.18M',
    kpis: [
      { label: 'MRR', value: 'Rs. 515k', note: '+6.8% MoM', tone: 'green' },
      { label: 'Avg revenue / user', value: 'Rs. 1,506', note: 'blended A & O', tone: 'ink' },
      { label: 'Renewal rate (30d)', value: '91%', note: '▲ 3% vs last month', tone: 'green' },
      { label: 'Failed payments', value: '5', note: 'needs attention', tone: 'red' },
    ],
    counts: { all: 356, active: 312, trial: 12, grace: 4, cancelled: 28 },
    items: [
      { id: 'su1', student: 'Aaliya Hassan', level: 'A Level', plan: 'Annual', started: 'Sep 2024', paid: 38000, status: 'active', next: '15 Aug 2026', paypro: 'PP-3F8K2L' },
      { id: 'su2', student: 'Hassan Ali', level: 'A Level', plan: 'Monthly', started: 'Oct 2024', paid: 36000, status: 'active', next: '1 Jun 2026', paypro: 'PP-9X2L7M' },
      { id: 'su3', student: 'Maryam Khan', level: 'A Level', plan: 'Instalment 1/3', started: 'May 2026', paid: 13500, status: 'active', next: 'Aug 2026 — Inst 2', paypro: 'PP-2K8H9P' },
      { id: 'su4', student: 'Talha Sheikh', level: 'O Level', plan: 'Monthly', started: 'Aug 2024', paid: 28000, status: 'grace', next: 'Grace ends 20 May', paypro: 'PP-4M2N1Q' },
      { id: 'su5', student: 'Areej Malik', level: 'A Level', plan: 'Trial', started: 'May 2026', paid: 0, status: 'trial', next: 'Trial ends 24 May', paypro: '—' },
      { id: 'su6', student: 'Daniyal Rauf', level: 'O Level', plan: 'Annual', started: 'Aug 2024', paid: 24000, status: 'active', next: '5 Aug 2026', paypro: 'PP-7B3C5D' },
      { id: 'su7', student: 'Zara Ahmed', level: 'A Level', plan: 'Annual', started: 'Sep 2024', paid: 38000, status: 'active', next: '10 Sep 2026', paypro: 'PP-8E4F2G' },
      { id: 'su8', student: 'Usman Tariq', level: 'O Level', plan: 'Monthly', started: 'Jan 2025', paid: 10500, status: 'cancelled', next: 'Cancelled 2 Apr', paypro: 'PP-1A9Z3X' },
    ],
  };
};
