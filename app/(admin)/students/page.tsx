import type { Metadata } from 'next';
import { StudentsPage } from '@/components/pages/StudentsPage';

export const metadata: Metadata = {
  title: 'Students · BDA Admin',
  description: 'Manage student accounts in the BDA admin portal.',
};

export default function Page() {
  return <StudentsPage />;
}
