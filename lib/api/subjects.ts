import { api } from '@/lib/axios';
import type { PaginatedResponse } from '@/types/pagination';
import type {
  Subject,
  SubjectCreateRequest,
  SubjectUpdateRequest,
  SubjectsQuery,
} from '@/types/subject';

const BASE = '/admins/subjects';

/** Multipart header that survives the instance's JSON default — the browser
 *  then sets the real boundary. (axios would otherwise JSON-stringify FormData.) */
const MULTIPART = { headers: { 'Content-Type': 'multipart/form-data' } };

/** Build the multipart body shared by create and update. Only defined fields
 *  are appended, so PATCH stays sparse. A `thumbnail` File overrides `thumbnail_url`. */
const toSubjectForm = (
  body: SubjectCreateRequest | SubjectUpdateRequest,
): FormData => {
  const form = new FormData();
  if (body.name !== undefined) form.append('name', body.name);
  if (body.level !== undefined) form.append('level', body.level);
  if (body.description !== undefined) form.append('description', body.description);
  if (body.teacher_id) form.append('teacher_id', body.teacher_id);
  if (body.thumbnail) form.append('thumbnail', body.thumbnail);
  else if (body.thumbnail_url) form.append('thumbnail_url', body.thumbnail_url);
  if (body.is_published !== undefined) form.append('is_published', String(body.is_published));
  return form;
};

/**
 * All subjects (used to scope the course / batch catalogues). Resilient to a
 * bare array or a paginated {items} body. The single place to change if the
 * subjects endpoint shape differs.
 */
export const getSubjects = async (): Promise<Subject[]> => {
  const { data } = await api.get<Subject[] | PaginatedResponse<Subject>>(`${BASE}/`, {
    params: { limit: 100 },
  });
  if (Array.isArray(data)) return data;
  return data.items ?? [];
};

/** Paginated subjects for the management page. */
export const getSubjectsList = async (
  query: SubjectsQuery = {},
): Promise<PaginatedResponse<Subject>> => {
  const { data } = await api.get<PaginatedResponse<Subject>>(`${BASE}/`, { params: query });
  return data;
};

export const getSubject = async (id: string): Promise<Subject> => {
  const { data } = await api.get<Subject>(`${BASE}/${id}`);
  return data;
};

export const createSubject = async (body: SubjectCreateRequest): Promise<Subject> => {
  const { data } = await api.post<Subject>(`${BASE}/`, toSubjectForm(body), MULTIPART);
  return data;
};

export const updateSubject = async (
  id: string,
  body: SubjectUpdateRequest,
): Promise<Subject> => {
  const { data } = await api.patch<Subject>(`${BASE}/${id}`, toSubjectForm(body), MULTIPART);
  return data;
};

export const deleteSubject = async (id: string): Promise<void> => {
  await api.delete(`${BASE}/${id}`);
};
