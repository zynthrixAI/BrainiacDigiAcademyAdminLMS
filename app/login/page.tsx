import type { Metadata } from 'next';
import { LoginPage } from '@/components/pages/LoginPage';

export const metadata: Metadata = {
  title: 'Admin sign in · BDA',
  description: 'Sign in to the BDA admin operations console.',
};

export default function Page() {
  return <LoginPage />;
}
