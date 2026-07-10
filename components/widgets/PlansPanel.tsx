'use client';

import { useEffect, useState } from 'react';
import { usePlans } from '@/hooks/query/usePlans';
import { usePlanMutations } from '@/hooks/mutation/usePlanMutations';
import { useConfirm } from '@/hooks/useConfirm';
import { apiErrorMessage } from '@/lib/utils/api-error';
import { PlansTable } from '@/components/widgets/PlansTable';
import { PlanFormModal } from '@/components/widgets/PlanFormModal';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { PlusIcon } from '@/components/icons/PlusIcon';
import { SearchIcon } from '@/components/icons/SearchIcon';
import type { PlanStatus, SubscriptionPlan } from '@/types/subscription';

const PAGE_SIZE = 10;

const STATUS_OPTIONS = [
  { label: 'All statuses', value: '' },
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
];

interface PlansPanelProps {
  /** Superadmin only — write actions are hidden when false. */
  canManage: boolean;
}

/** Subscription-plans tab: search, status filter, table, create/edit/publish/delete. */
export function PlansPanel({ canManage }: PlansPanelProps) {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<SubscriptionPlan | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Debounce the search box and reset to the first page on a new term.
  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(id);
  }, [searchInput]);

  const { data, isLoading, isError } = usePlans({
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    status: (status || undefined) as PlanStatus | undefined,
  });

  const { publish, remove } = usePlanMutations();
  const confirm = useConfirm();

  const handlePublish = async (plan: SubscriptionPlan) => {
    const ok = await confirm({
      title: `Publish ${plan.name}?`,
      message:
        'Publishing makes this plan visible to students and it can never be deleted afterwards.',
      confirmLabel: 'Publish plan',
    });
    if (!ok) return;
    setActionError(null);
    setBusyId(plan.id);
    publish.mutate(plan.id, {
      onError: (error) =>
        setActionError(apiErrorMessage(error, 'Couldn’t publish that plan.')),
      onSettled: () => setBusyId(null),
    });
  };

  const handleDelete = async (plan: SubscriptionPlan) => {
    const ok = await confirm({
      title: `Delete ${plan.name}?`,
      message: 'This permanently deletes the draft plan.',
      confirmLabel: 'Delete plan',
      tone: 'danger',
    });
    if (!ok) return;
    setActionError(null);
    setBusyId(plan.id);
    remove.mutate(plan.id, {
      onError: (error) =>
        setActionError(apiErrorMessage(error, 'Couldn’t delete that plan.')),
      onSettled: () => setBusyId(null),
    });
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex w-full max-w-xs items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-2 text-muted focus-within:border-yellow">
            <SearchIcon size={15} />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search plans by name…"
              className="w-full min-w-0 border-0 bg-transparent text-sm text-ink outline-none placeholder:text-muted-2"
            />
          </label>
          <div className="w-[160px]">
            <Select
              options={STATUS_OPTIONS}
              value={status}
              onChange={(next) => {
                setStatus(next);
                setPage(1);
              }}
            />
          </div>
        </div>
        {canManage && (
          <Button onClick={() => setCreateOpen(true)}>
            <PlusIcon size={14} /> New plan
          </Button>
        )}
      </div>

      {isError && (
        <p className="mb-3 text-[13px] font-medium text-[var(--red)]">
          Couldn’t load plans. Check your connection and try again.
        </p>
      )}
      {actionError && (
        <p className="mb-3 text-[13px] font-medium text-[var(--red)]">{actionError}</p>
      )}

      <PlansTable
        plans={data?.items ?? []}
        isLoading={isLoading}
        canManage={canManage}
        page={page}
        pages={data?.pages ?? 1}
        total={data?.total ?? 0}
        limit={PAGE_SIZE}
        busyId={busyId}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(data?.pages ?? 1, p + 1))}
        onEdit={setEditing}
        onPublish={handlePublish}
        onDelete={handleDelete}
      />

      <PlanFormModal open={createOpen} onClose={() => setCreateOpen(false)} />
      {editing && <PlanFormModal open plan={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
