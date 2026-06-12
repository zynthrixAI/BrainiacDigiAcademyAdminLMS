import type { Metadata } from 'next';
import { CourseDetailPage } from '@/components/pages/CourseDetailPage';

export const metadata: Metadata = {
  title: 'Course · BDA Admin',
  description: 'Manage a course and its content tree.',
};

export default async function Page({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  return <CourseDetailPage courseId={courseId} />;
}
