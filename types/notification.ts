/** Admin Notifications domain types (BDALMS /api/admins/notifications). */

/** Notification kind. Admin UI sends "announcement"; the rest are emitted
 *  automatically by the backend on domain events. */
export type NotificationType =
  | 'announcement'
  | 'class_reminder'
  | 'assignment_due'
  | 'grade_released'
  | 'recording_published'
  | 'live_class_started';

/** Who a notification fans out to. */
export type NotificationTarget = 'all' | 'batch' | 'student';

/** POST body. One Notification document is written per resolved recipient. */
export interface NotificationCreateRequest {
  title: string;
  body: string;
  /** Defaults to "announcement" server-side. */
  type?: NotificationType;
  /** Free-form FE routing payload (deep-link ids, etc.). Defaults to {}. */
  data?: Record<string, unknown>;
  target: NotificationTarget;
  /** Required iff target === "batch". */
  batch_id?: string | null;
  /** Required iff target === "student". */
  student_id?: string | null;
}

/** Number of per-recipient documents written. 0 = target resolved to nobody. */
export interface SendNotificationResponse {
  sent: number;
}

export interface DeleteNotificationResponse {
  message: string;
}
