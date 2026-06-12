import type { Metadata } from 'next';
import { AnalyticsPage } from '@/components/pages/AnalyticsPage';

export const metadata: Metadata = {
  title: 'Analytics · BDA Admin',
  description: 'Revenue, students, and teacher performance across the platform.',
};

export default function Page() {
  return <AnalyticsPage />;
}
