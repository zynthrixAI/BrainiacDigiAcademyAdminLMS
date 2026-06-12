import { api } from '@/lib/axios';
import type {
  Lead,
  LeadCreateRequest,
  LeadUpdateRequest,
  LeadsQuery,
  LeadEnrollResponse,
  PaginatedLeadResponse,
} from '@/types/lead';

/** List leads (paginated + global analytics). */
export const getLeads = async (
  query: LeadsQuery = {},
): Promise<PaginatedLeadResponse> => {
  const { data } = await api.get<PaginatedLeadResponse>('/admins/leads/', {
    params: query,
  });
  return data;
};

/** Fetch a single lead by id. */
export const getLead = async (id: string): Promise<Lead> => {
  const { data } = await api.get<Lead>(`/admins/leads/${id}`);
  return data;
};

/** Create a lead. */
export const createLead = async (body: LeadCreateRequest): Promise<Lead> => {
  const { data } = await api.post<Lead>('/admins/leads/', body);
  return data;
};

/** Update a lead (only sent fields change). */
export const updateLead = async (
  id: string,
  body: LeadUpdateRequest,
): Promise<Lead> => {
  const { data } = await api.patch<Lead>(`/admins/leads/${id}`, body);
  return data;
};

/** Hard-delete a lead. */
export const deleteLead = async (id: string): Promise<{ message: string }> => {
  const { data } = await api.delete<{ message: string }>(`/admins/leads/${id}`);
  return data;
};

/** Convert a lead into a student User. Returns a one-time generated password. */
export const enrollLead = async (id: string): Promise<LeadEnrollResponse> => {
  const { data } = await api.post<LeadEnrollResponse>(`/admins/leads/${id}/enroll`);
  return data;
};
