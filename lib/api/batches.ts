import { api } from '@/lib/axios';
import type {
  Batch,
  BatchDetail,
  BatchCreateRequest,
  BatchUpdateRequest,
  BatchesQuery,
} from '@/types/batch';

const BASE = '/admins/batches';

/** Keep the multipart body intact past axios's JSON default. */
const MULTIPART = { headers: { 'Content-Type': 'multipart/form-data' } };

const toBatchForm = (body: BatchCreateRequest | BatchUpdateRequest): FormData => {
  const form = new FormData();
  if ('subject_id' in body && body.subject_id) form.append('subject_id', body.subject_id);
  if (body.name !== undefined) form.append('name', body.name);
  if (body.description !== undefined) form.append('description', body.description);
  if (body.teacher_id) form.append('teacher_id', body.teacher_id);
  if (body.thumbnail) form.append('thumbnail', body.thumbnail);
  else if (body.thumbnail_url) form.append('thumbnail_url', body.thumbnail_url);
  if (body.price !== undefined) form.append('price', String(body.price));
  if (body.is_published !== undefined) form.append('is_published', String(body.is_published));
  return form;
};

/** List batches (filterable by subject / teacher). NOT paginated — plain array. */
export const getBatches = async (query: BatchesQuery = {}): Promise<Batch[]> => {
  const { data } = await api.get<Batch[]>(`${BASE}/`, { params: query });
  return data;
};

/** A single batch with its enrolled students. */
export const getBatch = async (id: string): Promise<BatchDetail> => {
  const { data } = await api.get<BatchDetail>(`${BASE}/${id}`);
  return data;
};

export const createBatch = async (body: BatchCreateRequest): Promise<Batch> => {
  const { data } = await api.post<Batch>(`${BASE}/`, toBatchForm(body), MULTIPART);
  return data;
};

export const updateBatch = async (
  id: string,
  body: BatchUpdateRequest,
): Promise<Batch> => {
  const { data } = await api.patch<Batch>(`${BASE}/${id}`, toBatchForm(body), MULTIPART);
  return data;
};

export const deleteBatch = async (id: string): Promise<void> => {
  await api.delete(`${BASE}/${id}`);
};

/** Enroll a student — returns the refreshed batch with the new student included. */
export const enrollStudent = async (
  batchId: string,
  studentId: string,
): Promise<BatchDetail> => {
  const { data } = await api.post<BatchDetail>(`${BASE}/${batchId}/enroll`, {
    student_id: studentId,
  });
  return data;
};

/** Unenroll a student — returns the refreshed batch without that student. */
export const unenrollStudent = async (
  batchId: string,
  studentId: string,
): Promise<BatchDetail> => {
  const { data } = await api.delete<BatchDetail>(`${BASE}/${batchId}/enroll/${studentId}`);
  return data;
};
