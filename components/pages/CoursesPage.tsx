'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSubjects } from '@/hooks/query/useSubjects';
import { useCourses } from '@/hooks/query/useCourses';
import { useDeleteCourse } from '@/hooks/mutation/useCourseMutations';
import { useConfirm } from '@/hooks/useConfirm';
import { SubjectSelector } from '@/components/widgets/SubjectSelector';
import { CourseCard } from '@/components/widgets/CourseCard';
import { CourseFormModal } from '@/components/widgets/CourseFormModal';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { Card } from '@/components/ui/Card';
import { PlusIcon } from '@/components/icons/PlusIcon';
import { SearchIcon } from '@/components/icons/SearchIcon';
import { BookIcon } from '@/components/icons/BookIcon';
import type { Course } from '@/types/course';

const PAGE_SIZE = 9;
const PUBLISH_TABS = ['All', 'Published', 'Draft'];

/** Admin course catalogue — subject-scoped, with create/edit/delete. */
export function CoursesPage() {
  const { data: subjects, isLoading: subjectsLoading } = useSubjects();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [publish, setPublish] = useState('All');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);

  // Default to the first subject until the admin picks one — derived, no effect.
  const subjectId = selectedId ?? subjects?.[0]?.id ?? null;

  // Debounce search; reset to page 1 on a new term.
  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(id);
  }, [searchInput]);

  const isPublished = publish === 'All' ? undefined : publish === 'Published';

  const query = useMemo(
    () =>
      subjectId
        ? { subject_id: subjectId, page, limit: PAGE_SIZE, search: search || undefined, is_published: isPublished }
        : null,
    [subjectId, page, search, isPublished],
  );

  const { data, isLoading, isError } = useCourses(query);
  const { mutate: removeCourse, error: deleteError } = useDeleteCourse();
  const confirm = useConfirm();

  const handleSelectSubject = (id: string | null) => {
    if (!id) return;
    setSelectedId(id);
    setPage(1);
  };

  const handlePublishChange = (next: string) => {
    setPublish(next);
    setPage(1);
  };

  const handleDelete = async (course: Course) => {
    const ok = await confirm({
      title: `Delete “${course.title}”?`,
      message:
        'Its topics, subtopics and lessons are NOT deleted automatically — clean them up first to avoid orphaned content.',
      confirmLabel: 'Delete course',
      tone: 'danger',
    });
    if (!ok) return;
    setDeletingId(course.id);
    removeCourse(course.id, { onSettled: () => setDeletingId(null) });
  };

  const courses = data?.items ?? [];
  const total = data?.total ?? 0;
  const pages = data?.pages ?? 1;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col">
          <h1 className="font-display text-[26px] font-extrabold text-ink">Courses</h1>
          <span className="mt-2 text-[13px] text-muted">
            {total} {total === 1 ? 'course' : 'courses'} in this subject
          </span>
        </div>
        <Button onClick={() => setCreateOpen(true)} disabled={!subjectId}>
          <PlusIcon size={14} /> New course
        </Button>
      </div>

      <div className="mb-4">
        <SubjectSelector
          subjects={subjects ?? []}
          isLoading={subjectsLoading}
          selectedId={subjectId}
          onSelect={handleSelectSubject}
        />
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-2 text-muted">
          <SearchIcon size={15} />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search course titles…"
            className="w-48 min-w-0 border-0 bg-transparent text-sm text-ink outline-none placeholder:text-muted-2 sm:w-60"
          />
        </label>
        <Tabs options={PUBLISH_TABS} value={publish} onChange={handlePublishChange} />
      </div>

      {isError && (
        <p className="mb-3 text-[13px] font-medium text-[var(--red)]">
          Couldn’t load courses. Check your connection and try again.
        </p>
      )}
      {deleteError && (
        <p className="mb-3 text-[13px] font-medium text-[var(--red)]">
          Couldn’t delete that course — it may require superadmin access.
        </p>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-[var(--radius)] bg-line" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <Card className="flex flex-col items-center gap-2 py-14 text-center">
          <span className="text-muted-2">
            <BookIcon size={32} />
          </span>
          <p className="font-display text-[15px] font-bold text-ink">No courses yet</p>
          <p className="max-w-sm text-[13px] text-muted">
            {subjectId
              ? 'Create the first course for this subject to start building its content.'
              : 'Pick a subject above to view its courses.'}
          </p>
          {subjectId && (
            <Button onClick={() => setCreateOpen(true)} className="mt-2">
              <PlusIcon size={14} /> New course
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              deleting={deletingId === course.id}
              onEdit={setEditing}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {courses.length > 0 && (
        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="text-[13px] text-muted">
            Page {page} of {pages}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-2.5 py-1.5 text-xs"
            >
              ← Prev
            </Button>
            <Button
              variant="ghost"
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page >= pages}
              className="px-2.5 py-1.5 text-xs"
            >
              Next →
            </Button>
          </div>
        </div>
      )}

      {subjectId && (
        <CourseFormModal
          open={createOpen}
          subjectId={subjectId}
          onClose={() => setCreateOpen(false)}
        />
      )}
      {subjectId && editing && (
        <CourseFormModal
          open
          subjectId={subjectId}
          course={editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
