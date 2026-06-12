/** Admin user-management domain types (BDALMS /api/admins/users). */

export type Level = 'O Level' | 'A Level';
export type Gender = 'male' | 'female' | 'other';
export type AuthType = 'local' | 'google';

export interface Parent {
  name: string;
  phone: string;
  email: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  is_verified: boolean;
  auth_type: AuthType;
  level: Level | null;
  gender: Gender | null;
  phno: string | null;
  country: string | null;
  dob: string | null;
  parent: Parent | null;
  goal: string | null;
  created_at: string;
}

/** Query params for the paginated list endpoint. */
export interface UsersQuery {
  page?: number;
  limit?: number;
  search?: string;
  level?: Level;
}

/** Body for PATCH /admins/users/{id} — all fields optional. */
export interface AdminUserUpdateRequest {
  name?: string;
  email?: string;
  is_verified?: boolean;
  level?: Level;
  gender?: Gender;
  phno?: string;
  country?: string;
  dob?: string;
  parent?: Parent;
  goal?: string;
}
