import type { Metadata } from 'next';
import { SettingsPage } from '@/components/pages/SettingsPage';

export const metadata: Metadata = {
  title: 'Settings · BDA Admin',
  description: 'Global platform settings: maintenance window and marquee banner.',
};

export default function Page() {
  return <SettingsPage />;
}
