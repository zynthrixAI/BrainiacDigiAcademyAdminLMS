import { api } from '@/lib/axios';
import type {
  Recording,
  RecordingCreateRequest,
  RecordingUpdateRequest,
  RecordingsQuery,
} from '@/types/recording';

const BASE = '/admins/recordings';

/** List recordings (filterable by live class / batch / subject / status / search).
 *  NOT paginated — returns a plain array. */
export const getRecordings = async (
  query: RecordingsQuery = {},
): Promise<Recording[]> => {
  const { data } = await api.get<Recording[]>(`${BASE}/`, { params: query });
  return data;
};

export const getRecording = async (id: string): Promise<Recording> => {
  const { data } = await api.get<Recording>(`${BASE}/${id}`);
  return data;
};

/** Create a recording for a live class (JSON body — the link is an external URL). */
export const createRecording = async (
  liveClassId: string,
  body: RecordingCreateRequest,
): Promise<Recording> => {
  const { data } = await api.post<Recording>(
    `/admins/live-classes/${liveClassId}/recordings/`,
    body,
  );
  return data;
};

export const updateRecording = async (
  id: string,
  body: RecordingUpdateRequest,
): Promise<Recording> => {
  const { data } = await api.patch<Recording>(`${BASE}/${id}`, body);
  return data;
};

export const deleteRecording = async (id: string): Promise<void> => {
  await api.delete(`${BASE}/${id}`);
};
