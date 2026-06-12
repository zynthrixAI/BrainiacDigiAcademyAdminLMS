import type { Metadata } from 'next';
import { AdminsPage } from '@/components/pages/AdminsPage';

export const metadata: Metadata = {
  title: 'Admins · BDA Admin',
  description: 'Manage admin accounts (superadmin only).',
};

export default function Page() {
  return <AdminsPage />;
}
