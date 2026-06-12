'use client';

import { useEffect, useState } from 'react';
import { useUsers } from '@/hooks/query/useUsers';
import { SearchIcon } from '@/components/icons/SearchIcon';
import { CloseIcon } from '@/components/icons/CloseIcon';

/** Minimal student reference the picker hands back. */
export interface PickedStudent {
  id: string;
  name: string;
}

interface StudentPickerProps {
  value: PickedStudent | null;
  onChange: (student: PickedStudent | null) => void;
}

/** Server-backed typeahead for selecting a single student by name/email. */
export function StudentPicker({ value, onChange }: StudentPickerProps) {
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setSearch(input.trim()), 300);
    return () => clearTimeout(id);
  }, [input]);

  const { data, isFetching } = useUsers({ search: search || undefined, limit: 8 });
  const results = data?.items ?? [];
  const showPanel = open && search.length >= 2;

  if (value) {
    return (
      <div className="flex items-center justify-between gap-2 rounded-xl border border-yellow bg-yellow-soft px-3.5 py-2.5">
        <span className="truncate text-sm font-semibold text-ink">{value.name}</span>
        <button
          type="button"
          onClick={() => onChange(null)}
          aria-label="Clear selected student"
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-black/[0.05] hover:text-ink"
        >
          <CloseIcon size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <label className="flex items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-2.5 text-muted focus-within:border-yellow">
        <SearchIcon size={15} />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search students by name or email…"
          className="w-full min-w-0 border-0 bg-transparent text-sm text-ink outline-none placeholder:text-muted-2"
        />
      </label>

      {showPanel && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-line bg-white shadow-[0_12px_32px_rgba(0,0,0,0.14)]">
          {isFetching && results.length === 0 && (
            <div className="px-3.5 py-3 text-[13px] text-muted">Searching…</div>
          )}
          {!isFetching && results.length === 0 && (
            <div className="px-3.5 py-3 text-[13px] text-muted">No students found.</div>
          )}
          <ul className="no-scrollbar max-h-[240px] overflow-y-auto py-1">
            {results.map((u) => (
              <li key={u.id}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onChange({ id: u.id, name: u.name });
                    setInput('');
                    setOpen(false);
                  }}
                  className="flex w-full flex-col px-3.5 py-2 text-left transition-colors hover:bg-[#faf9f7]"
                >
                  <span className="text-[13.5px] font-semibold text-ink">{u.name}</span>
                  <span className="text-[12px] text-muted">{u.email}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
