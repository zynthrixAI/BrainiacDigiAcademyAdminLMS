import type { Metadata } from 'next';
import { SubscriptionsPage } from '@/components/pages/SubscriptionsPage';

export const metadata: Metadata = {
  title: 'Subscriptions · BDA Admin',
  description: 'Billing, plans, and renewals across the platform.',
};

export default function Page() {
  return <SubscriptionsPage />;
}
