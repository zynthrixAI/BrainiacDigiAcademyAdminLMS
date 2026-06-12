'use client';

import { useState, type FormEvent } from 'react';
import { isAxiosError } from 'axios';
import type { TeacherCreateRequest, TeacherLevel } from '@/types/teacher';
import { useCreateTeacher } from '@/hooks/mutation/useCreateTeacher';
import { TextField } from '@/components/ui/TextField';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface TeacherCreateFormProps {
  onCreated: () => void;
  onCancel: () => void;
}

const LEVELS = [
  { label: 'O Level', value: 'O' },
  { label: 'A Level', value: 'A' },
];

export function TeacherCreateForm({ onCreated, onCancel }: TeacherCreateFormProps) {
  const { mutate, isPending, error } = useCreateTeacher();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [level, setLevel] = useState<string>('O');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body: TeacherCreateRequest = {
      name,
      email,
      password,
      level: level as TeacherLevel,
      phone: phone.trim() || null,
      bio: bio.trim() || null,
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
        : 'Couldn’t create teacher — the email may already be in use.';
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <TextField
        id="new-name"
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <TextField
        id="new-email"
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <div className="grid grid-cols-2 gap-3">
        <TextField
          id="new-password"
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
        <Select
          id="new-level"
          label="Level"
          value={level}
          onChange={setLevel}
          options={LEVELS}
        />
      </div>
      <TextField
        id="new-phone"
        label="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <div className="flex flex-col gap-2">
        <label htmlFor="new-bio" className="font-display text-[12.5px] font-bold text-ink-2">
          Bio
        </label>
        <textarea
          id="new-bio"
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
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
          {isPending ? 'Creating…' : 'Create teacher'}
        </Button>
      </div>
    </form>
  );
}
