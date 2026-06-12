import type { Metadata } from 'next';
import { PayoutsPage } from '@/components/pages/PayoutsPage';

export const metadata: Metadata = {
  title: 'Payouts · BDA Admin',
  description: 'Teacher payouts and the 70/30 revenue split across periods.',
};

export default function Page() {
  return <PayoutsPage />;
}
