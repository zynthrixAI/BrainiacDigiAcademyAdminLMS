import { api } from '@/lib/axios';
import type { PaginatedResponse } from '@/types/pagination';
import type {
  AdminSubscription,
  AdminTransaction,
  GrantSubscriptionRequest,
  PlanCreateRequest,
  PlansQuery,
  PlanUpdateRequest,
  SubscriptionPlan,
  SubscriptionsQuery,
  TransactionsQuery,
} from '@/types/subscription';

/**
 * Subscriptions & payments admin API (/admins/subscriptions). Lists are
 * visible to any admin; plan writes, grant, and activate are superadmin-only
 * (the backend 403s plain admins).
 */

/* ---------------------------------- Plans --------------------------------- */

/** List plans, paginated + filterable by name search / status. */
export const getPlans = async (
  query: PlansQuery = {},
): Promise<PaginatedResponse<SubscriptionPlan>> => {
  const { data } = await api.get<PaginatedResponse<SubscriptionPlan>>(
    '/admins/subscriptions/plans/',
    { params: query },
  );
  return data;
};

/** Create a plan — always created as a draft. Price must be > 0 (whole PKR). */
export const createPlan = async (body: PlanCreateRequest): Promise<SubscriptionPlan> => {
  const { data } = await api.post<SubscriptionPlan>('/admins/subscriptions/plans/', body);
  return data;
};

/** Update a plan (any subset of fields). Works on drafts and published plans. */
export const updatePlan = async (
  id: string,
  body: PlanUpdateRequest,
): Promise<SubscriptionPlan> => {
  const { data } = await api.patch<SubscriptionPlan>(`/admins/subscriptions/plans/${id}`, body);
  return data;
};

/** Publish a plan — one-way, no unpublish. 400 if already published. */
export const publishPlan = async (id: string): Promise<SubscriptionPlan> => {
  const { data } = await api.post<SubscriptionPlan>(`/admins/subscriptions/plans/${id}/publish`);
  return data;
};

/** Delete a plan — drafts only. 400 for published plans. */
export const deletePlan = async (id: string): Promise<{ message: string }> => {
  const { data } = await api.delete<{ message: string }>(`/admins/subscriptions/plans/${id}`);
  return data;
};

/* ------------------------------ Subscriptions ----------------------------- */

/** List student subscriptions, paginated + filterable by status / search. */
export const getSubscriptions = async (
  query: SubscriptionsQuery = {},
): Promise<PaginatedResponse<AdminSubscription>> => {
  const { data } = await api.get<PaginatedResponse<AdminSubscription>>(
    '/admins/subscriptions/',
    { params: query },
  );
  return data;
};

/** Activate a pending/expired subscription — restarts the full interval from
 *  now and emails the student. 400 if already active, 409 if the user has a
 *  different active subscription. */
export const activateSubscription = async (id: string): Promise<AdminSubscription> => {
  const { data } = await api.post<AdminSubscription>(`/admins/subscriptions/${id}/activate`);
  return data;
};

/** Grant a free, immediately-active subscription (published plans only).
 *  404 user/plan not found, 400 plan not published, 409 already subscribed. */
export const grantSubscription = async (
  body: GrantSubscriptionRequest,
): Promise<AdminSubscription> => {
  const { data } = await api.post<AdminSubscription>('/admins/subscriptions/grant', body);
  return data;
};

/* ------------------------------- Transactions ----------------------------- */

/** List payment transactions, paginated + filterable by status / purpose /
 *  search (name, email, basket ID, PayFast transaction ID, or item name). */
export const getTransactions = async (
  query: TransactionsQuery = {},
): Promise<PaginatedResponse<AdminTransaction>> => {
  const { data } = await api.get<PaginatedResponse<AdminTransaction>>(
    '/admins/subscriptions/transactions/',
    { params: query },
  );
  return data;
};
