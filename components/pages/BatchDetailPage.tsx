'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useBatch } from '@/hooks/query/useBatch';
import { Tabs } from '@/components/ui/Tabs';
import { Pill } from '@/components/ui/Pill';
import { BatchEnrollPanel } from '@/components/widgets/BatchEnrollPanel';
import { BatchLiveClasses } from '@/components/widgets/BatchLiveClasses';
import { BatchRecordings } from '@/components/widgets/BatchRecordings';
import { formatPrice } from '@/lib/utils/format';

interface BatchDetailPageProps {
  batchId: string;
}

const TABS = ['Students', 'Live classes', 'Recordings'];

/** A single batch: enrolments, its live classes (read-only), and recordings. */
export function BatchDetailPage({ batchId }: BatchDetailPageProps) {
  const { data, isLoading, isError } = useBatch(batchId);
  const [tab, setTab] = useState(TABS[0]);

  const backHref = data ? `/batches?subject=${data.subject_id}` : '/batches';

  return (
    <div>
      <Link
        href={backHref}
        className="mb-4 inline-flex items-center gap-1 text-[13px] font-semibold text-muted transition-colors hover:text-ink"
      >
        ← Batches
      </Link>

      {isError && (
        <p className="text-[14px] text-[var(--red)]">
          Couldn’t load this batch. Please refresh and try again.
        </p>
      )}

      {!isError && (isLoading || !data) && (
        <p className="text-[14px] text-muted">Loading batch…</p>
      )}

      {!isError && data && (
        <>
          <div className="mb-5 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-[26px] font-extrabold text-ink">{data.name}</h1>
              {data.is_published ? (
                <Pill className="bg-[#ecfdf5] text-[var(--green)]">Published</Pill>
              ) : (
                <Pill className="bg-[#f5f5f4] text-muted">Draft</Pill>
              )}
            </div>
            <span className="text-[13px] text-muted">
              {data.subject_name} · {data.teacher_name || 'Unassigned'} ·{' '}
              {formatPrice(data.price)} · {data.enrolled_count}{' '}
              {data.enrolled_count === 1 ? 'student' : 'students'}
            </span>
          </div>

          <div className="mb-5 overflow-x-auto">
            <Tabs options={TABS} value={tab} onChange={setTab} />
          </div>

          {tab === 'Students' && <BatchEnrollPanel batch={data} />}
          {tab === 'Live classes' && <BatchLiveClasses batchId={data.id} />}
          {tab === 'Recordings' && <BatchRecordings batch={data} />}
        </>
      )}
    </div>
  );
}
