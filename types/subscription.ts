/** Subscriptions & payments admin domain (BDALMS /api/admins/subscriptions). */

/* ---------------------------------- Plans --------------------------------- */

/** Billing cadence — monthly/quarterly/yearly grant 30/90/365 days of access. */
export type PlanInterval = 'monthly' | 'quarterly' | 'yearly';

/** Draft plans are admin-only; publishing is one-way and makes the plan
 *  visible to students (and permanently undeletable). */
export type PlanStatus = 'draft' | 'published';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  /** Whole PKR — always > 0. */
  price: number;
  /** Always "PKR". */
  currency: string;
  interval: PlanInterval;
  status: PlanStatus;
  created_at: string;
  updated_at: string;
}

/** Query params for GET /admins/subscriptions/plans/. */
export interface PlansQuery {
  page?: number;
  limit?: number;
  /** Text search on plan name. */
  search?: string;
  status?: PlanStatus;
}

/** Body for POST /plans/ — new plans are always created as drafts. */
export interface PlanCreateRequest {
  name: string;
  description: string;
  price: number;
  interval: PlanInterval;
}

/** Body for PATCH /plans/{id} — any subset; works on drafts and published. */
export type PlanUpdateRequest = Partial<PlanCreateRequest>;

/* ------------------------------ Subscriptions ----------------------------- */

/** 'pending' = checkout started but payment never completed. Subscriptions
 *  expire automatically at expires_at — there is no cancelled state. */
export type SubscriptionStatus = 'pending' | 'active' | 'expired';

export interface AdminSubscription {
  id: string;
  user_name: string;
  user_email: string;
  plan_name: string;
  price: number;
  currency: string;
  interval: PlanInterval;
  status: SubscriptionStatus;
  started_at: string | null;
  expires_at: string | null;
  created_at: string;
  /** Starts with "GRANT-" for admin-granted (comped) subscriptions. */
  payfast_basket_id: string | null;
}

/** Query params for GET /admins/subscriptions/. Search matches the student's
 *  name or email (case-insensitive, partial). */
export interface SubscriptionsQuery {
  page?: number;
  limit?: number;
  status?: SubscriptionStatus;
  search?: string;
}

/** Body for POST /grant — creates an immediately-active free subscription. */
export interface GrantSubscriptionRequest {
  user_id: string;
  plan_id: string;
}

/* ------------------------------- Transactions ----------------------------- */

export type TransactionStatus = 'pending' | 'paid' | 'failed';
export type TransactionPurpose = 'subscription' | 'course' | 'batch';

export interface AdminTransaction {
  id: string;
  user_name: string;
  user_email: string;
  purpose: TransactionPurpose;
  /** What was bought — plan / course / batch name. */
  reference_name: string;
  /** Whole PKR. */
  amount: number;
  currency: string;
  status: TransactionStatus;
  payfast_basket_id: string | null;
  payfast_transaction_id: string | null;
  paid_at: string | null;
  /** PayFast failure details — only populated on failed transactions. */
  error_code: string | null;
  error_message: string | null;
  created_at: string;
}

/** Query params for GET /admins/subscriptions/transactions/. Search matches
 *  user name/email, basket ID, PayFast transaction ID, or item name. */
export interface TransactionsQuery {
  page?: number;
  limit?: number;
  status?: TransactionStatus;
  purpose?: TransactionPurpose;
  search?: string;
}
