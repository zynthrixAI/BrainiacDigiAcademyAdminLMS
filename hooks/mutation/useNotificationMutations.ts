'use client';

import { useMutation } from '@tanstack/react-query';
import { sendNotification } from '@/lib/api/notifications';
import type { NotificationCreateRequest } from '@/types/notification';

/** Sends a notification. There's no list/cache to invalidate (no broadcast entity). */
export const useSendNotification = () =>
  useMutation({
    mutationFn: (body: NotificationCreateRequest) => sendNotification(body),
  });
