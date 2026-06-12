'use client';

import { useId, useState, type ChangeEvent } from 'react';
import type { CourseFile } from '@/types/course';
import { UploadIcon } from '@/components/icons/UploadIcon';
import { TrashIcon } from '@/components/icons/TrashIcon';

interface CourseFileListProps {
  label: string;
  helper: string;
  items: CourseFile[];
  onChange: (items: CourseFile[]) => void;
  /** Upload raw files; resolve to the stored CDN URLs in order. */
  onUploadFiles: (files: File[]) => Promise<string[]>;
}

const fileTypeOf = (name: string): string => {
  const ext = name.split('.').pop();
  return ext && ext !== name ? ext.toLowerCase() : 'file';
};

const baseName = (name: string): string => name.replace(/\.[^.]+$/, '');

/** Upload + manage a wholesale list of course files (past papers / class notes). */
export function CourseFileList({
  label,
  helper,
  items,
  onChange,
  onUploadFiles,
}: CourseFileListProps) {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const urls = await onUploadFiles(files);
      const added = files.map((file, i) => ({
        title: baseName(file.name),
        url: urls[i] ?? '',
        file_type: fileTypeOf(file.name),
      }));
      onChange([...items, ...added.filter((a) => a.url)]);
    } catch {
      setError('Upload failed. You may need superadmin access.');
    } finally {
      setUploading(false);
    }
  };

  const updateTitle = (index: number, title: string) => {
    onChange(items.map((item, i) => (i === index ? { ...item, title } : item)));
  };

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="font-display text-[12.5px] font-bold text-ink-2">{label}</label>
        <span className="text-[11.5px] text-muted">{helper}</span>
      </div>

      {items.length > 0 && (
        <div className="flex flex-col gap-2">
          {items.map((item, index) => (
            <div
              key={`${item.url}-${index}`}
              className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2"
            >
              <span className="rounded-md bg-[#f0eeea] px-1.5 py-0.5 text-[10px] font-bold uppercase text-muted">
                {item.file_type}
              </span>
              <input
                value={item.title}
                onChange={(e) => updateTitle(index, e.target.value)}
                placeholder="File title"
                className="min-w-0 flex-1 border-0 bg-transparent text-[13px] text-ink outline-none"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                title="Remove file"
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:text-[var(--red)]"
              >
                <TrashIcon size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      <label
        htmlFor={inputId}
        className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-line-2 bg-[#faf9f7] px-3 py-2.5 text-[12.5px] font-semibold text-muted transition-colors hover:border-ink hover:text-ink"
      >
        <UploadIcon size={14} />
        {uploading ? 'Uploading…' : `Upload ${label.toLowerCase()}`}
        <input id={inputId} type="file" multiple onChange={handleFiles} className="hidden" />
      </label>

      {error && <p className="text-[12px] font-medium text-[var(--red)]">{error}</p>}
    </div>
  );
}
