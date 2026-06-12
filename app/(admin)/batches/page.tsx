import { Suspense } from 'react';
import type { Metadata } from 'next';
import { BatchesPage } from '@/components/pages/BatchesPage';

export const metadata: Metadata = {
  title: 'Batches · BDA Admin',
  description: 'Manage student cohorts and enrolments in the BDA admin portal.',
};

export default function Page() {
  // BatchesPage reads ?subject= via useSearchParams, which needs a Suspense boundary.
  return (
    <Suspense fallback={null}>
      <BatchesPage />
    </Suspense>
  );
}
