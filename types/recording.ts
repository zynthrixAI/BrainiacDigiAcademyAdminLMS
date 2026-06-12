/** Admin recording types (BDALMS /api/admins/recordings).
 *  A Recording belongs to one LiveClass. The live-class / batch / subject names
 *  are denormalized onto the response and are filterable. */

/** Lifecycle: processing → draft → pending_edit → published. */
export type RecordingStatus = 'processing' | 'draft' | 'pending_edit' | 'published';

export interface Recording {
  id: string;
  live_class_id: string;
  live_class_title: string;
  batch_id: string;
  batch_name: string;
  subject_id: string;
  subject_name: string;
  title: string;
  description: string;
  link: string;
  status: RecordingStatus;
  admin_notes: string | null;
  raised_for_edit: boolean;
  created_at: string;
  updated_at: string;
}

/** Body for POST /admins/live-classes/{live_class_id}/recordings/.
 *  `admin_notes` / `raised_for_edit` are not exposed on create. */
export interface RecordingCreateRequest {
  title: string;
  description: string;
  link: string;
  status?: RecordingStatus;
}

/** PATCH body — all fields optional. Setting status to "published"
 *  fans out a notification to the batch's enrolled students. */
export interface RecordingUpdateRequest {
  title?: string;
  description?: string;
  link?: string;
  status?: RecordingStatus;
  admin_notes?: string;
  raised_for_edit?: boolean;
}

/** Lifecycle-stage metadata for a recording (label, pill classes, copy). */
export interface RecordingStage {
  value: RecordingStatus;
  label: string;
  /** Pill background + text classes. */
  pill: string;
  desc: string;
}

/** All query params optional and combinable. The list is NOT paginated. */
export interface RecordingsQuery {
  live_class_id?: string;
  batch_id?: string;
  subject_id?: string;
  status?: RecordingStatus;
  search?: string;
}
