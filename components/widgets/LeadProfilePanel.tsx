'use client';

import { useState, type FormEvent } from 'react';
import { isAxiosError } from 'axios';
import type {
  Lead,
  LeadGender,
  LeadLevel,
  LeadStatus,
  LeadUpdateRequest,
} from '@/types/lead';
import { useUpdateLead } from '@/hooks/mutation/useUpdateLead';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Select } from '@/components/ui/Select';
import { EditIcon } from '@/components/icons/EditIcon';
import { BoltIcon } from '@/components/icons/BoltIcon';
import { formatDate, toDateInputValue } from '@/lib/utils/format';
import { LEAD_STATUSES, leadStatusLabel, leadPillStyle } from '@/lib/utils/lead-status';

interface LeadProfilePanelProps {
  lead: Lead;
  editing: boolean;
  enrolling: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onClose: () => void;
  onEnroll: () => void;
}

const LEVELS = [
  { label: '— None', value: '' },
  { label: 'O Level', value: 'O' },
  { label: 'A Level', value: 'A' },
];

const GENDERS = [
  { label: '— Unspecified', value: '' },
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

const STATUS_OPTIONS = LEAD_STATUSES.map((s) => ({ label: leadStatusLabel(s), value: s }));

/** One lead form for both states — locked until Edit. */
export function LeadProfilePanel({
  lead,
  editing,
  enrolling,
  onEdit,
  onCancel,
  onClose,
  onEnroll,
}: LeadProfilePanelProps) {
  const { mutate, isPending, error } = useUpdateLead(lead.id);

  const [name, setName] = useState(lead.name);
  const [email, setEmail] = useState(lead.email);
  const [phone, setPhone] = useState(lead.phone);
  const [level, setLevel] = useState<string>(lead.level ?? '');
  const [status, setStatus] = useState<string>(lead.status);
  const [gender, setGender] = useState<string>(lead.gender ?? '');
  const [dob, setDob] = useState(toDateInputValue(lead.dob));
  const [country, setCountry] = useState(lead.country ?? '');
  const [goal, setGoal] = useState(lead.goal ?? '');
  const [notes, setNotes] = useState(lead.notes ?? '');
  const [parentName, setParentName] = useState(lead.parent?.name ?? '');
  const [parentPhone, setParentPhone] = useState(lead.parent?.phone ?? '');
  const [parentEmail, setParentEmail] = useState(lead.parent?.email ?? '');

  const locked = !editing;
  const isEnrolled = lead.status === 'enrolled' || lead.student_id !== null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body: LeadUpdateRequest = {
      name,
      email,
      phone,
      status: status as LeadStatus,
    };
    if (level) body.level = level as LeadLevel;
    if (gender) body.gender = gender as LeadGender;
    if (dob) body.dob = new Date(dob).toISOString();
    if (country.trim()) body.country = country.trim();
    if (goal.trim()) body.goal = goal.trim();
    if (notes.trim()) body.notes = notes.trim();
    if (parentName.trim() || parentPhone.trim() || parentEmail.trim()) {
      body.parent = {
        name: parentName.trim(),
        phone: parentPhone.trim(),
        email: parentEmail.trim(),
      };
    }
    mutate(body, { onSuccess: onCancel });
  };

  let errorText: string | null = null;
  if (error) {
    const detail = isAxiosError(error)
      ? (error.response?.data as { detail?: unknown } | undefined)?.detail
      : undefined;
    errorText =
      typeof detail === 'string'
        ? detail
        : 'Couldn’t save — the email may already belong to another lead.';
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em]"
          style={leadPillStyle(lead.status)}
        >
          {leadStatusLabel(lead.status)}
        </span>
        <span className="text-[12.5px] text-muted">
          {lead.source === 'contact_form' ? 'From web form' : 'Added manually'}
        </span>
        {isEnrolled && lead.student_id && (
          <span className="text-[12.5px] text-muted">· Student #{lead.student_id}</span>
        )}
      </div>

      <TextField
        id="l-name"
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={locked}
        required
      />
      <TextField
        id="l-email"
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={locked}
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <TextField
          id="l-phone"
          label="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={locked}
          required
        />
        <Select
          id="l-status"
          label="Status"
          value={status}
          onChange={setStatus}
          options={STATUS_OPTIONS}
          disabled={locked}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Select
          id="l-level"
          label="Level"
          value={level}
          onChange={setLevel}
          options={LEVELS}
          disabled={locked}
        />
        <Select
          id="l-gender"
          label="Gender"
          value={gender}
          onChange={setGender}
          options={GENDERS}
          disabled={locked}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="l-dob" className="font-display text-[12.5px] font-bold text-ink-2">
            Date of birth
          </label>
          <input
            id="l-dob"
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            disabled={locked}
            className="rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-yellow disabled:cursor-default disabled:bg-[#faf9f7]"
          />
        </div>
        <TextField
          id="l-country"
          label="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          disabled={locked}
        />
      </div>

      <TextField
        id="l-goal"
        label="Goal"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        disabled={locked}
      />

      <div className="flex flex-col gap-2">
        <label htmlFor="l-notes" className="font-display text-[12.5px] font-bold text-ink-2">
          Notes
        </label>
        <textarea
          id="l-notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={locked}
          className="resize-none rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-yellow disabled:cursor-default disabled:bg-[#faf9f7]"
        />
      </div>

      <div className="rounded-xl border border-line bg-[#faf9f7] p-3.5">
        <span className="font-display text-[12px] font-bold uppercase tracking-[0.06em] text-muted">
          Parent / guardian
        </span>
        <div className="mt-3 flex flex-col gap-3">
          <TextField
            id="l-parent-name"
            label="Name"
            value={parentName}
            onChange={(e) => setParentName(e.target.value)}
            disabled={locked}
          />
          <div className="grid grid-cols-2 gap-3">
            <TextField
              id="l-parent-phone"
              label="Phone"
              value={parentPhone}
              onChange={(e) => setParentPhone(e.target.value)}
              disabled={locked}
            />
            <TextField
              id="l-parent-email"
              type="email"
              label="Email"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              disabled={locked}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <TextField
          id="l-created"
          label="Created"
          value={formatDate(lead.created_at)}
          disabled
          readOnly
        />
        <TextField
          id="l-admission"
          label="Admission date"
          value={lead.admission_date ? formatDate(lead.admission_date) : '—'}
          disabled
          readOnly
        />
      </div>

      {errorText && (
        <p className="text-[13px] font-medium text-[var(--red)]">{errorText}</p>
      )}

      <div className="flex justify-end gap-2 border-t border-line pt-4">
        {editing ? (
          <>
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving…' : 'Save changes'}
            </Button>
          </>
        ) : (
          <>
            <Button type="button" variant="ghost" onClick={onClose}>
              Close
            </Button>
            {!isEnrolled && (
              <Button type="button" variant="ghost" onClick={onEnroll} disabled={enrolling}>
                <BoltIcon size={13} /> {enrolling ? 'Enrolling…' : 'Enroll'}
              </Button>
            )}
            <Button type="button" onClick={onEdit}>
              <EditIcon size={13} /> Edit
            </Button>
          </>
        )}
      </div>
    </form>
  );
}
