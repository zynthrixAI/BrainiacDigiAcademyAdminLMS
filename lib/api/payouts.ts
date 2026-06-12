import type { Payout } from '@/types/payout';

/**
 * Teacher payouts for the current and prior periods. Returns mock data shaped
 * exactly as the UI consumes it — swap the body for
 * `api.get('/admins/payouts')` once the backend endpoint exists; the signature
 * and return type stay the same. Tab filtering happens client-side.
 */
export const getPayouts = async (): Promise<Payout[]> => {
  return [
    { id: 'po1', teacher: 'Mr. Bilal Raza', period: 'Apr 2026', students: 32, gross_revenue: 184000, platform_fee: 55200, teacher_amount: 128800, status: 'pending', processed_at: null },
    { id: 'po2', teacher: 'Dr. Sana Khalid', period: 'Apr 2026', students: 28, gross_revenue: 156000, platform_fee: 46800, teacher_amount: 109200, status: 'pending', processed_at: null },
    { id: 'po3', teacher: 'Mr. Imran Ahmed', period: 'Apr 2026', students: 26, gross_revenue: 142000, platform_fee: 42600, teacher_amount: 99400, status: 'pending', processed_at: null },
    { id: 'po4', teacher: 'Ms. Hira Saeed', period: 'Apr 2026', students: 18, gross_revenue: 84000, platform_fee: 25200, teacher_amount: 58800, status: 'pending', processed_at: null },
    { id: 'po5', teacher: 'Mr. Faraz Ali', period: 'Apr 2026', students: 14, gross_revenue: 64000, platform_fee: 19200, teacher_amount: 44800, status: 'processed', processed_at: '12 May 2026' },
    { id: 'po6', teacher: 'Mr. Bilal Raza', period: 'Mar 2026', students: 30, gross_revenue: 172000, platform_fee: 51600, teacher_amount: 120400, status: 'processed', processed_at: '8 Apr 2026' },
  ];
};
