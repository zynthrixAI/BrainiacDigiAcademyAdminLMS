import type { Metadata } from 'next';
import { CoursesPage } from '@/components/pages/CoursesPage';

export const metadata: Metadata = {
  title: 'Courses · BDA Admin',
  description: 'Manage the course catalogue in the BDA admin portal.',
};

export default function Page() {
  return <CoursesPage />;
}
