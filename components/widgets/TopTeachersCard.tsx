import type { TopTeacher } from '@/types/dashboard';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';

interface TopTeachersCardProps {
  teachers: TopTeacher[];
}

/** Initials from the last two name parts, matching the design. */
const initialsOf = (name: string): string => {
  const parts = name.split(' ');
  const last = parts[parts.length - 1]?.[0] ?? '';
  const secondLast = parts[parts.length - 2]?.[0] ?? '';
  return `${last}${secondLast}`;
};

export function TopTeachersCard({ teachers }: TopTeachersCardProps) {
  return (
    <Card>
      <h3 className="font-display text-[15px] font-bold text-ink">Top teachers — Apr</h3>
      <span className="text-[13px] text-muted">By generated revenue</span>

      <div className="mt-4 flex flex-col gap-3">
        {teachers.map((teacher, i) => (
          <div
            key={teacher.name}
            className={`flex items-center gap-3 ${
              i ? 'border-t border-dashed border-line-2 pt-2.5' : ''
            }`}
          >
            <Avatar initials={initialsOf(teacher.name)} size={34} />
            <div className="flex min-w-0 flex-1 flex-col leading-[1.2]">
              <span className="text-[13px] font-bold text-ink">{teacher.name}</span>
              <span className="text-[13px] text-muted">
                {teacher.students} students · {teacher.viewership}% viewership
              </span>
            </div>
            <span className="font-display text-sm font-extrabold text-ink">
              {teacher.revenue}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
