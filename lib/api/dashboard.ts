import type { DashboardData } from '@/types/dashboard';
import { CardIcon } from '@/components/icons/CardIcon';
import { UserIcon } from '@/components/icons/UserIcon';
import { TrophyIcon } from '@/components/icons/TrophyIcon';
import { BoltIcon } from '@/components/icons/BoltIcon';
import { CalendarIcon } from '@/components/icons/CalendarIcon';

/**
 * Dashboard snapshot. Returns mock data shaped exactly as the UI consumes it —
 * swap the body for an axios `api.get('/admins/dashboard')` call once the
 * backend endpoint exists; the return type stays the same.
 */
export const getDashboard = async (): Promise<DashboardData> => {
  return {
    dateLabel: 'Mon 18 May, 2026 · Live snapshot of the platform',
    kpis: [
      {
        label: 'MRR',
        value: 'Rs. 515,000',
        delta: '6.8%',
        deltaPositive: true,
        sub: 'vs Apr Rs. 482k',
        icon: CardIcon,
        accent: '#1f8a5b',
      },
      {
        label: 'Active students',
        value: '342',
        delta: '44 new',
        deltaPositive: true,
        sub: 'this month',
        icon: UserIcon,
        accent: '#2a6fdb',
      },
      {
        label: 'Renewal rate',
        value: '91%',
        delta: '3.2%',
        deltaPositive: true,
        sub: 'rolling 30 days',
        icon: TrophyIcon,
        accent: '#f9c323',
      },
      {
        label: 'Trial → paid',
        value: '58%',
        delta: '5%',
        deltaPositive: true,
        sub: '14-day trials',
        icon: BoltIcon,
        accent: '#7e57c2',
      },
      {
        label: 'Live classes today',
        value: '6',
        delta: null,
        deltaPositive: false,
        sub: '1 live now · 4 scheduled',
        icon: CalendarIcon,
        accent: '#ea580c',
      },
      {
        label: 'Pending payouts',
        value: 'Rs. 441k',
        delta: null,
        deltaPositive: false,
        sub: '4 teachers · Apr period',
        icon: CardIcon,
        accent: '#e23b3b',
      },
    ],
    revenueTrend: [
      { month: 'Nov', mrr: 320 },
      { month: 'Dec', mrr: 340 },
      { month: 'Jan', mrr: 380 },
      { month: 'Feb', mrr: 410 },
      { month: 'Mar', mrr: 445 },
      { month: 'Apr', mrr: 482 },
      { month: 'May', mrr: 515 },
    ],
    mrrSummary: {
      arrProjection: 'Rs. 6.18M',
      netNew: '+39',
      churned: '5',
      levelSplit: '68% / 32%',
    },
    actionQueue: [
      {
        id: 'aq1',
        title: '3 subjects awaiting approval',
        description: 'Submitted by 3 teachers',
        action: 'Review',
        href: '/approvals',
        urgent: true,
      },
      {
        id: 'aq2',
        title: '2 recordings need edits',
        description: 'Aldol Walkthrough · AD Curve',
        action: 'Open queue',
        href: '/batches',
        urgent: true,
      },
      {
        id: 'aq3',
        title: 'Apr payouts ready',
        description: 'Rs. 441k across 4 teachers',
        action: 'Process',
        href: '/payouts',
        urgent: false,
      },
      {
        id: 'aq4',
        title: '4 students in grace period',
        description: 'Subscriptions ending in 48h',
        action: 'Review',
        href: '/subscriptions',
        urgent: false,
      },
      {
        id: 'aq5',
        title: '3 Robin queries flagged',
        description: 'Need teacher attention',
        action: 'Open log',
        href: '/robin-log',
        urgent: false,
      },
    ],
    topTeachers: [
      { name: 'Mr. Bilal Raza', revenue: 'Rs. 184k', students: 32, viewership: 95 },
      { name: 'Dr. Sana Khalid', revenue: 'Rs. 156k', students: 28, viewership: 92 },
      { name: 'Mr. Imran Ahmed', revenue: 'Rs. 142k', students: 26, viewership: 87 },
      { name: 'Ms. Hira Saeed', revenue: 'Rs. 84k', students: 18, viewership: 78 },
    ],
    recentEnrolments: [
      { id: 'l5', name: 'Bilal Raza Jr.', level: 'O Level', created: '1 week ago', stage: 'enrolled' },
      { id: 'l6', name: 'Saad Akhtar', level: 'A Level', created: '1 week ago', stage: 'enrolled' },
      { id: 'l7', name: 'Mariam Tariq', level: 'A Level', created: 'Mar 2026', stage: 'active' },
      { id: 'l8', name: 'Hamza Latif', level: 'A Level', created: 'Feb 2026', stage: 'active' },
    ],
    todaysClasses: [
      {
        id: 'lc1',
        title: 'Kinematics & SHM Recap',
        teacher: 'Mr. Imran Ahmed',
        batch: 'A2-B',
        subjectCode: 'PHYS',
        subjectColor: '#1d4ed8',
        time: '11:30 AM',
        live: true,
      },
      {
        id: 'lc2',
        title: 'Vectors in 3D — Worked Past Papers',
        teacher: 'Mr. Bilal Raza',
        batch: 'A2-A',
        subjectCode: 'MATH',
        subjectColor: '#6d28d9',
        time: '1:00 PM',
        live: false,
      },
      {
        id: 'lc3',
        title: 'Reaction Mechanisms Q&A',
        teacher: 'Dr. Sana Khalid',
        batch: 'A2-B',
        subjectCode: 'CHEM',
        subjectColor: '#047857',
        time: 'Tue 10:00 AM',
        live: false,
      },
      {
        id: 'lc4',
        title: 'DNA Replication: Lagging Strand',
        teacher: 'Ms. Hira Saeed',
        batch: 'A2-A',
        subjectCode: 'BIO',
        subjectColor: '#b45309',
        time: 'Wed 4:00 PM',
        live: false,
      },
    ],
  };
};
