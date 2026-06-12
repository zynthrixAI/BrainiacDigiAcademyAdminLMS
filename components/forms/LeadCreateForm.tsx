'use client';

import { useState, type FormEvent } from 'react';
import { isAxiosError } from 'axios';
import type {
  LeadCreateRequest,
  LeadGender,
  LeadLevel,
  LeadSource,
} from '@/types/lead';
import { useCreateLead } from '@/hooks/mutation/useCreateLead';
import { TextField } from '@/components/ui/TextField';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface LeadCreateFormProps {
  onCreated: () => void;
  onCancel: () => void;
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

const SOURCES = [
  { label: 'Manual', value: 'manual' },
  { label: 'Web form', value: 'contact_form' },
];

export function LeadCreateForm({ onCreated, onCancel }: LeadCreateFormProps) {
  const { mutate, isPending, error } = useCreateLead();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [source, setSource] = useState<string>('manual');
  const [level, setLevel] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [dob, setDob] = useState('');
  const [country, setCountry] = useState('');
  const [goal, setGoal] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body: LeadCreateRequest = {
      name,
      email,
      phone,
      source: source as LeadSource,
      level: level ? (level as LeadLevel) : null,
      gender: gender ? (gender as LeadGender) : null,
      dob: dob ? new Date(dob).toISOString() : null,
      country: country.trim() || null,
      goal: goal.trim() || null,
      notes: notes.trim() || null,
    };
    mutate(body, { onSuccess: onCreated });
  };

  let errorText: string | null = null;
  if (error) {
    const detail = isAxiosError(error)
      ? (error.response?.data as { detail?: unknown } | undefined)?.detail
      : undefined;
    errorText =
      typeof detail === 'string'
        ? detail
        : 'Couldn’t create lead — a lead with this email may already exist.';
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <TextField
        id="new-lead-name"
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <TextField
        id="new-lead-email"
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <div className="grid grid-cols-2 gap-3">
        <TextField
          id="new-lead-phone"
          label="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <Select
          id="new-lead-source"
          label="Source"
          value={source}
          onChange={setSource}
          options={SOURCES}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Select
          id="new-lead-level"
          label="Level"
          value={level}
          onChange={setLevel}
          options={LEVELS}
        />
        <Select
          id="new-lead-gender"
          label="Gender"
          value={gender}
          onChange={setGender}
          options={GENDERS}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="new-lead-dob" className="font-display text-[12.5px] font-bold text-ink-2">
            Date of birth
          </label>
          <input
            id="new-lead-dob"
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-yellow"
          />
        </div>
        <TextField
          id="new-lead-country"
          label="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
      </div>
      <TextField
        id="new-lead-goal"
        label="Goal"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
      />
      <div className="flex flex-col gap-2">
        <label htmlFor="new-lead-notes" className="font-display text-[12.5px] font-bold text-ink-2">
          Notes
        </label>
        <textarea
          id="new-lead-notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="resize-none rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-yellow"
        />
      </div>

      {errorText && (
        <p className="text-[13px] font-medium text-[var(--red)]">{errorText}</p>
      )}

      <div className="flex justify-end gap-2 border-t border-line pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Creating…' : 'Create lead'}
        </Button>
      </div>
    </form>
  );
}
