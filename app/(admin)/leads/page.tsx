import type { Metadata } from 'next';
import { LeadsPage } from '@/components/pages/LeadsPage';

export const metadata: Metadata = {
  title: 'Leads · BDA Admin',
  description: 'Manage admission leads and CRM in the BDA admin portal.',
};

export default function Page() {
  return <LeadsPage />;
}
