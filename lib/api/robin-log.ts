import type { RobinQueriesData } from '@/types/robin-query';

/**
 * Platform-wide Robin (AI tutor) query log. Returns mock data shaped exactly
 * as the UI consumes it — swap the body for
 * `api.get('/admins/robin/queries')` once the backend endpoint exists; the
 * signature and return type stay the same. Filtering by flag/subject/search
 * happens client-side against `items`.
 */
export const getRobinQueries = async (): Promise<RobinQueriesData> => {
  return {
    kpis: [
      { label: 'Queries today', value: '182', note: 'from 64 students' },
      { label: 'Avg response time', value: '1.4s', note: 'OpenAI GPT-4o' },
      { label: 'Escalated', value: '8', note: 'this week' },
      { label: 'Rate-limited', value: '3', note: 'students' },
    ],
    items: [
      { id: 'rq1', student: 'Aaliya Hassan', subject: 'Mathematics', query: 'Why does implicit differentiation give different signs sometimes?', flagged: true, teacher: 'Mr. Bilal Raza', time: '23 min ago' },
      { id: 'rq2', student: 'Hassan Ali', subject: 'Physics', query: "Robin said v = u + at applies to SHM but that doesn't seem right?", flagged: true, teacher: 'Mr. Imran Ahmed', time: '1 hour ago' },
      { id: 'rq3', student: 'Daniyal Rauf', subject: 'Chemistry', query: 'Sn1 vs Sn2 — when do I use polar protic vs polar aprotic?', flagged: false, teacher: 'Dr. Sana Khalid', time: '2 hours ago' },
      { id: 'rq4', student: 'Maryam Khan', subject: 'Computer Science', query: "Robin's Dijkstra example doesn't handle negative edges — is that intentional?", flagged: true, teacher: 'Mr. Faraz Ali', time: '4 hours ago' },
      { id: 'rq5', student: 'Zara Ahmed', subject: 'Biology', query: "What's the actual mechanism of helicase?", flagged: false, teacher: 'Ms. Hira Saeed', time: 'Yesterday' },
    ],
  };
};
