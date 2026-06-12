import { api } from '@/lib/axios';
import type { PaginatedResponse } from '@/types/pagination';
import type {
  Teacher,
  TeacherCreateRequest,
  TeacherUpdateRequest,
  TeachersQuery,
} from '@/types/teacher';

/** List teachers (paginated). */
export const getTeachers = async (
  query: TeachersQuery = {},
): Promise<PaginatedResponse<Teacher>> => {
  const { data } = await api.get<PaginatedResponse<Teacher>>('/admins/teachers/', {
    params: query,
  });
  return data;
};

/** Fetch a single teacher by id. */
export const getTeacher = async (id: string): Promise<Teacher> => {
  const { data } = await api.get<Teacher>(`/admins/teachers/${id}`);
  return data;
};

/** Create a teacher. */
export const createTeacher = async (
  body: TeacherCreateRequest,
): Promise<Teacher> => {
  const { data } = await api.post<Teacher>('/admins/teachers/', body);
  return data;
};

/** Update a teacher (only sent fields change). */
export const updateTeacher = async (
  id: string,
  body: TeacherUpdateRequest,
): Promise<Teacher> => {
  const { data } = await api.patch<Teacher>(`/admins/teachers/${id}`, body);
  return data;
};

/** Soft-delete a teacher. */
export const deleteTeacher = async (id: string): Promise<{ message: string }> => {
  const { data } = await api.delete<{ message: string }>(`/admins/teachers/${id}`);
  return data;
};
