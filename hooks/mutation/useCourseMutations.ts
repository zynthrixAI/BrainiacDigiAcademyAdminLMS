'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createCourse,
  updateCourse,
  deleteCourse,
  uploadCourseFiles,
} from '@/lib/api/courses';
import type { CourseCreateRequest, CourseUpdateRequest } from '@/types/course';

export const useCreateCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CourseCreateRequest) => createCourse(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['courses'] }),
  });
};

export const useUpdateCourse = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CourseUpdateRequest) => updateCourse(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['courses'] });
      qc.invalidateQueries({ queryKey: ['course', id] });
    },
  });
};

export const useDeleteCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCourse(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['courses'] }),
  });
};

/** Two-step upload helper — returns the CDN URLs to embed in a course body. */
export const useUploadCourseFiles = () =>
  useMutation({
    mutationFn: (files: { thumbnail?: File; past_papers?: File[]; class_notes?: File[] }) =>
      uploadCourseFiles(files),
  });
