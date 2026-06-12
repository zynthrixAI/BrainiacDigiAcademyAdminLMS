'use client';

import { useState } from 'react';
import { useLeads } from '@/hooks/query/useLeads';
import { useDeleteLead } from '@/hooks/mutation/useDeleteLead';
import { useConfirm } from '@/hooks/useConfirm';
import { LeadStageCards } from '@/components/widgets/LeadStageCards';
import { LeadsTable } from '@/components/widgets/LeadsTable';
import { LeadDetailModal } from '@/components/widgets/LeadDetailModal';
import { LeadCreateModal } from '@/components/widgets/LeadCreateModal';
import { Button } from '@/components/ui/Button';
import { PlusIcon } from '@/components/icons/PlusIcon';
import { DownIcon } from '@/components/icons/DownIcon';
import { leadsToCsv, downloadCsv } from '@/lib/utils/csv';
import type { Lead, LeadStatusFilter } from '@/types/lead';

const PAGE_SIZE = 10;

/** Admin leads / CRM — pipeline KPIs, stage filter, create, enroll, edit, delete. */
export function LeadsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<LeadStatusFilter>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading, isError } = useLeads({
    page,
    page_size: PAGE_SIZE,
    status: status === 'all' ? undefined : status,
  });

  const { mutate: removeLead, error: deleteError } = useDeleteLead();
  const confirm = useConfirm();

  const handleStatusChange = (next: LeadStatusFilter) => {
    setStatus(next);
    setPage(1);
  };

  const openView = (lead: Lead) => {
    setSelectedId(lead.id);
    setModalMode('view');
  };

  const openEdit = (lead: Lead) => {
    setSelectedId(lead.id);
    setModalMode('edit');
  };

  const handleDelete = async (lead: Lead) => {
    const ok = await confirm({
      title: `Delete ${lead.name}?`,
      message: 'This permanently removes the lead — there is no undo.',
      confirmLabel: 'Delete lead',
      tone: 'danger',
    });
    if (!ok) return;
    setDeletingId(lead.id);
    removeLead(lead.id, { onSettled: () => setDeletingId(null) });
  };

  const handleExport = () => {
    const leads = data?.results ?? [];
    if (leads.length === 0) return;
    downloadCsv(`leads-page-${page}.csv`, leadsToCsv(leads));
  };

  const analytics = data?.analytics;
  const total = data?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col">
          <h1 className="font-display text-[26px] font-extrabold text-ink">Leads &amp; CRM</h1>
          <span className="mt-2 text-[13px] text-muted">
            {analytics?.total ?? 0} leads in pipeline · {analytics?.lead ?? 0} awaiting outreach
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={handleExport} disabled={(data?.results.length ?? 0) === 0}>
            <DownIcon size={13} /> Export CSV
          </Button>
          <Button onClick={() => setCreateOpen(true)}>
            <PlusIcon size={14} /> Add lead
          </Button>
        </div>
      </div>

      <div className="mb-5">
        <LeadStageCards analytics={analytics} active={status} onSelect={handleStatusChange} />
      </div>

      {isError && (
        <p className="mb-3 text-[13px] font-medium text-[var(--red)]">
          Couldn’t load leads. Check your connection and try again.
        </p>
      )}
      {deleteError && (
        <p className="mb-3 text-[13px] font-medium text-[var(--red)]">
          Couldn’t delete that lead. Please try again.
        </p>
      )}

      <LeadsTable
        leads={data?.results ?? []}
        isLoading={isLoading}
        page={page}
        pages={pages}
        total={total}
        limit={PAGE_SIZE}
        deletingId={deletingId}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(pages, p + 1))}
        onView={openView}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <LeadDetailModal
        leadId={selectedId}
        mode={modalMode}
        onModeChange={setModalMode}
        onClose={() => setSelectedId(null)}
      />

      <LeadCreateModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}
