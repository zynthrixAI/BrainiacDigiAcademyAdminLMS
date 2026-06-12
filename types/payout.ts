/** Teacher payout for a revenue period (70/30 teacher/platform split). */

export type PayoutStatus = 'pending' | 'processed';

/** Filter tabs (plus an "all" pseudo-tab). */
export type PayoutTab = 'pending' | 'processed' | 'all';

export interface Payout {
  id: string;
  teacher: string;
  /** Revenue period label, e.g. "Apr 2026". */
  period: string;
  students: number;
  /** Gross revenue for the period, in PKR. */
  gross_revenue: number;
  /** Platform's 30% cut. */
  platform_fee: number;
  /** Teacher's 70% take-home. */
  teacher_amount: number;
  status: PayoutStatus;
  /** When the payout was processed; null while pending. */
  processed_at: string | null;
}
