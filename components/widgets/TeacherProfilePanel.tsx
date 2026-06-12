'use client';

import { useState, type FormEvent } from 'react';
import { isAxiosError } from 'axios';
import type { Teacher, TeacherLevel, TeacherUpdateRequest } from '@/types/teacher';
import { useUpdateTeacher } from '@/hooks/mutation/useUpdateTeacher';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { EditIcon } from '@/components/icons/EditIcon';
import { formatDate } from '@/lib/utils/format';

interface TeacherProfilePanelProps {
  teacher: Teacher;
  editing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onClose: () => void;
}

const LEVELS = [
  { label: 'O Level', value: 'O' },
  { label: 'A Level', value: 'A' },
];

const emptyToNull = (value: string): string | null => (value.trim() === '' ? null : value);

/** One teacher profile form for both states — locked until Edit. */
export function TeacherProfilePanel({
  teacher,
  editing,
  onEdit,
  onCancel,
  onClose,
}: TeacherProfilePanelProps) {
  const { mutate, isPending, error } = useUpdateTeacher(teacher.id);

  const [name, setName] = useState(teacher.name);
  const [email, setEmail] = useState(teacher.email);
  const [level, setLevel] = useState<string>(teacher.level);
  const [phone, setPhone] = useState(teacher.phone ?? '');
  const [bio, setBio] = useState(teacher.bio ?? '');
  const [isActive, setIsActive] = useState(teacher.is_active);
  const [password, setPassword] = useState('');

  const locked = !editing;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body: TeacherUpdateRequest = {
      name,
      email,
      level: level as TeacherLevel,
      phone: emptyToNull(phone),
      bio: emptyToNull(bio),
      is_active: isActive,
    };
    if (password.trim() !== '') body.password = password;
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
        : 'Couldn’t save — the email may already be in use.';
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <TextField
        id="t-name"
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={locked}
        required
      />
      <TextField
        id="t-email"
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={locked}
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <Select
          id="t-level"
          label="Level"
          value={level}
          onChange={setLevel}
          options={LEVELS}
          disabled={locked}
        />
        <TextField
          id="t-phone"
          label="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={locked}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <TextField
          id="t-created"
          label="Joined"
          value={formatDate(teacher.created_at)}
          disabled
          readOnly
        />
        <TextField
          id="t-updated"
          label="Last updated"
          value={formatDate(teacher.updated_at)}
          disabled
          readOnly
        />
      </div>

      <Checkbox
        checked={isActive}
        onChange={setIsActive}
        disabled={locked}
        label="Active — can log in"
      />

      <div className="flex flex-col gap-2">
        <label htmlFor="t-bio" className="font-display text-[12.5px] font-bold text-ink-2">
          Bio
        </label>
        <textarea
          id="t-bio"
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          disabled={locked}
          className="resize-none rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-yellow disabled:cursor-default disabled:bg-[#faf9f7]"
        />
      </div>

      {editing && (
        <TextField
          id="t-password"
          type="password"
          label="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Leave blank to keep current"
          autoComplete="new-password"
        />
      )}

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
            <Button type="button" onClick={onEdit}>
              <EditIcon size={13} /> Edit
            </Button>
          </>
        )}
      </div>
    </form>
  );
}
