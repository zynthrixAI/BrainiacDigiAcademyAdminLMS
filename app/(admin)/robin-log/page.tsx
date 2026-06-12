import type { Metadata } from 'next';
import { RobinLogPage } from '@/components/pages/RobinLogPage';

export const metadata: Metadata = {
  title: 'Robin queries · BDA Admin',
  description: 'Platform-wide log of Robin AI tutor queries.',
};

export default function Page() {
  return <RobinLogPage />;
}
