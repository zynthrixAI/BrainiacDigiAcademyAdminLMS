import { api } from '@/lib/axios';
import type { PaginatedResponse } from '@/types/pagination';
import type {
  AdminUserUpdateRequest,
  UserProfile,
  UsersQuery,
} from '@/types/user';

/** List users (students), paginated + filterable by search / level. */
export const getUsers = async (
  query: UsersQuery = {},
): Promise<PaginatedResponse<UserProfile>> => {
  const { data } = await api.get<PaginatedResponse<UserProfile>>('/admins/users/', {
    params: query,
  });
  return data;
};

/** Fetch a single user by id. */
export const getUser = async (id: string): Promise<UserProfile> => {
  const { data } = await api.get<UserProfile>(`/admins/users/${id}`);
  return data;
};

/** Update a user (superadmin only). */
export const updateUser = async (
  id: string,
  body: AdminUserUpdateRequest,
): Promise<UserProfile> => {
  const { data } = await api.patch<UserProfile>(`/admins/users/${id}`, body);
  return data;
};

/** Soft-delete a user (superadmin only). */
export const deleteUser = async (id: string): Promise<{ message: string }> => {
  const { data } = await api.delete<{ message: string }>(`/admins/users/${id}`);
  return data;
};
