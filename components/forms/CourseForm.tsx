'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { Course, CourseFile } from '@/types/course';
import { apiErrorMessage } from '@/lib/utils/api-error';
import { useTeachers } from '@/hooks/query/useTeachers';
import { useSubjects } from '@/hooks/query/useSubjects';
import {
  useCreateCourse,
  useUpdateCourse,
  useUploadCourseFiles,
} from '@/hooks/mutation/useCourseMutations';
import { TextField } from '@/components/ui/TextField';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { UploadIcon } from '@/components/icons/UploadIcon';
import { BookIcon } from '@/components/icons/BookIcon';
import { CourseFileList } from './CourseFileList';

interface CourseFormProps {
  subjectId: string;
  course?: Course;
  onSaved: () => void;
  onCancel: () => void;
}

export function CourseForm({ subjectId: initialSubjectId, course, onSaved, onCancel }: CourseFormProps) {
  const isEdit = Boolean(course);
  const { data: teacherData } = useTeachers({ page: 1, limit: 100 });
  const { data: subjects } = useSubjects();
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse(course?.id ?? '');
  const uploadFiles = useUploadCourseFiles();

  // subject_id is set at creation and not changed on edit, so the picker is create-only.
  const [subjectId, setSubjectId] = useState(course?.subject_id ?? initialSubjectId);
  const [title, setTitle] = useState(course?.title ?? '');
  const [description, setDescription] = useState(course?.description ?? '');
  const [teacherId, setTeacherId] = useState(course?.teacher_id ?? '');
  const [teacherName, setTeacherName] = useState(course?.teacher_name ?? '');
  const [price, setPrice] = useState(String(course?.price ?? 0));
  const [isPublished, setIsPublished] = useState(course?.is_published ?? false);
  const [thumbnailUrl, setThumbnailUrl] = useState(course?.thumbnail_url ?? '');
  const [pastPapers, setPastPapers] = useState<CourseFile[]>(course?.past_papers ?? []);
  const [classNotes, setClassNotes] = useState<CourseFile[]>(course?.class_notes ?? []);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [thumbError, setThumbError] = useState<string | null>(null);

  const teacherOptions = [
    { label: '— Unassigned', value: '' },
    ...(teacherData?.items ?? []).map((t) => ({ label: t.name, value: t.id })),
  ];

  const subjectOptions = (subjects ?? []).map((s) => ({
    label: s.name,
    value: s.id,
    description: s.level === 'A' ? 'A Level' : 'O Level',
  }));

  const handleTeacherChange = (value: string) => {
    setTeacherId(value);
    const picked = teacherData?.items.find((t) => t.id === value);
    if (picked) setTeacherName(picked.name);
  };

  const handleThumbnail = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setUploadingThumb(true);
    setThumbError(null);
    try {
      const res = await uploadFiles.mutateAsync({ thumbnail: file });
      if (res.thumbnail_url) setThumbnailUrl(res.thumbnail_url);
    } catch (error) {
      setThumbError(apiErrorMessage(error, 'Thumbnail upload failed.'));
    } finally {
      setUploadingThumb(false);
    }
  };

  const uploadPastPapers = async (files: File[]) => {
    const res = await uploadFiles.mutateAsync({ past_papers: files });
    return res.past_paper_urls ?? [];
  };
  const uploadClassNotes = async (files: File[]) => {
    const res = await uploadFiles.mutateAsync({ class_notes: files });
    return res.class_note_urls ?? [];
  };

  const mutation = isEdit ? updateCourse : createCourse;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isEdit && !subjectId) return;
    const shared = {
      title: title.trim(),
      description: description.trim(),
      teacher_id: teacherId || null,
      teacher_name: teacherName.trim(),
      thumbnail_url: thumbnailUrl || null,
      price: Number(price) || 0,
      is_published: isPublished,
      past_papers: pastPapers,
      class_notes: classNotes,
    };
    if (isEdit) {
      updateCourse.mutate(shared, { onSuccess: onSaved });
    } else {
      createCourse.mutate({ subject_id: subjectId, ...shared }, { onSuccess: onSaved });
    }
  };

  const errorText = mutation.error
    ? apiErrorMessage(mutation.error, 'Couldn’t save the course. Please try again.')
    : null;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Thumbnail */}
      <div className="flex items-center gap-4">
        <div className="flex aspect-[16/9] w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-[#f0eeea] text-muted-2">
          {thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumbnailUrl} alt="Thumbnail" className="h-full w-full object-cover" />
          ) : (
            <BookIcon size={24} />
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="font-display text-[12.5px] font-bold text-ink-2">Thumbnail</span>
          <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-dashed border-line-2 bg-[#faf9f7] px-3 py-2 text-[12.5px] font-semibold text-muted transition-colors hover:border-ink hover:text-ink">
            <UploadIcon size={14} />
            {uploadingThumb ? 'Uploading…' : 'Upload image'}
            <input type="file" accept="image/*" onChange={handleThumbnail} className="hidden" />
          </label>
          {thumbError && <p className="text-[12px] font-medium text-[var(--red)]">{thumbError}</p>}
        </div>
      </div>

      <Select
        id="course-subject"
        label="Subject"
        value={subjectId}
        onChange={setSubjectId}
        options={subjectOptions}
        placeholder="Select a subject…"
        searchable
        disabled={isEdit}
      />

      <TextField
        id="course-title"
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <div className="flex flex-col gap-2">
        <label htmlFor="course-desc" className="font-display text-[12.5px] font-bold text-ink-2">
          Description
        </label>
        <textarea
          id="course-desc"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="resize-none rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-yellow"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Select
          id="course-teacher"
          label="Teacher"
          value={teacherId}
          onChange={handleTeacherChange}
          options={teacherOptions}
          searchable
        />
        <TextField
          id="course-teacher-name"
          label="Teacher name (shown)"
          value={teacherName}
          onChange={(e) => setTeacherName(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <TextField
          id="course-price"
          type="number"
          min={0}
          label="Price (PKR)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <Checkbox
          checked={isPublished}
          onChange={setIsPublished}
          label="Published"
          className="mt-auto h-[42px]"
        />
      </div>

      <CourseFileList
        label="Past papers"
        helper="Replaces the saved list"
        items={pastPapers}
        onChange={setPastPapers}
        onUploadFiles={uploadPastPapers}
      />
      <CourseFileList
        label="Class notes"
        helper="Replaces the saved list"
        items={classNotes}
        onChange={setClassNotes}
        onUploadFiles={uploadClassNotes}
      />

      {errorText && <p className="text-[13px] font-medium text-[var(--red)]">{errorText}</p>}

      <div className="flex justify-end gap-2 border-t border-line pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending || (!isEdit && !subjectId)}>
          {mutation.isPending ? 'Saving…' : isEdit ? 'Save changes' : 'Create course'}
        </Button>
      </div>
    </form>
  );
}
