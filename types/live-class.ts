/** Admin live-class types (BDALMS /api/admins).
 *  Hierarchy: Subject → Batch → LiveClass → Recording. A live class always
 *  belongs to exactly one batch. Admin access is READ-ONLY — the lifecycle
 *  (create/start/end/cancel/delete) is owned by the assigned teacher. */
import type { PaginatedResponse } from './pagination';

/** scheduled → live → ended; either may go to cancelled; overdue → past_due. */
export type LiveClassStatus = 'scheduled' | 'live' | 'ended' | 'cancelled' | 'past_due';

export interface LiveClass {
  id: string;
  batch_id: string;
  /** Denormalized snapshot — not guaranteed to match the latest batch name. */
  batch_name: string;
  subject_id: string;
  /** Denormalized snapshot — not guaranteed to match the latest subject name. */
  subject_name: string;
  title: string;
  /** Minutes (not seconds). */
  total_duration: number;
  /** Zoom/Meet link — admin-visible. */
  meeting_url: string;
  /** Teacher-host link — admin-visible, NEVER student-visible. */
  host_url: string | null;
  meeting_id: string | null;
  /** Not populated on the admin response; kept for parity with the student schema. */
  teacher_name: string | null;
  scheduled_at: string;
  started_at: string | null;
  ended_at: string | null;
  status: LiveClassStatus;
  cancelled_at: string | null;
  cancel_reason: string | null;
  created_at: string;
  updated_at: string;
}

/** Query for the per-batch list. The list IS paginated. */
export interface LiveClassesQuery {
  page?: number;
  limit?: number;
  status?: LiveClassStatus;
}

export type LiveClassesResponse = PaginatedResponse<LiveClass>;

/** present = joined ≤10 min late · late = 10–30 min · absent = >30 min or no-show. */
export type AttendanceStatus = 'present' | 'late' | 'absent';

export interface AttendanceRecord {
  id: string;
  live_class_id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  joined_at: string | null;
  left_at: string | null;
  status: AttendanceStatus;
  created_at: string;
}

export interface AttendanceReport {
  live_class_id: string;
  total: number;
  present: number;
  late: number;
  absent: number;
  records: AttendanceRecord[];
}

/** Pill metadata for a live-class status (label + background/text classes). */
export interface LiveClassStage {
  value: LiveClassStatus;
  label: string;
  pill: string;
}
