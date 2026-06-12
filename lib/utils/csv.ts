import type { Lead } from '@/types/lead';

const escapeCell = (value: string): string =>
  /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;

const COLUMNS: { header: string; pick: (lead: Lead) => string }[] = [
  { header: 'Name', pick: (l) => l.name },
  { header: 'Email', pick: (l) => l.email },
  { header: 'Phone', pick: (l) => l.phone },
  { header: 'Level', pick: (l) => l.level ?? '' },
  { header: 'Status', pick: (l) => l.status },
  { header: 'Source', pick: (l) => l.source },
  { header: 'Parent', pick: (l) => l.parent?.name ?? '' },
  { header: 'Country', pick: (l) => l.country ?? '' },
  { header: 'Goal', pick: (l) => l.goal ?? '' },
  { header: 'Created', pick: (l) => l.created_at },
];

/** Build a CSV string from a header row and aligned primitive rows. */
export const rowsToCsv = (
  headers: string[],
  rows: (string | number)[][],
): string =>
  [headers, ...rows].map((row) => row.map((c) => escapeCell(String(c ?? ''))).join(',')).join('\n');

/** Build a CSV string from a set of leads. */
export const leadsToCsv = (leads: Lead[]): string => {
  const head = COLUMNS.map((c) => c.header).join(',');
  const rows = leads.map((lead) =>
    COLUMNS.map((c) => escapeCell(c.pick(lead))).join(','),
  );
  return [head, ...rows].join('\n');
};

/** Trigger a client-side download of the given text as a file. */
export const downloadCsv = (filename: string, csv: string): void => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
