'use client';

import { useState, type FormEvent } from 'react';
import type { Recording, RecordingStatus } from '@/types/recording';
import type { LiveClass } from '@/types/live-class';
import { apiErrorMessage } from '@/lib/utils/api-error';
import { useRecordingMutations } from '@/hooks/mutation/useRecordingMutations';
import { RECORDING_STATUS_OPTIONS } from '@/lib/utils/recording-status';
import { liveClassStage } from '@/lib/utils/live-class-status';
import { formatDateTime } from '@/lib/utils/format';
import { TextField } from '@/components/ui/TextField';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { GlobeIcon } from '@/components/icons/GlobeIcon';

interface RecordingFormProps {
  recording?: Recording;
  /** Live classes of the parent batch — populates the create-mode picker.
   *  When omitted, a raw live-class ID field is shown instead. */
  liveClasses?: LiveClass[];
  onSaved: () => void;
  onCancel: () => void;
}

export function RecordingForm({ recording, liveClasses, onSaved, onCancel }: RecordingFormProps) {
  const isEdit = Boolean(recording);
  const { create, update } = useRecordingMutations();

  const [liveClassId, setLiveClassId] = useState('');
  const [title, setTitle] = useState(recording?.title ?? '');
  const [description, setDescription] = useState(recording?.description ?? '');
  const [link, setLink] = useState(recording?.link ?? '');
  const [status, setStatus] = useState<string>(recording?.status ?? 'processing');
  const [adminNotes, setAdminNotes] = useState(recording?.admin_notes ?? '');
  const [raisedForEdit, setRaisedForEdit] = useState(recording?.raised_for_edit ?? false);

  const mutation = isEdit ? update : create;

  // Publishing a recording fans out a notification to enrolled students.
  const willNotify = status === 'published' && recording?.status !== 'published';

  // In batch context the picker may have no options yet (no live classes).
  const usesPicker = liveClasses !== undefined;
  const noLiveClasses = usesPicker && liveClasses.length === 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isEdit && !liveClassId.trim()) return;
    if (isEdit && recording) {
      update.mutate(
        {
          id: recording.id,
          body: {
            title: title.trim(),
            description: description.trim(),
            link: link.trim(),
            status: status as RecordingStatus,
            admin_notes: adminNotes.trim(),
            raised_for_edit: raisedForEdit,
          },
        },
        { onSuccess: onSaved },
      );
    } else {
      create.mutate(
        {
          liveClassId: liveClassId.trim(),
          body: {
            title: title.trim(),
            description: description.trim(),
            link: link.trim(),
            status: status as RecordingStatus,
          },
        },
        { onSuccess: onSaved },
      );
    }
  };

  const errorText = mutation.error
    ? apiErrorMessage(mutation.error, 'Couldn’t save the recording. Please try again.')
    : null;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {!isEdit &&
        (usesPicker ? (
          noLiveClasses ? (
            <p className="rounded-xl border border-line bg-[#faf9f7] px-3.5 py-2.5 text-[12.5px] text-muted">
              This batch has no live classes yet. A recording attaches to a finished
              live class — once the teacher runs a class it’ll appear here.
            </p>
          ) : (
            <Select
              id="rec-live-class"
              label="Live class"
              value={liveClassId}
              onChange={setLiveClassId}
              placeholder="Select a live class…"
              searchable
              options={(liveClasses ?? []).map((lc) => ({
                value: lc.id,
                label: lc.title,
                description: `${formatDateTime(lc.scheduled_at)} · ${liveClassStage(lc.status).label}`,
              }))}
            />
          )
        ) : (
          <TextField
            id="rec-live-class"
            label="Live class ID"
            value={liveClassId}
            onChange={(e) => setLiveClassId(e.target.value)}
            placeholder="ObjectId of the finished live class"
            required
          />
        ))}

      <TextField
        id="rec-title"
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <div className="flex flex-col gap-2">
        <label htmlFor="rec-desc" className="font-display text-[12.5px] font-bold text-ink-2">
          Description
        </label>
        <textarea
          id="rec-desc"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="resize-none rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-yellow"
        />
      </div>

      <TextField
        id="rec-link"
        label="Video link"
        icon={<GlobeIcon size={15} />}
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="https://…"
        required
      />

      <Select
        id="rec-status"
        label="Status"
        value={status}
        onChange={setStatus}
        options={RECORDING_STATUS_OPTIONS}
      />

      {willNotify && (
        <p className="rounded-xl border border-[#bbe7cf] bg-[#ecfdf5] px-3.5 py-2.5 text-[12.5px] font-medium text-[var(--green)]">
          Publishing notifies every student enrolled in this batch.
        </p>
      )}

      {isEdit && (
        <>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="rec-notes"
              className="font-display text-[12.5px] font-bold text-ink-2"
            >
              Admin notes
            </label>
            <textarea
              id="rec-notes"
              rows={2}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Internal only — not shown to students"
              className="resize-none rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-yellow"
            />
          </div>

          <Checkbox
            checked={raisedForEdit}
            onChange={setRaisedForEdit}
            label="Flagged for re-edit"
          />
        </>
      )}

      {errorText && <p className="text-[13px] font-medium text-[var(--red)]">{errorText}</p>}

      <div className="flex justify-end gap-2 border-t border-line pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending || (!isEdit && noLiveClasses)}>
          {mutation.isPending ? 'Saving…' : isEdit ? 'Save changes' : 'Add recording'}
        </Button>
      </div>
    </form>
  );
}
