import { api } from '@/lib/axios';
import type { LoginCredentials, LoginResponse } from '@/types/auth';
import type { AdminProfile } from '@/types/admin';

/** Authenticate an admin user with email + password (client-side call). */
export const login = async (
  credentials: LoginCredentials,
): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>('/admins/login', credentials);
  return data;
};

/** Revoke the server-side refresh hash. Takes the refresh token in the body
 *  (not a bearer header); the FE must still drop both tokens locally. */
export const logout = async (refreshToken: string): Promise<void> => {
  await api.post('/admins/logout', { refresh_token: refreshToken });
};

/** The signed-in admin's own profile — drives identity + role-based UI. */
export const getProfile = async (): Promise<AdminProfile> => {
  const { data } = await api.get<AdminProfile>('/admins/profile');
  return data;
};
