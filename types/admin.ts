/** Admin account types (BDALMS /api/admins auth + admin-account management).
 *  Two roles: 'admin' (default) and the single seeded 'superadmin'. */

export type AdminRole = 'admin' | 'superadmin';

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  is_deleted: boolean;
  created_at: string;
}

/** Body for POST /admins/create. Role is forced to 'admin' server-side. */
export interface AdminCreateRequest {
  name: string;
  email: string;
  password: string;
}

/** Body for PATCH /admins/{id} (superadmin-only). All fields optional. */
export interface AdminUpdateRequest {
  name?: string;
  email?: string;
  password?: string;
  role?: AdminRole;
}

/** Body for PATCH /admins/profile (own profile). Role is NOT editable here. */
export interface AdminProfileUpdateRequest {
  name?: string;
  email?: string;
  password?: string;
}
