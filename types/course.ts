/** Admin course-catalogue types (BDALMS /api/admins/courses).
 *  Hierarchy: Course → Topic → Subtopic → Lesson. */

/** A downloadable file attached to a course (past paper / class note). */
export interface CourseFile {
  id?: string;
  title: string;
  url: string;
  file_type: string;
}

export interface Course {
  id: string;
  subject_id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail_url: string | null;
  teacher_id: string | null;
  teacher_name: string;
  price: number;
  is_published: boolean;
  past_papers: CourseFile[];
  class_notes: CourseFile[];
  total_lessons: number;
  created_at: string;
  updated_at: string;
}

/** Slug is server-generated and never sent. */
export interface CourseCreateRequest {
  subject_id: string;
  title: string;
  description: string;
  teacher_id: string | null;
  teacher_name: string;
  thumbnail_url: string | null;
  price: number;
  is_published: boolean;
  past_papers: CourseFile[];
  class_notes: CourseFile[];
}

/** All fields optional; list fields replace wholesale when sent. */
export interface CourseUpdateRequest {
  title?: string;
  description?: string;
  teacher_id?: string | null;
  teacher_name?: string;
  thumbnail_url?: string | null;
  price?: number;
  is_published?: boolean;
  past_papers?: CourseFile[];
  class_notes?: CourseFile[];
}

export interface CoursesQuery {
  subject_id: string;
  page?: number;
  limit?: number;
  search?: string;
  is_published?: boolean;
}

/* ── Upload responses ───────────────────────────────────────── */

export interface CourseUploadResponse {
  thumbnail_url?: string;
  past_paper_urls?: string[];
  class_note_urls?: string[];
}

export interface LessonUploadResponse {
  urls: string[];
}

/* ── Topic ──────────────────────────────────────────────────── */

export interface Topic {
  id: string;
  course_id: string;
  name: string;
  order: number;
  created_at: string;
}

export interface TopicCreateRequest {
  name: string;
  order?: number;
}

export interface TopicUpdateRequest {
  name?: string;
  order?: number;
}

/* ── Subtopic ───────────────────────────────────────────────── */

export interface Subtopic {
  id: string;
  topic_id: string;
  name: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface SubtopicCreateRequest {
  name: string;
  order?: number;
}

export interface SubtopicUpdateRequest {
  name?: string;
  order?: number;
}

/* ── Lesson ─────────────────────────────────────────────────── */

export interface LessonScheme {
  title: string;
  url: string;
}

export interface LessonChapter {
  title: string;
  timestamp_seconds: number;
}

export interface LessonKeyMoment {
  label: string;
  timestamp_seconds: number;
}

export interface LessonResource {
  title: string;
  url: string;
  file_type: string;
}

/** Lesson as it appears in the course tree (CourseDetailResponse). */
export interface LessonSummary {
  id: string;
  title: string;
  order: number;
  duration_seconds: number;
  is_free_preview: boolean;
}

export interface Lesson {
  id: string;
  subtopic_id: string;
  title: string;
  description: string;
  video_url: string;
  duration_seconds: number;
  order: number;
  is_free_preview: boolean;
  past_paper_schemes: LessonScheme[];
  chapters: LessonChapter[];
  key_moments: LessonKeyMoment[];
  resources: LessonResource[];
  created_at: string;
  updated_at: string;
}

export interface LessonCreateRequest {
  title: string;
  description: string;
  video_url: string;
  duration_seconds: number;
  order: number;
  is_free_preview: boolean;
  past_paper_schemes: LessonScheme[];
  chapters: LessonChapter[];
  key_moments: LessonKeyMoment[];
  resources: LessonResource[];
}

export interface LessonUpdateRequest {
  title?: string;
  description?: string;
  video_url?: string;
  duration_seconds?: number;
  order?: number;
  is_free_preview?: boolean;
  past_paper_schemes?: LessonScheme[];
  chapters?: LessonChapter[];
  key_moments?: LessonKeyMoment[];
  resources?: LessonResource[];
}

/** Full address of a lesson within the course tree (course → topic → subtopic). */
export interface LessonPath {
  courseId: string;
  topicId: string;
  subtopicId: string;
}

/* ── Course detail (full tree) ──────────────────────────────── */

export interface SubtopicDetail {
  id: string;
  name: string;
  order: number;
  lessons: LessonSummary[];
}

export interface TopicDetail {
  id: string;
  name: string;
  order: number;
  subtopics: SubtopicDetail[];
}

export interface CourseDetail extends Course {
  topics: TopicDetail[];
}
