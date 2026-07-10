/** Up to two uppercased initials from a person's name. */
export const initialsOf = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .map((part) => part[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase();

/** Map a teacher level code to its user-facing label. */
export const teacherLevelLabel = (level: 'O' | 'A'): string =>
  level === 'A' ? 'A Level' : 'O Level';

/** ISO datetime → yyyy-mm-dd for a native date input. Empty string when absent. */
export const toDateInputValue = (iso: string | null): string => {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
};

/** Seconds → "m:ss" (or "h:mm:ss" past an hour). */
export const formatDuration = (seconds: number): string => {
  if (!seconds || seconds < 0) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
};

/** Price in PKR, or "Free" when zero. */
export const formatPrice = (price: number): string =>
  price > 0 ? `PKR ${price.toLocaleString('en-US')}` : 'Free';

/** Whole-PKR amount, e.g. "Rs. 1,500". */
export const formatPkr = (amount: number): string =>
  `Rs. ${Math.round(amount).toLocaleString('en-US')}`;

/** Billing-interval label: monthly/quarterly/yearly → 1 Month / 3 Months / 1 Year. */
export const intervalLabel = (interval: 'monthly' | 'quarterly' | 'yearly'): string =>
  ({ monthly: '1 Month', quarterly: '3 Months', yearly: '1 Year' })[interval];

/** Format an ISO date as e.g. "5 Sep 2024". Returns "—" when invalid. */
export const formatDate = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/** Format an ISO datetime as e.g. "5 Sep 2024, 14:30". Returns "—" when invalid. */
export const formatDateTime = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
