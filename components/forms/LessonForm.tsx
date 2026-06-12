'use client';

import { useState, type FormEvent } from 'react';
import type {
  Lesson,
  LessonChapter,
  LessonKeyMoment,
  CourseFile,
  LessonPath,
} from '@/types/course';
import { useLessonMutations } from '@/hooks/mutation/useLessonMutations';
import { apiErrorMessage } from '@/lib/utils/api-error';
import { TextField } from '@/components/ui/TextField';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { PlusIcon } from '@/components/icons/PlusIcon';
import { TrashIcon } from '@/components/icons/TrashIcon';
import { CourseFileList } from './CourseFileList';

interface LessonFormProps {
  path: LessonPath;
  lesson?: Lesson;
  /** Default order for a new lesson (count of existing lessons). */
  defaultOrder?: number;
  onSaved: () => void;
  onCancel: () => void;
}

const fileTypeOf = (url: string): string => {
  const ext = url.split('?')[0].split('.').pop();
  return ext && ext.length <= 5 ? ext.toLowerCase() : 'file';
};

/** Editor for a single lesson, including chapters, key moments and files. */
export function LessonForm({ path, lesson, defaultOrder = 0, onSaved, onCancel }: LessonFormProps) {
  const isEdit = Boolean(lesson);
  const { create, update, upload } = useLessonMutations(path.courseId);

  const [title, setTitle] = useState(lesson?.title ?? '');
  const [description, setDescription] = useState(lesson?.description ?? '');
  const [videoUrl, setVideoUrl] = useState(lesson?.video_url ?? '');
  const [duration, setDuration] = useState(String(lesson?.duration_seconds ?? 0));
  const [order, setOrder] = useState(String(lesson?.order ?? defaultOrder));
  const [isFreePreview, setIsFreePreview] = useState(lesson?.is_free_preview ?? false);
  const [chapters, setChapters] = useState<LessonChapter[]>(lesson?.chapters ?? []);
  const [keyMoments, setKeyMoments] = useState<LessonKeyMoment[]>(lesson?.key_moments ?? []);
  const [resources, setResources] = useState<CourseFile[]>(lesson?.resources ?? []);
  const [schemes, setSchemes] = useState<CourseFile[]>(
    (lesson?.past_paper_schemes ?? []).map((s) => ({ ...s, file_type: fileTypeOf(s.url) })),
  );

  const uploadLessonFiles = async (files: File[]) => {
    const res = await upload.mutateAsync({ path, files });
    return res.urls;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = {
      title: title.trim(),
      description: description.trim(),
      video_url: videoUrl.trim(),
      duration_seconds: Number(duration) || 0,
      order: Number(order) || 0,
      is_free_preview: isFreePreview,
      chapters: chapters.filter((c) => c.title.trim()),
      key_moments: keyMoments.filter((k) => k.label.trim()),
      resources,
      past_paper_schemes: schemes.map(({ title: t, url }) => ({ title: t, url })),
    };
    if (isEdit && lesson) {
      update.mutate({ path, lessonId: lesson.id, body }, { onSuccess: onSaved });
    } else {
      create.mutate({ path, body }, { onSuccess: onSaved });
    }
  };

  const mutation = isEdit ? update : create;
  const errorText = mutation.error
    ? apiErrorMessage(mutation.error, 'Couldn’t save the lesson. Please try again.')
    : null;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <TextField
        id="lesson-title"
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        autoFocus
      />

      <div className="flex flex-col gap-2">
        <label htmlFor="lesson-desc" className="font-display text-[12.5px] font-bold text-ink-2">
          Description
        </label>
        <textarea
          id="lesson-desc"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="resize-none rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-yellow"
        />
      </div>

      <TextField
        id="lesson-video"
        label="Video URL (HLS .m3u8)"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        placeholder="https://…/stream.m3u8"
      />

      <div className="grid grid-cols-3 gap-3">
        <TextField
          id="lesson-duration"
          type="number"
          min={0}
          label="Duration (sec)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
        <TextField
          id="lesson-order"
          type="number"
          min={0}
          label="Order"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
        />
        <Checkbox
          checked={isFreePreview}
          onChange={setIsFreePreview}
          label="Free preview"
          className="mt-auto h-[42px]"
        />
      </div>

      <TimestampList
        label="Chapters"
        textLabel="Title"
        items={chapters.map((c) => ({ text: c.title, seconds: c.timestamp_seconds }))}
        onChange={(rows) =>
          setChapters(rows.map((r) => ({ title: r.text, timestamp_seconds: r.seconds })))
        }
      />
      <TimestampList
        label="Key moments"
        textLabel="Label"
        items={keyMoments.map((k) => ({ text: k.label, seconds: k.timestamp_seconds }))}
        onChange={(rows) =>
          setKeyMoments(rows.map((r) => ({ label: r.text, timestamp_seconds: r.seconds })))
        }
      />

      <CourseFileList
        label="Resources"
        helper="Downloadable files"
        items={resources}
        onChange={setResources}
        onUploadFiles={uploadLessonFiles}
      />
      <CourseFileList
        label="Past paper schemes"
        helper="Mark scheme files"
        items={schemes}
        onChange={setSchemes}
        onUploadFiles={uploadLessonFiles}
      />

      {errorText && <p className="text-[13px] font-medium text-[var(--red)]">{errorText}</p>}

      <div className="flex justify-end gap-2 border-t border-line pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving…' : isEdit ? 'Save lesson' : 'Create lesson'}
        </Button>
      </div>
    </form>
  );
}

/* ── Timestamped list (chapters / key moments) ──────────────── */

interface TimestampRow {
  text: string;
  seconds: number;
}

interface TimestampListProps {
  label: string;
  textLabel: string;
  items: TimestampRow[];
  onChange: (rows: TimestampRow[]) => void;
}

function TimestampList({ label, textLabel, items, onChange }: TimestampListProps) {
  const add = () => onChange([...items, { text: '', seconds: 0 }]);
  const update = (index: number, patch: Partial<TimestampRow>) =>
    onChange(items.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  const remove = (index: number) => onChange(items.filter((_, i) => i !== index));

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="font-display text-[12.5px] font-bold text-ink-2">{label}</label>
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1 text-[12px] font-bold text-ink hover:underline"
        >
          <PlusIcon size={12} /> Add
        </button>
      </div>
      {items.map((row, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            value={row.text}
            onChange={(e) => update(index, { text: e.target.value })}
            placeholder={textLabel}
            className="min-w-0 flex-1 rounded-xl border border-line bg-white px-3 py-2 text-[13px] text-ink outline-none focus:border-yellow"
          />
          <input
            type="number"
            min={0}
            value={row.seconds}
            onChange={(e) => update(index, { seconds: Number(e.target.value) || 0 })}
            title="Timestamp in seconds"
            className="w-20 shrink-0 rounded-xl border border-line bg-white px-2.5 py-2 text-[13px] text-ink outline-none focus:border-yellow"
          />
          <span className="text-[11px] text-muted">sec</span>
          <button
            type="button"
            onClick={() => remove(index)}
            title="Remove"
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:text-[var(--red)]"
          >
            <TrashIcon size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}
