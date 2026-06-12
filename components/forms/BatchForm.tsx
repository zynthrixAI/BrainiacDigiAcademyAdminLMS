'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { Batch } from '@/types/batch';
import { apiErrorMessage } from '@/lib/utils/api-error';
import { useTeachers } from '@/hooks/query/useTeachers';
import { useSubjects } from '@/hooks/query/useSubjects';
import { useBatchMutations } from '@/hooks/mutation/useBatchMutations';
import { TextField } from '@/components/ui/TextField';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { UploadIcon } from '@/components/icons/UploadIcon';
import { UsersIcon } from '@/components/icons/UsersIcon';

interface BatchFormProps {
  subjectId: string;
  batch?: Batch;
  onSaved: () => void;
  onCancel: () => void;
}

export function BatchForm({ subjectId: initialSubjectId, batch, onSaved, onCancel }: BatchFormProps) {
  const isEdit = Boolean(batch);
  const { data: teacherData } = useTeachers({ page: 1, limit: 100 });
  const { data: subjects } = useSubjects();
  const { create, update } = useBatchMutations();

  // subject_id can't be changed after creation, so the picker is create-only.
  const [subjectId, setSubjectId] = useState(batch?.subject_id ?? initialSubjectId);
  const [name, setName] = useState(batch?.name ?? '');
  const [description, setDescription] = useState(batch?.description ?? '');
  const [teacherId, setTeacherId] = useState(batch?.teacher_id ?? '');
  const [price, setPrice] = useState(String(batch?.price ?? 0));
  const [isPublished, setIsPublished] = useState(batch?.is_published ?? false);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(batch?.thumbnail_url ?? null);

  const teacherOptions = [
    { label: '— Unassigned', value: '' },
    ...(teacherData?.items ?? []).map((t) => ({ label: t.name, value: t.id })),
  ];

  const subjectOptions = (subjects ?? []).map((s) => ({
    label: s.name,
    value: s.id,
    description: s.level === 'A' ? 'A Level' : 'O Level',
  }));

  const handleThumbnail = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    event.target.value = '';
    if (!file) return;
    setThumbFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const mutation = isEdit ? update : create;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isEdit && !subjectId) return;
    const shared = {
      name: name.trim(),
      description: description.trim(),
      teacher_id: teacherId || null,
      thumbnail: thumbFile,
      price: Number(price) || 0,
      is_published: isPublished,
    };
    if (isEdit && batch) {
      update.mutate({ id: batch.id, body: shared }, { onSuccess: onSaved });
    } else {
      create.mutate({ subject_id: subjectId, ...shared }, { onSuccess: onSaved });
    }
  };

  const errorText = mutation.error
    ? apiErrorMessage(mutation.error, 'Couldn’t save the batch. Please try again.')
    : null;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="flex aspect-[16/9] w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-[#f0eeea] text-muted-2">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Thumbnail" className="h-full w-full object-cover" />
          ) : (
            <UsersIcon size={24} />
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="font-display text-[12.5px] font-bold text-ink-2">Thumbnail</span>
          <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-dashed border-line-2 bg-[#faf9f7] px-3 py-2 text-[12.5px] font-semibold text-muted transition-colors hover:border-ink hover:text-ink">
            <UploadIcon size={14} />
            {thumbFile ? 'Change image' : 'Upload image'}
            <input type="file" accept="image/*" onChange={handleThumbnail} className="hidden" />
          </label>
          <span className="text-[11.5px] text-muted-2">Optional · 16:9 recommended</span>
        </div>
      </div>

      <Select
        id="batch-subject"
        label="Subject"
        value={subjectId}
        onChange={setSubjectId}
        options={subjectOptions}
        placeholder="Select a subject…"
        searchable
        disabled={isEdit}
      />

      <TextField
        id="batch-name"
        label="Batch name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Morning Cohort 2025"
        required
      />

      <div className="flex flex-col gap-2">
        <label htmlFor="batch-desc" className="font-display text-[12.5px] font-bold text-ink-2">
          Description
        </label>
        <textarea
          id="batch-desc"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="resize-none rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-yellow"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Select
          id="batch-teacher"
          label="Teacher"
          value={teacherId}
          onChange={setTeacherId}
          options={teacherOptions}
          searchable
        />
        <TextField
          id="batch-price"
          type="number"
          min={0}
          label="Price (PKR)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      <Checkbox
        checked={isPublished}
        onChange={setIsPublished}
        label="Published — appears in the student feed"
      />

      {errorText && <p className="text-[13px] font-medium text-[var(--red)]">{errorText}</p>}

      <div className="flex justify-end gap-2 border-t border-line pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending || (!isEdit && !subjectId)}>
          {mutation.isPending ? 'Saving…' : isEdit ? 'Save changes' : 'Create batch'}
        </Button>
      </div>
    </form>
  );
}
