'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCourse } from '@/hooks/query/useCourse';
import { CourseTree } from '@/components/widgets/CourseTree';
import { CourseFormModal } from '@/components/widgets/CourseFormModal';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Pill } from '@/components/ui/Pill';
import { BookIcon } from '@/components/icons/BookIcon';
import { EditIcon } from '@/components/icons/EditIcon';
import { ArrowIcon } from '@/components/icons/ArrowIcon';
import { formatPrice } from '@/lib/utils/format';
import type { CourseFile } from '@/types/course';

function FileList({ title, files }: { title: string; files: CourseFile[] }) {
  if (files.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <span className="font-display text-[12.5px] font-bold text-ink-2">{title}</span>
      <div className="flex flex-wrap gap-2">
        {files.map((file, i) => (
          <a
            key={`${file.url}-${i}`}
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 py-1.5 text-[12.5px] text-ink transition-colors hover:border-ink"
          >
            <span className="rounded bg-[#f0eeea] px-1.5 py-0.5 text-[10px] font-bold uppercase text-muted">
              {file.file_type}
            </span>
            {file.title}
          </a>
        ))}
      </div>
    </div>
  );
}

export function CourseDetailPage({ courseId }: { courseId: string }) {
  const { data: course, isLoading, isError } = useCourse(courseId);
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div>
      <Link
        href="/courses"
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted transition-colors hover:text-ink"
      >
        <ArrowIcon size={14} className="rotate-180" /> Back to courses
      </Link>

      {isLoading && (
        <Card className="py-14 text-center text-sm text-muted">Loading course…</Card>
      )}
      {isError && (
        <Card className="py-14 text-center text-sm text-[var(--red)]">
          Couldn’t load this course.
        </Card>
      )}

      {course && (
        <>
          <Card className="mb-5">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex aspect-[16/9] w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f0eeea] text-muted-2 sm:w-52">
                {course.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <BookIcon size={30} />
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-col">
                    <div className="flex items-center gap-2">
                      {course.is_published ? (
                        <Pill className="bg-[#ecfdf5] text-[var(--green)]">Published</Pill>
                      ) : (
                        <Pill className="bg-[#f5f5f4] text-muted">Draft</Pill>
                      )}
                      <span className="text-[12.5px] text-muted">
                        {course.total_lessons} lessons
                      </span>
                    </div>
                    <h1 className="mt-2 font-display text-[22px] font-extrabold leading-tight text-ink">
                      {course.title}
                    </h1>
                    <span className="mt-1 text-[13px] text-muted">
                      {course.teacher_name || 'Unassigned'} · {formatPrice(course.price)}
                    </span>
                  </div>
                  <Button variant="ghost" onClick={() => setEditOpen(true)}>
                    <EditIcon size={13} /> Edit course
                  </Button>
                </div>

                {course.description && (
                  <p className="mt-3 text-[13.5px] leading-relaxed text-ink-2">
                    {course.description}
                  </p>
                )}

                {(course.past_papers.length > 0 || course.class_notes.length > 0) && (
                  <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4">
                    <FileList title="Past papers" files={course.past_papers} />
                    <FileList title="Class notes" files={course.class_notes} />
                  </div>
                )}
              </div>
            </div>
          </Card>

          <CourseTree course={course} />

          <CourseFormModal
            open={editOpen}
            subjectId={course.subject_id}
            course={course}
            onClose={() => setEditOpen(false)}
          />
        </>
      )}
    </div>
  );
}
