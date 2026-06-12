'use client';

import { useState } from 'react';
import { useMarqueeSettings } from '@/hooks/query/useSettings';
import { useUpdateMarquee } from '@/hooks/mutation/useSettingsMutations';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { SettingRow } from '@/components/widgets/SettingRow';
import { CheckIcon } from '@/components/icons/CheckIcon';
import { apiErrorMessage } from '@/lib/utils/api-error';
import type { MarqueeBanner } from '@/types/settings';

const MESSAGE_LIMIT = 200;

function MarqueeForm({ data }: { data: MarqueeBanner }) {
  const { mutate, isPending, isSuccess, error } = useUpdateMarquee();

  const [enabled, setEnabled] = useState(data.is_enabled);
  const [message, setMessage] = useState(data.message ?? '');

  // Re-seed from the persisted document when it changes (e.g. after a save).
  const [seeded, setSeeded] = useState(data);
  if (seeded !== data) {
    setSeeded(data);
    setEnabled(data.is_enabled);
    setMessage(data.message ?? '');
  }

  const dirty = enabled !== data.is_enabled || message !== (data.message ?? '');

  const handleSave = () => {
    mutate({ is_enabled: enabled, message: message.trim() || null });
  };

  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-[16px] font-bold text-ink">Marquee banner</h3>
        <Toggle checked={enabled} onChange={setEnabled} aria-label="Enable marquee banner" />
      </div>
      <span className="text-[12.5px] text-muted">
        Yellow banner at the top of every student page. Hidden automatically if the message is
        empty.
      </span>

      <SettingRow label="Message" description="Visible to all logged-in students">
        <div className="flex flex-col gap-1">
          <textarea
            value={message}
            maxLength={MESSAGE_LIMIT}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Term-end exams begin Monday — check your schedule."
            className="min-h-[60px] w-full resize-y rounded-lg border border-line bg-white px-3 py-2 text-[13px] text-ink outline-none focus:border-yellow placeholder:text-muted-2"
          />
          <span className="text-right text-[11.5px] text-muted">
            {message.length} / {MESSAGE_LIMIT}
          </span>
        </div>
      </SettingRow>

      {enabled && !message.trim() && (
        <p className="text-[12px] text-muted">
          The banner is on but empty — students won’t see anything until you add a message.
        </p>
      )}

      <div className="flex items-center justify-end gap-3 border-t border-line pt-4">
        {error && (
          <span className="text-[12.5px] font-medium text-[var(--red)]">
            {apiErrorMessage(error, 'Couldn’t save. Please try again.')}
          </span>
        )}
        {!dirty && isSuccess && !error && (
          <span className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[var(--green)]">
            <CheckIcon size={13} /> Saved
          </span>
        )}
        <Button onClick={handleSave} disabled={!dirty || isPending}>
          {isPending ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </Card>
  );
}

/** Marquee-banner settings — fetches, then renders the editable form. */
export function MarqueeSettingsCard() {
  const { data, isLoading, isError } = useMarqueeSettings();

  if (data) return <MarqueeForm data={data} />;

  return (
    <Card>
      <h3 className="font-display text-[16px] font-bold text-ink">Marquee banner</h3>
      {isLoading && <p className="mt-3 text-[13px] text-muted">Loading…</p>}
      {isError && (
        <p className="mt-3 text-[13px] font-medium text-[var(--red)]">
          Couldn’t load marquee settings.
        </p>
      )}
    </Card>
  );
}
