import type { AnalyticsData, AnalyticsPeriod } from '@/types/analytics';

/**
 * Analytics snapshot for a reporting window. Returns mock data shaped exactly
 * as the UI consumes it — swap the body for an axios
 * `api.get('/admins/analytics', { params: { period } })` call once the backend
 * endpoint exists; the signature and return type stay the same.
 */
export const getAnalytics = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  period: AnalyticsPeriod,
): Promise<AnalyticsData> => {
  return {
    kpis: [
      { label: 'MRR', value: 'Rs. 515k', change: '6.8% MoM', trend: 'up', positive: true },
      {
        label: 'Active subscribers',
        value: '342',
        change: '+39 this month',
        trend: 'none',
        positive: true,
      },
      { label: 'Churn rate', value: '1.5%', change: '0.6% MoM', trend: 'down', positive: true },
      { label: 'Renewal rate', value: '91%', change: '3% MoM', trend: 'up', positive: true },
    ],
    revenue: [
      { month: 'Nov', mrr: 320, new: 18, churn: 4 },
      { month: 'Dec', mrr: 340, new: 22, churn: 3 },
      { month: 'Jan', mrr: 380, new: 28, churn: 5 },
      { month: 'Feb', mrr: 410, new: 32, churn: 6 },
      { month: 'Mar', mrr: 445, new: 38, churn: 4 },
      { month: 'Apr', mrr: 482, new: 41, churn: 7 },
      { month: 'May', mrr: 515, new: 44, churn: 5 },
    ],
    levels: [
      { label: 'A Level', count: 233, pct: 68, color: '#1d4ed8' },
      { label: 'O Level', count: 109, pct: 32, color: '#047857' },
    ],
    plans: [
      { label: 'Annual', count: 168, pct: 49, color: '#f9c323' },
      { label: 'Monthly', count: 92, pct: 27, color: '#2a6fdb' },
      { label: 'Instalment', count: 70, pct: 20, color: '#7e57c2' },
      { label: 'Trial', count: 12, pct: 4, color: '#9ca3af' },
    ],
    teachers: [
      {
        id: 't3',
        name: 'Mr. Bilal Raza',
        initials: 'BR',
        subject: 'Mathematics',
        students: 186,
        viewership: 95,
        attendance: 94,
        turnaround: '1.1 days',
        revenue: 'Rs. 837,000',
        score: 95,
      },
      {
        id: 't2',
        name: 'Dr. Sana Khalid',
        initials: 'SK',
        subject: 'Chemistry',
        students: 128,
        viewership: 92,
        attendance: 88,
        turnaround: '0.9 days',
        revenue: 'Rs. 576,000',
        score: 90,
      },
      {
        id: 't1',
        name: 'Mr. Imran Ahmed',
        initials: 'IA',
        subject: 'Physics',
        students: 142,
        viewership: 87,
        attendance: 91,
        turnaround: '1.4 days',
        revenue: 'Rs. 639,000',
        score: 89,
      },
      {
        id: 't4',
        name: 'Ms. Hira Saeed',
        initials: 'HS',
        subject: 'Biology',
        students: 84,
        viewership: 78,
        attendance: 82,
        turnaround: '2.1 days',
        revenue: 'Rs. 378,000',
        score: 80,
      },
      {
        id: 't5',
        name: 'Mr. Faraz Ali',
        initials: 'FA',
        subject: 'Computer Science',
        students: 64,
        viewership: 81,
        attendance: 79,
        turnaround: '1.6 days',
        revenue: 'Rs. 288,000',
        score: 80,
      },
    ],
  };
};
