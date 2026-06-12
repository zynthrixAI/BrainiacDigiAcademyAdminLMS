import type { Metadata } from 'next';
import { BatchDetailPage } from '@/components/pages/BatchDetailPage';

export const metadata: Metadata = {
  title: 'Batch · BDA Admin',
  description: 'Manage a batch — enrolments, live classes, and recordings.',
};

export default async function Page({ params }: { params: Promise<{ batchId: string }> }) {
  const { batchId } = await params;
  return <BatchDetailPage batchId={batchId} />;
}
