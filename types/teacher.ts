/** Admin teacher-management domain types (BDALMS /api/admins/teachers). */

/** Short level codes — distinct from the user-facing "O Level" / "A Level". */
export type TeacherLevel = 'O' | 'A';

export interface Teacher {
  id: string;
  name: string;
  email: string;
  level: TeacherLevel;
  phone: string | null;
  bio: string | null;
  profile_picture: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeacherCreateRequest {
  name: string;
  email: string;
  password: string;
  level: TeacherLevel;
  phone?: string | null;
  bio?: string | null;
  profile_picture?: string | null;
}

/** PATCH body — all fields optional; only sent fields are updated. */
export interface TeacherUpdateRequest {
  name?: string;
  email?: string;
  password?: string;
  level?: TeacherLevel;
  phone?: string | null;
  bio?: string | null;
  profile_picture?: string | null;
  is_active?: boolean;
}

export interface TeachersQuery {
  page?: number;
  limit?: number;
  /** Case-insensitive match on name OR email. */
  search?: string;
}
