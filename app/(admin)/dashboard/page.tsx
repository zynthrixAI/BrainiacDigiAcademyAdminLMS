import type { Metadata } from 'next';
import { DashboardPage } from '@/components/pages/DashboardPage';

export const metadata: Metadata = {
  title: 'Dashboard · BDA Admin',
  description: 'Operations overview for the BDA admin portal.',
};

export default function Page() {
  return <DashboardPage />;
}
