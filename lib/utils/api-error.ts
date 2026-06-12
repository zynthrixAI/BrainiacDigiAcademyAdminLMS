import { isAxiosError } from 'axios';

/** Human-readable message from an API error, with a superadmin-aware 403 case. */
export const apiErrorMessage = (error: unknown, fallback: string): string => {
  if (isAxiosError(error)) {
    if (error.response?.status === 403) return 'This action requires superadmin access.';
    if (error.response?.status === 401) return 'Your session has expired. Please sign in again.';
    const detail = (error.response?.data as { detail?: unknown } | undefined)?.detail;
    if (typeof detail === 'string') return detail;
  }
  return fallback;
};
