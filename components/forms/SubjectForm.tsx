'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { Subject, SubjectLevel } from '@/types/subject';
import { apiErrorMessage } from '@/lib/utils/api-error';
import { useTeachers } from '@/hooks/query/useTeachers';
import { useSubjectMutations } from '@/hooks/mutation/useSubjectMutations';
import { TextField } from '@/components/ui/TextField';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { UploadIcon } from '@/components/icons/UploadIcon';
import { LayersIcon } from '@/components/icons/LayersIcon';

interface SubjectFormProps {
  subject?: Subject;
  onSaved: () => void;
  onCancel: () => void;
}

const LEVELS = [
  { label: 'O Level', value: 'O' },
  { label: 'A Level', value: 'A' },
];

export function SubjectForm({ subject, onSaved, onCancel }: SubjectFormProps) {
  const isEdit = Boolean(subject);
  const { data: teacherData } = useTeachers({ page: 1, limit: 100 });
  const { create, update } = useSubjectMutations();

  const [name, setName] = useState(subject?.name ?? '');
  const [level, setLevel] = useState<string>(subject?.level ?? 'O');
  const [description, setDescription] = useState(subject?.description ?? '');
  const [teacherId, setTeacherId] = useState(subject?.teacher_id ?? '');
  const [isPublished, setIsPublished] = useState(subject?.is_published ?? false);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(subject?.thumbnail_url ?? null);

  const teacherOptions = [
    { label: '— Unassigned', value: '' },
    ...(teacherData?.items ?? []).map((t) => ({ label: t.name, value: t.id })),
  ];

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
    const shared = {
      name: name.trim(),
      level: level as SubjectLevel,
      description: description.trim(),
      teacher_id: teacherId || null,
      thumbnail: thumbFile,
      is_published: isPublished,
    };
    if (isEdit && subject) {
      update.mutate({ id: subject.id, body: shared }, { onSuccess: onSaved });
    } else {
      create.mutate(shared, { onSuccess: onSaved });
    }
  };

  const errorText = mutation.error
    ? apiErrorMessage(mutation.error, 'Couldn’t save the subject. Please try again.')
    : null;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="flex aspect-[16/9] w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-[#f0eeea] text-muted-2">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Thumbnail" className="h-full w-full object-cover" />
          ) : (
            <LayersIcon size={24} />
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

      <TextField
        id="subject-name"
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. O Level Mathematics"
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <Select
          id="subject-level"
          label="Level"
          value={level}
          onChange={setLevel}
          options={LEVELS}
        />
        <Select
          id="subject-teacher"
          label="Owning teacher"
          value={teacherId}
          onChange={setTeacherId}
          options={teacherOptions}
          searchable
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="subject-desc" className="font-display text-[12.5px] font-bold text-ink-2">
          Description
        </label>
        <textarea
          id="subject-desc"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="resize-none rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-yellow"
        />
      </div>

      <Checkbox
        checked={isPublished}
        onChange={setIsPublished}
        label="Published — visible to students"
      />

      {errorText && <p className="text-[13px] font-medium text-[var(--red)]">{errorText}</p>}

      <div className="flex justify-end gap-2 border-t border-line pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving…' : isEdit ? 'Save changes' : 'Create subject'}
        </Button>
      </div>
    </form>
  );
}
