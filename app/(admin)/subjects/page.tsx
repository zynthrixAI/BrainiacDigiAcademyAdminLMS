import type { Metadata } from 'next';
import { SubjectsPage } from '@/components/pages/SubjectsPage';

export const metadata: Metadata = {
  title: 'Subjects · BDA Admin',
  description: 'Manage the top-level subject catalogue in the BDA admin portal.',
};

export default function Page() {
  return <SubjectsPage />;
}
