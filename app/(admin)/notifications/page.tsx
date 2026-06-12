import type { Metadata } from 'next';
import { NotificationsPage } from '@/components/pages/NotificationsPage';

export const metadata: Metadata = {
  title: 'Notifications · BDA Admin',
  description: 'Send announcements to all users, a batch, or a single student.',
};

export default function Page() {
  return <NotificationsPage />;
}
