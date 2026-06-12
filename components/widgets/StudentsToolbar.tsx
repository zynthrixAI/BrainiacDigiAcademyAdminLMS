'use client';

import { Tabs } from '@/components/ui/Tabs';
import { SearchIcon } from '@/components/icons/SearchIcon';
import type { Level } from '@/types/user';

export type LevelFilter = 'All' | Level;

const LEVELS: LevelFilter[] = ['All', 'A Level', 'O Level'];

interface StudentsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  level: LevelFilter;
  onLevelChange: (value: LevelFilter) => void;
}

export function StudentsToolbar({
  search,
  onSearchChange,
  level,
  onLevelChange,
}: StudentsToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="flex items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-2 text-muted">
        <SearchIcon size={15} />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search name or email…"
          className="w-44 min-w-0 border-0 bg-transparent text-sm text-ink outline-none placeholder:text-muted-2 sm:w-56"
        />
      </label>
      <Tabs
        options={LEVELS}
        value={level}
        onChange={(value) => onLevelChange(value as LevelFilter)}
      />
    </div>
  );
}
