'use client';

import { useEffect, useState } from 'react';
import { useTransactions } from '@/hooks/query/useTransactions';
import { TransactionsTable } from '@/components/widgets/TransactionsTable';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { SearchIcon } from '@/components/icons/SearchIcon';
import type { TransactionPurpose, TransactionStatus } from '@/types/subscription';

const PAGE_SIZE = 10;

const STATUS_OPTIONS = [
  { label: 'All statuses', value: '' },
  { label: 'Paid', value: 'paid' },
  { label: 'Pending', value: 'pending' },
  { label: 'Failed', value: 'failed' },
];

const PURPOSE_OPTIONS = [
  { label: 'All purposes', value: '' },
  { label: 'Subscription', value: 'subscription' },
  { label: 'Course', value: 'course' },
  { label: 'Batch', value: 'batch' },
];

/** Transactions tab: status/purpose filters, ID-friendly search, failed-payments
 *  preset, and a table whose failed rows expand to PayFast error details. */
export function TransactionsPanel() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [purpose, setPurpose] = useState('');

  // Debounce the search box and reset to the first page on a new term.
  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(id);
  }, [searchInput]);

  const { data, isLoading, isError } = useTransactions({
    page,
    limit: PAGE_SIZE,
    status: (status || undefined) as TransactionStatus | undefined,
    purpose: (purpose || undefined) as TransactionPurpose | undefined,
    search: search || undefined,
  });

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <label className="flex w-full max-w-sm items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-2 text-muted focus-within:border-yellow">
          <SearchIcon size={15} />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search name, email, basket or PayFast ID…"
            className="w-full min-w-0 border-0 bg-transparent text-sm text-ink outline-none placeholder:text-muted-2"
          />
        </label>
        <div className="w-[150px]">
          <Select
            options={STATUS_OPTIONS}
            value={status}
            onChange={(next) => {
              setStatus(next);
              setPage(1);
            }}
          />
        </div>
        <div className="w-[160px]">
          <Select
            options={PURPOSE_OPTIONS}
            value={purpose}
            onChange={(next) => {
              setPurpose(next);
              setPage(1);
            }}
          />
        </div>
        <Button
          variant={status === 'failed' ? 'primary' : 'ghost'}
          onClick={() => {
            setStatus(status === 'failed' ? '' : 'failed');
            setPage(1);
          }}
          className="px-3 py-2 text-xs"
        >
          Failed payments
        </Button>
      </div>

      {isError && (
        <p className="mb-3 text-[13px] font-medium text-[var(--red)]">
          Couldn’t load transactions. Check your connection and try again.
        </p>
      )}

      <TransactionsTable
        transactions={data?.items ?? []}
        isLoading={isLoading}
        page={page}
        pages={data?.pages ?? 1}
        total={data?.total ?? 0}
        limit={PAGE_SIZE}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(data?.pages ?? 1, p + 1))}
      />
    </div>
  );
}
