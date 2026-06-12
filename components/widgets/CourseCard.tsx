'use client';

import Link from 'next/link';
import type { Course } from '@/types/course';
import { Pill } from '@/components/ui/Pill';
import { BookIcon } from '@/components/icons/BookIcon';
import { EditIcon } from '@/components/icons/EditIcon';
import { TrashIcon } from '@/components/icons/TrashIcon';
import { PlayIcon } from '@/components/icons/PlayIcon';
import { formatPrice } from '@/lib/utils/format';

interface CourseCardProps {
  course: Course;
  deleting: boolean;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
}

export function CourseCard({ course, deleting, onEdit, onDelete }: CourseCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-[var(--radius)] border border-line bg-bg-elev shadow-[0_1px_0_rgba(28,27,27,0.02),0_1px_2px_rgba(28,27,27,0.03)] transition-shadow hover:shadow-[0_4px_16px_rgba(28,27,27,0.08)]">
      <Link href={`/courses/${course.id}`} className="block">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#f0eeea]">
          {course.thumbnail_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-2">
              <BookIcon size={34} />
            </div>
          )}
          <div className="absolute left-3 top-3">
            {course.is_published ? (
              <Pill className="bg-[#ecfdf5] text-[var(--green)]">Published</Pill>
            ) : (
              <Pill className="bg-white/90 text-muted">Draft</Pill>
            )}
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/courses/${course.id}`} className="block">
          <h3 className="line-clamp-2 font-display text-[15px] font-extrabold leading-snug text-ink hover:underline">
            {course.title}
          </h3>
        </Link>
        <span className="mt-1 text-[12.5px] text-muted">{course.teacher_name || 'Unassigned'}</span>

        <div className="mt-3 flex items-center gap-3 text-[12px] text-muted">
          <span className="inline-flex items-center gap-1">
            <PlayIcon size={12} /> {course.total_lessons} lessons
          </span>
          <span className="font-semibold text-ink">{formatPrice(course.price)}</span>
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-line pt-3">
          <Link
            href={`/courses/${course.id}`}
            className="flex-1 rounded-[10px] border border-line bg-white py-2 text-center font-display text-[12.5px] font-bold text-ink transition-colors hover:border-ink"
          >
            Manage content
          </Link>
          <button
            type="button"
            title="Edit course"
            onClick={() => onEdit(course)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-line bg-white text-muted transition-colors hover:border-ink hover:text-ink"
          >
            <EditIcon size={14} />
          </button>
          <button
            type="button"
            title="Delete course"
            onClick={() => onDelete(course)}
            disabled={deleting}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-line bg-white text-muted transition-colors hover:border-[var(--red)] hover:text-[var(--red)] disabled:opacity-50"
          >
            <TrashIcon size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
