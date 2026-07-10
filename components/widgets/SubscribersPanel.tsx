'use client';

import { useEffect, useState } from 'react';
import { useSubscriptions } from '@/hooks/query/useSubscriptions';
import { useSubscriptionMutations } from '@/hooks/mutation/useSubscriptionMutations';
import { useConfirm } from '@/hooks/useConfirm';
import { apiErrorMessage } from '@/lib/utils/api-error';
import { SubscriptionsTable } from '@/components/widgets/SubscriptionsTable';
import { GrantSubscriptionModal } from '@/components/widgets/GrantSubscriptionModal';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { PlusIcon } from '@/components/icons/PlusIcon';
import { SearchIcon } from '@/components/icons/SearchIcon';
import type { AdminSubscription, SubscriptionStatus } from '@/types/subscription';

const PAGE_SIZE = 10;

type StatusTab = 'all' | SubscriptionStatus;

const TAB_ORDER: StatusTab[] = ['all', 'active', 'expired', 'pending'];
const TAB_LABEL: Record<StatusTab, string> = {
  all: 'All',
  active: 'Active',
  expired: 'Expired',
  pending: 'Pending',
};

interface SubscribersPanelProps {
  /** Superadmin only — Grant and Activate are hidden when false. */
  canManage: boolean;
}

/** Subscribers tab: status tabs, search, table, activate + grant actions. */
export function SubscribersPanel({ canManage }: SubscribersPanelProps) {
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<StatusTab>('all');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [grantOpen, setGrantOpen] = useState(false);
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

  const { data, isLoading, isError } = useSubscriptions({
    page,
    limit: PAGE_SIZE,
    status: tab === 'all' ? undefined : tab,
    search: search || undefined,
  });

  const { activate } = useSubscriptionMutations();
  const confirm = useConfirm();

  const handleActivate = async (subscription: AdminSubscription) => {
    const ok = await confirm({
      title: `Activate subscription for ${subscription.user_name}?`,
      message:
        'This restarts the full plan interval from now (not from where it left off) and emails the student.',
      confirmLabel: 'Activate',
    });
    if (!ok) return;
    setActionError(null);
    setBusyId(subscription.id);
    activate.mutate(subscription.id, {
      onError: (error) =>
        setActionError(apiErrorMessage(error, 'Couldn’t activate that subscription.')),
      onSettled: () => setBusyId(null),
    });
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Tabs
            options={TAB_ORDER.map((key) => TAB_LABEL[key])}
            value={TAB_LABEL[tab]}
            onChange={(label) => {
              const next = TAB_ORDER.find((key) => TAB_LABEL[key] === label);
              if (next) {
                setTab(next);
                setPage(1);
              }
            }}
          />
          <label className="flex w-full max-w-xs items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-2 text-muted focus-within:border-yellow">
            <SearchIcon size={15} />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by student name or email…"
              className="w-full min-w-0 border-0 bg-transparent text-sm text-ink outline-none placeholder:text-muted-2"
            />
          </label>
        </div>
        {canManage && (
          <Button onClick={() => setGrantOpen(true)}>
            <PlusIcon size={14} /> Grant subscription
          </Button>
        )}
      </div>

      {isError && (
        <p className="mb-3 text-[13px] font-medium text-[var(--red)]">
          Couldn’t load subscriptions. Check your connection and try again.
        </p>
      )}
      {actionError && (
        <p className="mb-3 text-[13px] font-medium text-[var(--red)]">{actionError}</p>
      )}

      <SubscriptionsTable
        subscriptions={data?.items ?? []}
        isLoading={isLoading}
        canManage={canManage}
        page={page}
        pages={data?.pages ?? 1}
        total={data?.total ?? 0}
        limit={PAGE_SIZE}
        busyId={busyId}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(data?.pages ?? 1, p + 1))}
        onActivate={handleActivate}
      />

      <GrantSubscriptionModal open={grantOpen} onClose={() => setGrantOpen(false)} />
    </div>
  );
}
