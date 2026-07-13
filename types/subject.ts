/** Admin subject types (BDALMS /api/admins/subjects).
 *  A Subject is the top-level course area (e.g. "O Level Maths").
 *  Courses and batches are always scoped to a subject. */

/** Short level code — distinct from the user-facing "O Level" / "A Level". */
export type SubjectLevel = 'O' | 'A';

export interface Subject {
  id: string;
  name: string;
  slug: string;
  level: SubjectLevel;
  teacher_id: string | null;
  description: string;
  thumbnail_url: string | null;
  is_published: boolean;
  /** Exam papers ("1".."6") Robin AI answers for this subject. Empty = no restriction. */
  robin_papers: string[];
  created_at: string;
  updated_at: string;
}

/** Multipart create body. `slug` is server-generated and never sent.
 *  `thumbnail` (a File) overrides `thumbnail_url` when present. */
export interface SubjectCreateRequest {
  name: string;
  level: SubjectLevel;
  description: string;
  teacher_id?: string | null;
  thumbnail?: File | null;
  thumbnail_url?: string | null;
  is_published?: boolean;
  robin_papers?: string[];
}

/** Multipart PATCH body — all fields optional; only sent fields change. */
export interface SubjectUpdateRequest {
  name?: string;
  level?: SubjectLevel;
  description?: string;
  teacher_id?: string | null;
  thumbnail?: File | null;
  thumbnail_url?: string | null;
  is_published?: boolean;
  robin_papers?: string[];
}

export interface SubjectsQuery {
  page?: number;
  limit?: number;
  is_published?: boolean;
}
