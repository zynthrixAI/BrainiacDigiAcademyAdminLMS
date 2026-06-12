import { api } from '@/lib/axios';
import type { PaginatedResponse } from '@/types/pagination';
import type {
  Course,
  CourseDetail,
  CourseCreateRequest,
  CourseUpdateRequest,
  CoursesQuery,
  CourseUploadResponse,
  LessonUploadResponse,
  Topic,
  TopicCreateRequest,
  TopicUpdateRequest,
  Subtopic,
  SubtopicCreateRequest,
  SubtopicUpdateRequest,
  Lesson,
  LessonCreateRequest,
  LessonUpdateRequest,
  LessonPath,
} from '@/types/course';

const BASE = '/admins/courses';

/* ── Courses ────────────────────────────────────────────────── */

export const getCourses = async (
  query: CoursesQuery,
): Promise<PaginatedResponse<Course>> => {
  const { data } = await api.get<PaginatedResponse<Course>>(`${BASE}/`, { params: query });
  return data;
};

export const getCourse = async (id: string): Promise<CourseDetail> => {
  const { data } = await api.get<CourseDetail>(`${BASE}/${id}`);
  return data;
};

export const createCourse = async (body: CourseCreateRequest): Promise<Course> => {
  const { data } = await api.post<Course>(`${BASE}/`, body);
  return data;
};

export const updateCourse = async (
  id: string,
  body: CourseUpdateRequest,
): Promise<Course> => {
  const { data } = await api.patch<Course>(`${BASE}/${id}`, body);
  return data;
};

export const deleteCourse = async (id: string): Promise<void> => {
  await api.delete(`${BASE}/${id}`);
};

/* ── Uploads (two-step: upload → embed URL) ─────────────────── */

export const uploadCourseFiles = async (
  files: { thumbnail?: File; past_papers?: File[]; class_notes?: File[] },
): Promise<CourseUploadResponse> => {
  const form = new FormData();
  if (files.thumbnail) form.append('thumbnail', files.thumbnail);
  files.past_papers?.forEach((f) => form.append('past_papers', f));
  files.class_notes?.forEach((f) => form.append('class_notes', f));
  const { data } = await api.post<CourseUploadResponse>(`${BASE}/upload-files/`, form, {
    // Override the instance's JSON default so axios keeps the multipart body
    // intact; the browser then sets the real boundary header.
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const uploadLessonFiles = async (
  courseId: string,
  topicId: string,
  subtopicId: string,
  files: File[],
): Promise<LessonUploadResponse> => {
  const form = new FormData();
  files.forEach((f) => form.append('files', f));
  const { data } = await api.post<LessonUploadResponse>(
    `${BASE}/${courseId}/topics/${topicId}/subtopics/${subtopicId}/lessons/upload-files/`,
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data;
};

/* ── Topics ─────────────────────────────────────────────────── */

export const createTopic = async (
  courseId: string,
  body: TopicCreateRequest,
): Promise<Topic> => {
  const { data } = await api.post<Topic>(`${BASE}/${courseId}/topics/`, body);
  return data;
};

export const updateTopic = async (
  courseId: string,
  topicId: string,
  body: TopicUpdateRequest,
): Promise<Topic> => {
  const { data } = await api.patch<Topic>(`${BASE}/${courseId}/topics/${topicId}`, body);
  return data;
};

export const deleteTopic = async (courseId: string, topicId: string): Promise<void> => {
  await api.delete(`${BASE}/${courseId}/topics/${topicId}`);
};

/* ── Subtopics ──────────────────────────────────────────────── */

export const createSubtopic = async (
  courseId: string,
  topicId: string,
  body: SubtopicCreateRequest,
): Promise<Subtopic> => {
  const { data } = await api.post<Subtopic>(
    `${BASE}/${courseId}/topics/${topicId}/subtopics/`,
    body,
  );
  return data;
};

export const updateSubtopic = async (
  courseId: string,
  topicId: string,
  subtopicId: string,
  body: SubtopicUpdateRequest,
): Promise<Subtopic> => {
  const { data } = await api.patch<Subtopic>(
    `${BASE}/${courseId}/topics/${topicId}/subtopics/${subtopicId}`,
    body,
  );
  return data;
};

export const deleteSubtopic = async (
  courseId: string,
  topicId: string,
  subtopicId: string,
): Promise<void> => {
  await api.delete(`${BASE}/${courseId}/topics/${topicId}/subtopics/${subtopicId}`);
};

/* ── Lessons ────────────────────────────────────────────────── */

const lessonsBase = ({ courseId, topicId, subtopicId }: LessonPath) =>
  `${BASE}/${courseId}/topics/${topicId}/subtopics/${subtopicId}/lessons`;

export const getLesson = async (path: LessonPath, lessonId: string): Promise<Lesson> => {
  const { data } = await api.get<Lesson>(`${lessonsBase(path)}/${lessonId}`);
  return data;
};

export const createLesson = async (
  path: LessonPath,
  body: LessonCreateRequest,
): Promise<Lesson> => {
  const { data } = await api.post<Lesson>(`${lessonsBase(path)}/`, body);
  return data;
};

export const updateLesson = async (
  path: LessonPath,
  lessonId: string,
  body: LessonUpdateRequest,
): Promise<Lesson> => {
  const { data } = await api.patch<Lesson>(`${lessonsBase(path)}/${lessonId}`, body);
  return data;
};

export const deleteLesson = async (path: LessonPath, lessonId: string): Promise<void> => {
  await api.delete(`${lessonsBase(path)}/${lessonId}`);
};
