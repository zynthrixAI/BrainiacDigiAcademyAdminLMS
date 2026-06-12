'use client';

import { useState } from 'react';
import { useMaintenanceSettings } from '@/hooks/query/useSettings';
import { useUpdateMaintenance } from '@/hooks/mutation/useSettingsMutations';
import { useConfirm } from '@/hooks/useConfirm';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { SettingRow } from '@/components/widgets/SettingRow';
import { CheckIcon } from '@/components/icons/CheckIcon';
import { apiErrorMessage } from '@/lib/utils/api-error';
import type { MaintenanceMode } from '@/types/settings';

const INPUT_CLASS =
  'w-full rounded-lg border border-line bg-white px-3 py-2 text-[13px] text-ink outline-none focus:border-yellow';

/** ISO-8601 UTC → value for a `datetime-local` input (device local time). */
function isoToLocalInput(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** `datetime-local` value (device local time) → ISO-8601 UTC, or null when empty. */
function localInputToIso(value: string): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function MaintenanceForm({ data }: { data: MaintenanceMode }) {
  const { mutate, isPending, isSuccess, error } = useUpdateMaintenance();
  const confirm = useConfirm();

  const [enabled, setEnabled] = useState(data.is_enabled);
  const [start, setStart] = useState(isoToLocalInput(data.start_at));
  const [end, setEnd] = useState(isoToLocalInput(data.end_at));

  // Re-seed from the persisted document when it changes (e.g. after a save).
  const [seeded, setSeeded] = useState(data);
  if (seeded !== data) {
    setSeeded(data);
    setEnabled(data.is_enabled);
    setStart(isoToLocalInput(data.start_at));
    setEnd(isoToLocalInput(data.end_at));
  }

  const dirty =
    enabled !== data.is_enabled ||
    start !== isoToLocalInput(data.start_at) ||
    end !== isoToLocalInput(data.end_at);

  const handleSave = async () => {
    // High blast radius — confirm whenever switching maintenance on.
    if (enabled && !data.is_enabled) {
      const ok = await confirm({
        title: 'Enable maintenance mode?',
        message:
          'This locks everyone out of the app and shows the maintenance screen until you turn it off. Continue?',
        confirmLabel: 'Enable maintenance',
        tone: 'danger',
      });
      if (!ok) return;
    }
    mutate({
      is_enabled: enabled,
      start_at: localInputToIso(start),
      end_at: localInputToIso(end),
    });
  };

  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-[16px] font-bold text-ink">Maintenance window</h3>
        <Toggle checked={enabled} onChange={setEnabled} aria-label="Enable maintenance mode" />
      </div>
      <span className="text-[12.5px] text-muted">
        When enabled, students see a maintenance page until you turn it off — the start/end times
        are informational and do not auto-toggle.
      </span>

      <SettingRow label="Start" description="Your device’s local time">
        <input
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className={INPUT_CLASS}
        />
      </SettingRow>
      <SettingRow label="End" description="Your device’s local time">
        <input
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className={INPUT_CLASS}
        />
      </SettingRow>

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

/** Maintenance-window settings — fetches, then renders the editable form. */
export function MaintenanceSettingsCard() {
  const { data, isLoading, isError } = useMaintenanceSettings();

  if (data) return <MaintenanceForm data={data} />;

  return (
    <Card>
      <h3 className="font-display text-[16px] font-bold text-ink">Maintenance window</h3>
      {isLoading && <p className="mt-3 text-[13px] text-muted">Loading…</p>}
      {isError && (
        <p className="mt-3 text-[13px] font-medium text-[var(--red)]">
          Couldn’t load maintenance settings.
        </p>
      )}
    </Card>
  );
}
