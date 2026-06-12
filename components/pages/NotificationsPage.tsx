'use client';

import { useMemo, useState } from 'react';
import { useProfile } from '@/hooks/query/useProfile';
import { useBatches } from '@/hooks/query/useBatches';
import { useSendNotification } from '@/hooks/mutation/useNotificationMutations';
import { useConfirm } from '@/hooks/useConfirm';
import { NotificationTargetPicker } from '@/components/widgets/NotificationTargetPicker';
import { StudentPicker, type PickedStudent } from '@/components/widgets/StudentPicker';
import { NotificationPreviewCard } from '@/components/widgets/NotificationPreviewCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { SendIcon } from '@/components/icons/SendIcon';
import { CheckIcon } from '@/components/icons/CheckIcon';
import { ShieldIcon } from '@/components/icons/ShieldIcon';
import { apiErrorMessage } from '@/lib/utils/api-error';
import type { NotificationTarget } from '@/types/notification';

const BODY_LIMIT = 500;

/** Compose and send a notification to all users, a batch, or one student.
 *  Superadmin only — the backend 403s plain admins. */
export function NotificationsPage() {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const isSuperadmin = profile?.role === 'superadmin';

  const { data: batches } = useBatches(isSuperadmin ? {} : null);
  const { mutate: send, isPending, error } = useSendNotification();
  const confirm = useConfirm();

  const [target, setTarget] = useState<NotificationTarget>('all');
  const [batchId, setBatchId] = useState('');
  const [student, setStudent] = useState<PickedStudent | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const batchOptions = useMemo(
    () =>
      (batches ?? []).map((b) => ({
        label: b.name,
        value: b.id,
        description: `${b.subject_name} · ${b.enrolled_count} ${
          b.enrolled_count === 1 ? 'student' : 'students'
        }`,
      })),
    [batches],
  );

  const selectedBatch = batches?.find((b) => b.id === batchId);

  const targetReady =
    target === 'all' ||
    (target === 'batch' && !!batchId) ||
    (target === 'student' && !!student);
  const canSend = title.trim().length > 0 && body.trim().length > 0 && targetReady && !isPending;

  // Any edit clears the previous send result.
  const clear = () => setResult(null);

  const handleSend = async () => {
    const message =
      target === 'all'
        ? 'This sends an in-app notification to EVERY user on the platform. There is no undo.'
        : target === 'batch'
          ? `Notify everyone enrolled in “${selectedBatch?.name ?? 'this batch'}”? This can’t be undone.`
          : `Send this notification to ${student?.name ?? 'this student'}? This can’t be undone.`;

    const ok = await confirm({
      title: 'Send notification?',
      message,
      confirmLabel: 'Send notification',
      tone: target === 'all' ? 'danger' : 'default',
    });
    if (!ok) return;

    send(
      {
        title: title.trim(),
        body: body.trim(),
        type: 'announcement',
        target,
        batch_id: target === 'batch' ? batchId : null,
        student_id: target === 'student' ? student?.id ?? null : null,
      },
      {
        onSuccess: (res) => {
          setResult(res.sent);
          setTitle('');
          setBody('');
        },
      },
    );
  };

  if (profileLoading || !profile) {
    return <p className="text-[14px] text-muted">Loading…</p>;
  }

  if (!isSuperadmin) {
    return (
      <Card className="flex flex-col items-center gap-2 py-14 text-center">
        <span className="text-muted-2">
          <ShieldIcon size={32} />
        </span>
        <p className="font-display text-[15px] font-bold text-ink">Superadmin only</p>
        <p className="max-w-sm text-[13px] text-muted">
          Sending notifications is restricted to the superadmin. Ask them to send a platform
          announcement.
        </p>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-col">
        <h1 className="font-display text-[26px] font-extrabold text-ink">Notifications</h1>
        <span className="mt-2 text-[13px] text-muted">
          Send an announcement to all users, a batch, or a single student
        </span>
      </div>

      {result !== null &&
        (result === 0 ? (
          <div className="mb-5 rounded-xl border border-[var(--yellow)]/40 bg-yellow-soft px-4 py-3 text-[13px] font-semibold text-[var(--yellow-ink)]">
            No users matched — nothing was delivered. The target may have no enrolled students.
          </div>
        ) : (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-[var(--green)]/30 bg-[#e7f4ee] px-4 py-3 text-[13px] font-semibold text-[var(--green)]">
            <CheckIcon size={15} /> Sent to {result.toLocaleString()}{' '}
            {result === 1 ? 'user' : 'users'}.
          </div>
        ))}

      {error && (
        <div className="mb-5 rounded-xl border border-[var(--red)]/30 bg-[#fdeaea] px-4 py-3 text-[13px] font-semibold text-[var(--red)]">
          {apiErrorMessage(error, 'Couldn’t send the notification. Please try again.')}
        </div>
      )}

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card>
          <h3 className="font-display text-[15px] font-bold text-ink">Compose</h3>
          <span className="text-[12.5px] text-muted">
            Notifications are delivered in-app and can’t be recalled once sent.
          </span>

          <div className="mt-5 flex flex-col gap-5">
            <NotificationTargetPicker
              value={target}
              onChange={(t) => {
                setTarget(t);
                clear();
              }}
            />

            {target === 'batch' && (
              <div className="flex flex-col gap-2">
                <label className="font-display text-[12px] font-bold text-ink-2">Batch</label>
                <Select
                  options={batchOptions}
                  value={batchId}
                  onChange={(v) => {
                    setBatchId(v);
                    clear();
                  }}
                  placeholder="Select a batch…"
                  searchable
                />
              </div>
            )}

            {target === 'student' && (
              <div className="flex flex-col gap-2">
                <label className="font-display text-[12px] font-bold text-ink-2">Student</label>
                <StudentPicker
                  value={student}
                  onChange={(s) => {
                    setStudent(s);
                    clear();
                  }}
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label
                htmlFor="notification-title"
                className="font-display text-[12px] font-bold text-ink-2"
              >
                Title
              </label>
              <input
                id="notification-title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  clear();
                }}
                placeholder="Term-end exam schedule"
                className="rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-yellow placeholder:text-muted-2"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="notification-body"
                className="font-display text-[12px] font-bold text-ink-2"
              >
                Message
              </label>
              <textarea
                id="notification-body"
                value={body}
                maxLength={BODY_LIMIT}
                onChange={(e) => {
                  setBody(e.target.value);
                  clear();
                }}
                placeholder="Exams begin Monday at 9 AM. Check your batch page for room assignments."
                className="min-h-[140px] resize-y rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-yellow placeholder:text-muted-2"
              />
              <span className="text-[12px] text-muted">
                {body.length} / {BODY_LIMIT} characters
              </span>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSend} disabled={!canSend}>
                {isPending ? 'Sending…' : 'Send notification'} <SendIcon size={13} />
              </Button>
            </div>
          </div>
        </Card>

        <NotificationPreviewCard title={title} body={body} />
      </div>
    </div>
  );
}
