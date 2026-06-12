import { api } from '@/lib/axios';
import type {
  NotificationCreateRequest,
  SendNotificationResponse,
  DeleteNotificationResponse,
} from '@/types/notification';

/**
 * Admin Notifications — superadmin only (the backend 403s plain admins).
 * Notifications are persisted one document per recipient; there is no shared
 * "broadcast" entity, hence no list/recall endpoint.
 */

/** Send a notification. Returns how many recipient documents were written. */
export const sendNotification = async (
  body: NotificationCreateRequest,
): Promise<SendNotificationResponse> => {
  const { data } = await api.post<SendNotificationResponse>('/admins/notifications/', body);
  return data;
};

/** Delete a SINGLE recipient's notification document (moderation, not recall). */
export const deleteNotification = async (
  id: string,
): Promise<DeleteNotificationResponse> => {
  const { data } = await api.delete<DeleteNotificationResponse>(`/admins/notifications/${id}`);
  return data;
};
