'use client';

import { useEffect, useMemo, useState } from 'react';
import type { BatchDetail } from '@/types/batch';
import { useUsers } from '@/hooks/query/useUsers';
import { useBatchEnrollment } from '@/hooks/mutation/useBatchEnrollment';
import { useConfirm } from '@/hooks/useConfirm';
import { apiErrorMessage } from '@/lib/utils/api-error';
import { Avatar } from '@/components/ui/Avatar';
import { SearchIcon } from '@/components/icons/SearchIcon';
import { PlusIcon } from '@/components/icons/PlusIcon';
import { TrashIcon } from '@/components/icons/TrashIcon';
import { UsersIcon } from '@/components/icons/UsersIcon';
import { initialsOf } from '@/lib/utils/format';

/** Enrolled-students list plus a search-to-enroll picker for one batch. */
export function BatchEnrollPanel({ batch }: { batch: BatchDetail }) {
  const { enroll, unenroll } = useBatchEnrollment(batch.id);
  const confirm = useConfirm();

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => clearTimeout(id);
  }, [searchInput]);

  const { data: userData, isFetching } = useUsers({ page: 1, limit: 6, search: search || undefined });

  const enrolledIds = useMemo(
    () => new Set(batch.enrolled_students.map((s) => s.id)),
    [batch.enrolled_students],
  );

  const candidates = (userData?.items ?? []).filter((u) => !enrolledIds.has(u.id));

  const handleEnroll = (studentId: string) => {
    setError(null);
    setBusyId(studentId);
    enroll.mutate(studentId, {
      onError: (err) => setError(apiErrorMessage(err, 'Couldn’t enroll that student.')),
      onSettled: () => setBusyId(null),
    });
  };

  const handleUnenroll = async (studentId: string, studentName: string) => {
    const ok = await confirm({
      title: `Remove ${studentName}?`,
      message: `They’ll be unenrolled from “${batch.name}”.`,
      confirmLabel: 'Remove',
      tone: 'danger',
    });
    if (!ok) return;
    setError(null);
    setBusyId(studentId);
    unenroll.mutate(studentId, {
      onError: (err) => setError(apiErrorMessage(err, 'Couldn’t remove that student.')),
      onSettled: () => setBusyId(null),
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {error && <p className="text-[13px] font-medium text-[var(--red)]">{error}</p>}

      {/* Enrol a student */}
      <div className="rounded-xl border border-line bg-[#faf9f7] p-3">
        <label className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-muted">
          <SearchIcon size={15} />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search students by name or email…"
            className="w-full min-w-0 border-0 bg-transparent text-sm text-ink outline-none placeholder:text-muted-2"
          />
        </label>

        <div className="mt-2 flex flex-col">
          {isFetching && candidates.length === 0 ? (
            <p className="px-1 py-3 text-[12.5px] text-muted">Searching…</p>
          ) : candidates.length === 0 ? (
            <p className="px-1 py-3 text-[12.5px] text-muted">
              {search ? 'No matching students.' : 'Search to find students to enroll.'}
            </p>
          ) : (
            candidates.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 rounded-lg px-1 py-2 hover:bg-white"
              >
                <Avatar initials={initialsOf(user.name)} size={30} />
                <div className="flex min-w-0 flex-1 flex-col leading-[1.2]">
                  <span className="truncate text-[13px] font-semibold text-ink">{user.name}</span>
                  <span className="truncate text-[12px] text-muted">{user.email}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleEnroll(user.id)}
                  disabled={busyId === user.id}
                  className="inline-flex items-center gap-1 rounded-lg border border-line bg-white px-2.5 py-1.5 font-display text-[12px] font-bold text-ink transition-colors hover:border-ink disabled:opacity-50"
                >
                  <PlusIcon size={12} /> Enroll
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Enrolled list */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="font-display text-[12.5px] font-bold text-ink-2">
            Enrolled students
          </span>
          <span className="text-[12px] text-muted">{batch.enrolled_students.length} total</span>
        </div>

        {batch.enrolled_students.length === 0 ? (
          <div className="flex flex-col items-center gap-1.5 rounded-xl border border-dashed border-line-2 py-8 text-center">
            <span className="text-muted-2">
              <UsersIcon size={24} />
            </span>
            <p className="text-[13px] text-muted">No students enrolled yet.</p>
          </div>
        ) : (
          <ul className="flex flex-col divide-y divide-line rounded-xl border border-line">
            {batch.enrolled_students.map((student) => (
              <li key={student.id} className="flex items-center gap-3 px-3 py-2.5">
                <Avatar initials={initialsOf(student.name)} size={30} />
                <div className="flex min-w-0 flex-1 flex-col leading-[1.2]">
                  <span className="truncate text-[13px] font-semibold text-ink">
                    {student.name}
                  </span>
                  <span className="truncate text-[12px] text-muted">{student.email}</span>
                </div>
                <button
                  type="button"
                  title="Remove from batch"
                  onClick={() => handleUnenroll(student.id, student.name)}
                  disabled={busyId === student.id}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-white text-muted transition-colors hover:border-[var(--red)] hover:text-[var(--red)] disabled:opacity-50"
                >
                  <TrashIcon size={13} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
