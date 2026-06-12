import type { TeacherPerformance } from '@/types/analytics';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Avatar } from '@/components/ui/Avatar';

interface TeacherPerformanceCardProps {
  teachers: TeacherPerformance[];
}

const COLUMNS = [
  'Rank',
  'Teacher',
  'Subject',
  'Students',
  'Viewership',
  'Attendance',
  'Avg turnaround',
  'Revenue',
  'Score',
];

/** Tinted score pill — green ≥90, yellow ≥80, red below. */
const scorePill = (score: number): string => {
  if (score >= 90) return 'bg-[#ecfdf5] text-[var(--green)]';
  if (score >= 80) return 'bg-[var(--yellow-soft)] text-[var(--yellow-ink)]';
  return 'bg-[#fef2f2] text-[var(--red)]';
};

export function TeacherPerformanceCard({ teachers }: TeacherPerformanceCardProps) {
  return (
    <Card className="!p-0">
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 pb-4 pt-5">
        <h3 className="font-display text-[15px] font-bold text-ink">
          Teacher performance — Apr 2026
        </h3>
        <span className="text-[13px] text-muted">
          Ranked by composite score (viewership × attendance × turnaround)
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col}
                  className="border-y border-line bg-[#faf9f7] px-4 py-3 text-[10.5px] font-bold uppercase tracking-[0.08em] text-muted"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher, i) => (
              <tr key={teacher.id} className="align-middle">
                <td className="border-b border-line px-4 py-3.5">
                  <span className="font-display text-base font-extrabold text-ink">
                    #{i + 1}
                  </span>
                </td>
                <td className="border-b border-line px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar initials={teacher.initials} size={30} />
                    <span className="text-[13px] font-semibold text-ink">{teacher.name}</span>
                  </div>
                </td>
                <td className="border-b border-line px-4 py-3.5">
                  <span className="text-[13px] text-ink">{teacher.subject}</span>
                </td>
                <td className="border-b border-line px-4 py-3.5">
                  <span className="text-[13px] text-ink">{teacher.students}</span>
                </td>
                <td className="border-b border-line px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-[50px] overflow-hidden rounded-full bg-[#f0eeea]">
                      <span
                        className="block h-full rounded-full bg-yellow"
                        style={{ width: `${teacher.viewership}%` }}
                      />
                    </div>
                    <span className="text-[13px] font-bold text-ink">{teacher.viewership}%</span>
                  </div>
                </td>
                <td className="border-b border-line px-4 py-3.5">
                  <span className="text-[13px] font-bold text-ink">{teacher.attendance}%</span>
                </td>
                <td className="border-b border-line px-4 py-3.5">
                  <span className="whitespace-nowrap text-[13px] text-muted">
                    {teacher.turnaround}
                  </span>
                </td>
                <td className="border-b border-line px-4 py-3.5">
                  <span className="whitespace-nowrap font-display text-[13px] font-semibold text-ink">
                    {teacher.revenue}
                  </span>
                </td>
                <td className="border-b border-line px-4 py-3.5">
                  <Pill className={scorePill(teacher.score)}>{teacher.score}</Pill>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
