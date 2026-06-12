'use client';

import type { AttendanceStatus, LiveClass } from '@/types/live-class';
import { useLiveClassAttendance } from '@/hooks/query/useLiveClassAttendance';
import { Modal } from '@/components/ui/Modal';
import { Pill } from '@/components/ui/Pill';
import { formatDateTime } from '@/lib/utils/format';

interface LiveClassAttendanceModalProps {
  liveClass: LiveClass | null;
  onClose: () => void;
}

const STATUS_PILL: Record<AttendanceStatus, string> = {
  present: 'bg-[#ecfdf5] text-[var(--green)]',
  late: 'bg-[#fff7ed] text-[#c2680a]',
  absent: 'bg-[#fef2f2] text-[var(--red)]',
};

/** Read-only attendance report for one live class. */
export function LiveClassAttendanceModal({ liveClass, onClose }: LiveClassAttendanceModalProps) {
  const open = liveClass !== null;
  const { data, isLoading, isError } = useLiveClassAttendance(liveClass?.id ?? null);

  const summary: { label: string; value: number; className: string }[] = [
    { label: 'Present', value: data?.present ?? 0, className: 'text-[var(--green)]' },
    { label: 'Late', value: data?.late ?? 0, className: 'text-[#c2680a]' },
    { label: 'Absent', value: data?.absent ?? 0, className: 'text-[var(--red)]' },
    { label: 'Total', value: data?.total ?? 0, className: 'text-ink' },
  ];

  return (
    <Modal open={open} title="Attendance" onClose={onClose}>
      {liveClass && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-0.5 border-b border-line pb-3">
            <h3 className="font-display text-[15px] font-extrabold text-ink">{liveClass.title}</h3>
            <span className="text-[12.5px] text-muted">
              {formatDateTime(liveClass.scheduled_at)} · {liveClass.total_duration} min
            </span>
          </div>

          {isLoading && <p className="py-6 text-center text-sm text-muted">Loading attendance…</p>}
          {isError && (
            <p className="py-6 text-center text-sm text-[var(--red)]">
              Couldn’t load attendance for this class.
            </p>
          )}

          {data && (
            <>
              <div className="grid grid-cols-4 gap-2">
                {summary.map((s) => (
                  <div
                    key={s.label}
                    className="flex flex-col items-center rounded-xl border border-line bg-[#faf9f7] py-2.5"
                  >
                    <span className={`font-display text-[20px] font-extrabold ${s.className}`}>
                      {s.value}
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-muted">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              {data.records.length === 0 ? (
                <p className="py-4 text-center text-[13px] text-muted">
                  No attendance recorded yet. Records are back-filled once the class ends.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr>
                        {['Student', 'Joined', 'Status'].map((c) => (
                          <th
                            key={c}
                            className="border-b border-line px-2 py-2 text-[10.5px] font-bold uppercase tracking-[0.06em] text-muted"
                          >
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.records.map((r) => (
                        <tr key={r.id}>
                          <td className="border-b border-line px-2 py-2.5">
                            <div className="flex flex-col leading-tight">
                              <span className="text-[13px] font-semibold text-ink">
                                {r.student_name}
                              </span>
                              <span className="text-[12px] text-muted">{r.student_email}</span>
                            </div>
                          </td>
                          <td className="border-b border-line px-2 py-2.5">
                            <span className="text-[12.5px] text-muted">
                              {r.joined_at ? formatDateTime(r.joined_at) : '—'}
                            </span>
                          </td>
                          <td className="border-b border-line px-2 py-2.5">
                            <Pill className={STATUS_PILL[r.status]}>{r.status}</Pill>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </Modal>
  );
}
