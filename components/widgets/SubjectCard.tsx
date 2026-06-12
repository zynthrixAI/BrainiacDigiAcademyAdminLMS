'use client';

import Link from 'next/link';
import type { Subject } from '@/types/subject';
import { Pill } from '@/components/ui/Pill';
import { LayersIcon } from '@/components/icons/LayersIcon';
import { UsersIcon } from '@/components/icons/UsersIcon';
import { EditIcon } from '@/components/icons/EditIcon';
import { TrashIcon } from '@/components/icons/TrashIcon';

interface SubjectCardProps {
  subject: Subject;
  deleting: boolean;
  onEdit: (subject: Subject) => void;
  onDelete: (subject: Subject) => void;
}

export function SubjectCard({ subject, deleting, onEdit, onDelete }: SubjectCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-[var(--radius)] border border-line bg-bg-elev shadow-[0_1px_0_rgba(28,27,27,0.02),0_1px_2px_rgba(28,27,27,0.03)] transition-shadow hover:shadow-[0_4px_16px_rgba(28,27,27,0.08)]">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#f0eeea]">
        {subject.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={subject.thumbnail_url}
            alt={subject.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-2">
            <LayersIcon size={34} />
          </div>
        )}
        <div className="absolute left-3 top-3 flex gap-1.5">
          <Pill className="bg-white/90 text-ink">{subject.level} Level</Pill>
          {subject.is_published ? (
            <Pill className="bg-[#ecfdf5] text-[var(--green)]">Published</Pill>
          ) : (
            <Pill className="bg-white/90 text-muted">Draft</Pill>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 font-display text-[15px] font-extrabold leading-snug text-ink">
          {subject.name}
        </h3>
        <p className="mt-1 line-clamp-2 min-h-[34px] text-[12.5px] text-muted">
          {subject.description || 'No description.'}
        </p>

        <div className="mt-4 flex items-center gap-2 border-t border-line pt-3">
          <Link
            href={`/batches?subject=${subject.id}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-line bg-white py-2 text-center font-display text-[12.5px] font-bold text-ink transition-colors hover:border-ink"
          >
            <UsersIcon size={13} /> Batches
          </Link>
          <button
            type="button"
            title="Edit subject"
            onClick={() => onEdit(subject)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-line bg-white text-muted transition-colors hover:border-ink hover:text-ink"
          >
            <EditIcon size={14} />
          </button>
          <button
            type="button"
            title="Delete subject"
            onClick={() => onDelete(subject)}
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
