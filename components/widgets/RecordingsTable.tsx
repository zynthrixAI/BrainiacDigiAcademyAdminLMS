import type { Recording } from '@/types/recording';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { EditIcon } from '@/components/icons/EditIcon';
import { TrashIcon } from '@/components/icons/TrashIcon';
import { GlobeIcon } from '@/components/icons/GlobeIcon';
import { recordingStage } from '@/lib/utils/recording-status';
import { formatDateTime } from '@/lib/utils/format';

interface RecordingsTableProps {
  recordings: Recording[];
  isLoading: boolean;
  deletingId: string | null;
  onEdit: (recording: Recording) => void;
  onDelete: (recording: Recording) => void;
}

const COLUMNS = ['Recording', 'Subject / Batch', 'Status', 'Updated', ''];

export function RecordingsTable({
  recordings,
  isLoading,
  deletingId,
  onEdit,
  onDelete,
}: RecordingsTableProps) {
  return (
    <Card className="overflow-hidden !p-0">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              {COLUMNS.map((col, i) => (
                <th
                  key={col || `col-${i}`}
                  className="border-b border-line bg-[#faf9f7] px-4 py-3 text-[10.5px] font-bold uppercase tracking-[0.08em] text-muted"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-10 text-center text-sm text-muted">
                  Loading recordings…
                </td>
              </tr>
            )}

            {!isLoading && recordings.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-10 text-center text-sm text-muted">
                  No recordings found.
                </td>
              </tr>
            )}

            {!isLoading &&
              recordings.map((recording) => {
                const stage = recordingStage(recording.status);
                return (
                  <tr key={recording.id} className="align-middle">
                    <td className="border-b border-line px-4 py-3.5">
                      <div className="flex flex-col leading-[1.3]">
                        <span className="text-[13.5px] font-bold text-ink">{recording.title}</span>
                        <span className="text-[12.5px] text-muted">
                          {recording.live_class_title}
                        </span>
                      </div>
                    </td>
                    <td className="border-b border-line px-4 py-3.5">
                      <div className="flex flex-col leading-[1.3]">
                        <span className="text-[13px] font-semibold text-ink">
                          {recording.subject_name}
                        </span>
                        <span className="text-[12.5px] text-muted">{recording.batch_name}</span>
                      </div>
                    </td>
                    <td className="border-b border-line px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Pill className={stage.pill}>{stage.label}</Pill>
                        {recording.raised_for_edit && (
                          <Pill className="bg-[#fef2f2] text-[var(--red)]">Re-edit</Pill>
                        )}
                      </div>
                    </td>
                    <td className="border-b border-line px-4 py-3.5">
                      <span className="whitespace-nowrap text-[13px] text-muted">
                        {formatDateTime(recording.updated_at)}
                      </span>
                    </td>
                    <td className="border-b border-line px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        {recording.link && (
                          <a
                            href={recording.link}
                            target="_blank"
                            rel="noreferrer"
                            title="Open video link"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-line bg-white text-muted transition-colors hover:border-ink hover:text-ink"
                          >
                            <GlobeIcon size={14} />
                          </a>
                        )}
                        <button
                          type="button"
                          title="Edit recording"
                          onClick={() => onEdit(recording)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-line bg-white text-muted transition-colors hover:border-ink hover:text-ink"
                        >
                          <EditIcon size={14} />
                        </button>
                        <button
                          type="button"
                          title="Delete recording"
                          onClick={() => onDelete(recording)}
                          disabled={deletingId === recording.id}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-line bg-white text-muted transition-colors hover:border-[var(--red)] hover:text-[var(--red)] disabled:opacity-50"
                        >
                          <TrashIcon size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
