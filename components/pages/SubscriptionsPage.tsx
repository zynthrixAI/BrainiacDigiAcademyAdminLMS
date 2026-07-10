'use client';

import { useState } from 'react';
import { useProfile } from '@/hooks/query/useProfile';
import { PlansPanel } from '@/components/widgets/PlansPanel';
import { SubscribersPanel } from '@/components/widgets/SubscribersPanel';
import { TransactionsPanel } from '@/components/widgets/TransactionsPanel';
import { Tabs } from '@/components/ui/Tabs';

type Section = 'Plans' | 'Subscribers' | 'Transactions';

const SECTIONS: Section[] = ['Plans', 'Subscribers', 'Transactions'];

/** Subscriptions admin: plans, student subscriptions, and payment
 *  transactions. Lists are visible to any admin; plan writes, grant, and
 *  activate are superadmin-only (their controls are hidden otherwise). */
export function SubscriptionsPage() {
  const { data: profile } = useProfile();
  const isSuperadmin = profile?.role === 'superadmin';
  const [section, setSection] = useState<Section>('Plans');

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col">
          <h1 className="font-display text-[26px] font-extrabold text-ink">Subscriptions</h1>
          <span className="mt-2 text-[13px] text-muted">
            Plans, subscribers, and PayFast transactions
          </span>
        </div>
        <Tabs
          options={SECTIONS}
          value={section}
          onChange={(next) => setSection(next as Section)}
        />
      </div>

      {section === 'Plans' && <PlansPanel canManage={isSuperadmin} />}
      {section === 'Subscribers' && <SubscribersPanel canManage={isSuperadmin} />}
      {section === 'Transactions' && <TransactionsPanel />}
    </div>
  );
}
