/** Admin batch types (BDALMS /api/admins/batches).
 *  A Batch is a student cohort under one subject. Subject/teacher names are
 *  denormalized server-side — there are no Link traversals. */

/** Minimal student record returned in a batch's enrolment list. */
export interface EnrolledStudent {
  id: string;
  name: string;
  email: string;
}

export interface Batch {
  id: string;
  subject_id: string;
  subject_name: string;
  name: string;
  description: string;
  teacher_id: string | null;
  teacher_name: string | null;
  thumbnail_url: string | null;
  price: number;
  enrolled_count: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

/** GET /admins/batches/{id} — adds the enrolled-student list. */
export interface BatchDetail extends Batch {
  enrolled_students: EnrolledStudent[];
}

/** Multipart create body. `thumbnail` (a File) overrides `thumbnail_url`. */
export interface BatchCreateRequest {
  subject_id: string;
  name: string;
  description: string;
  teacher_id?: string | null;
  thumbnail?: File | null;
  thumbnail_url?: string | null;
  price?: number;
  is_published?: boolean;
}

/** Multipart PATCH body — all optional. `subject_id` is NOT updatable. */
export interface BatchUpdateRequest {
  name?: string;
  description?: string;
  teacher_id?: string | null;
  thumbnail?: File | null;
  thumbnail_url?: string | null;
  price?: number;
  is_published?: boolean;
}

/** Both filters optional and combinable. The list is NOT paginated. */
export interface BatchesQuery {
  subject_id?: string;
  teacher_id?: string;
}
