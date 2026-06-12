import type { Metadata } from 'next';
import { TeachersPage } from '@/components/pages/TeachersPage';

export const metadata: Metadata = {
  title: 'Teachers · BDA Admin',
  description: 'Manage teacher accounts in the BDA admin portal.',
};

export default function Page() {
  return <TeachersPage />;
}
