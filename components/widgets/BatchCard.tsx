'use client';

import type { Batch } from '@/types/batch';
import { Pill } from '@/components/ui/Pill';
import { UsersIcon } from '@/components/icons/UsersIcon';
import { EditIcon } from '@/components/icons/EditIcon';
import { TrashIcon } from '@/components/icons/TrashIcon';
import { formatPrice } from '@/lib/utils/format';

interface BatchCardProps {
  batch: Batch;
  deleting: boolean;
  onManage: (batch: Batch) => void;
  onEdit: (batch: Batch) => void;
  onDelete: (batch: Batch) => void;
}

export function BatchCard({ batch, deleting, onManage, onEdit, onDelete }: BatchCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-[var(--radius)] border border-line bg-bg-elev shadow-[0_1px_0_rgba(28,27,27,0.02),0_1px_2px_rgba(28,27,27,0.03)] transition-shadow hover:shadow-[0_4px_16px_rgba(28,27,27,0.08)]">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#f0eeea]">
        {batch.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={batch.thumbnail_url}
            alt={batch.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-2">
            <UsersIcon size={34} />
          </div>
        )}
        <div className="absolute left-3 top-3">
          {batch.is_published ? (
            <Pill className="bg-[#ecfdf5] text-[var(--green)]">Published</Pill>
          ) : (
            <Pill className="bg-white/90 text-muted">Draft</Pill>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 font-display text-[15px] font-extrabold leading-snug text-ink">
          {batch.name}
        </h3>
        <span className="mt-1 text-[12.5px] text-muted">
          {batch.teacher_name || 'Unassigned'}
        </span>

        <div className="mt-3 flex items-center gap-3 text-[12px] text-muted">
          <span className="inline-flex items-center gap-1">
            <UsersIcon size={12} /> {batch.enrolled_count}{' '}
            {batch.enrolled_count === 1 ? 'student' : 'students'}
          </span>
          <span className="font-semibold text-ink">{formatPrice(batch.price)}</span>
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-line pt-3">
          <button
            type="button"
            onClick={() => onManage(batch)}
            className="flex-1 rounded-[10px] border border-line bg-white py-2 text-center font-display text-[12.5px] font-bold text-ink transition-colors hover:border-ink"
          >
            Manage
          </button>
          <button
            type="button"
            title="Edit batch"
            onClick={() => onEdit(batch)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-line bg-white text-muted transition-colors hover:border-ink hover:text-ink"
          >
            <EditIcon size={14} />
          </button>
          <button
            type="button"
            title="Delete batch"
            onClick={() => onDelete(batch)}
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
