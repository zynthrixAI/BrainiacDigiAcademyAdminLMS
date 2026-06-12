import { api } from '@/lib/axios';
import type {
  AdminProfile,
  AdminCreateRequest,
  AdminUpdateRequest,
} from '@/types/admin';

/** Admin-account management — superadmin only (the backend 403s plain admins). */

/** List all admins (plain array, soft-deleted excluded). */
export const getAdmins = async (): Promise<AdminProfile[]> => {
  const { data } = await api.get<AdminProfile[]>('/admins/');
  return data;
};

/** Create another admin. Role is forced to 'admin' server-side. */
export const createAdmin = async (body: AdminCreateRequest): Promise<AdminProfile> => {
  const { data } = await api.post<AdminProfile>('/admins/create', body);
  return data;
};

/** Update another admin (only sent fields change). */
export const updateAdmin = async (
  id: string,
  body: AdminUpdateRequest,
): Promise<AdminProfile> => {
  const { data } = await api.patch<AdminProfile>(`/admins/${id}`, body);
  return data;
};

/** Soft-delete another admin. */
export const deleteAdmin = async (id: string): Promise<{ message: string }> => {
  const { data } = await api.delete<{ message: string }>(`/admins/${id}`);
  return data;
};
