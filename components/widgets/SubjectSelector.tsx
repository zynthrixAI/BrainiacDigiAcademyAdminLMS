'use client';

import type { Subject } from '@/types/subject';

interface SubjectSelectorProps {
  subjects: Subject[];
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  /** Render a leading "All" chip. When active, selectedId is null. */
  includeAll?: boolean;
}

const chip = (active: boolean): string =>
  `inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 font-display text-[13px] font-semibold transition-colors ${
    active
      ? 'border-ink bg-ink text-white'
      : 'border-line bg-white text-muted hover:border-ink hover:text-ink'
  }`;

/** Horizontal, scrollable row of subject chips. */
export function SubjectSelector({
  subjects,
  isLoading,
  selectedId,
  onSelect,
  includeAll = false,
}: SubjectSelectorProps) {
  if (isLoading) {
    return (
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-9 w-28 shrink-0 animate-pulse rounded-full bg-line" />
        ))}
      </div>
    );
  }

  if (subjects.length === 0) {
    return (
      <p className="text-[13px] text-muted">
        No subjects available. Create a subject first.
      </p>
    );
  }

  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
      {includeAll && (
        <button type="button" onClick={() => onSelect(null)} className={chip(selectedId === null)}>
          All subjects
        </button>
      )}
      {subjects.map((subject) => {
        const active = subject.id === selectedId;
        return (
          <button
            key={subject.id}
            type="button"
            onClick={() => onSelect(subject.id)}
            className={chip(active)}
          >
            {subject.name}
            {subject.level && (
              <span
                className={`rounded-full px-1.5 text-[10px] font-bold ${
                  active ? 'bg-white/20 text-white' : 'bg-[#f0eeea] text-muted'
                }`}
              >
                {subject.level}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
