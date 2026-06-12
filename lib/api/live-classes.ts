import { api } from '@/lib/axios';
import type {
  LiveClass,
  LiveClassesQuery,
  AttendanceReport,
} from '@/types/live-class';
import type { PaginatedResponse } from '@/types/pagination';

/** List a batch's live classes (paginated, newest first). Soft-deleted excluded.
 *  NB: an admin GET also runs the time-based auto-transition pass server-side,
 *  so the returned statuses reflect current real-world state. */
export const getBatchLiveClasses = async (
  batchId: string,
  query: LiveClassesQuery = {},
): Promise<PaginatedResponse<LiveClass>> => {
  const { data } = await api.get<PaginatedResponse<LiveClass>>(
    `/admins/batches/${batchId}/live-classes/`,
    { params: query },
  );
  return data;
};

/** Full live-class detail (includes admin-only meeting_url / host_url). */
export const getLiveClass = async (id: string): Promise<LiveClass> => {
  const { data } = await api.get<LiveClass>(`/admins/live-classes/${id}`);
  return data;
};

/** Attendance report for a live class (present / late / absent + per-student rows). */
export const getLiveClassAttendance = async (id: string): Promise<AttendanceReport> => {
  const { data } = await api.get<AttendanceReport>(`/admins/live-classes/${id}/attendance`);
  return data;
};
