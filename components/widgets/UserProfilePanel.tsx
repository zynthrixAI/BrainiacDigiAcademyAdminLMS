'use client';

import { useState, type FormEvent } from 'react';
import { isAxiosError } from 'axios';
import type { AdminUserUpdateRequest, Gender, Level, UserProfile } from '@/types/user';
import { useUpdateUser } from '@/hooks/mutation/useUpdateUser';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { EditIcon } from '@/components/icons/EditIcon';
import { formatDate } from '@/lib/utils/format';

interface UserProfilePanelProps {
  user: UserProfile;
  editing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onClose: () => void;
}

const LEVELS = [
  { label: 'O Level', value: 'O Level' },
  { label: 'A Level', value: 'A Level' },
];

const GENDERS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

/**
 * One profile form for both states. Fields are locked (disabled) until the
 * user hits Edit, then become editable — same layout throughout.
 */
export function UserProfilePanel({
  user,
  editing,
  onEdit,
  onCancel,
  onClose,
}: UserProfilePanelProps) {
  const { mutate, isPending, error } = useUpdateUser(user.id);

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [isVerified, setIsVerified] = useState(user.is_verified);
  const [level, setLevel] = useState<string>(user.level ?? '');
  const [gender, setGender] = useState<string>(user.gender ?? '');
  const [phno, setPhno] = useState(user.phno ?? '');
  const [country, setCountry] = useState(user.country ?? '');
  const [dob, setDob] = useState(user.dob ?? '');
  const [goal, setGoal] = useState(user.goal ?? '');
  const [parentName, setParentName] = useState(user.parent?.name ?? '');
  const [parentPhone, setParentPhone] = useState(user.parent?.phone ?? '');
  const [parentEmail, setParentEmail] = useState(user.parent?.email ?? '');

  const locked = !editing;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body: AdminUserUpdateRequest = {
      name,
      email,
      is_verified: isVerified,
      phno,
      country,
      dob,
      goal,
      ...(level ? { level: level as Level } : {}),
      ...(gender ? { gender: gender as Gender } : {}),
    };
    if (parentName || parentPhone || parentEmail) {
      body.parent = { name: parentName, phone: parentPhone, email: parentEmail };
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
        : 'Couldn’t update — the email may already be in use.';
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <TextField
        id="name"
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={locked}
        required
      />
      <TextField
        id="email"
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={locked}
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <TextField id="auth-type" label="Auth type" value={user.auth_type} disabled readOnly />
        <TextField
          id="joined"
          label="Joined"
          value={formatDate(user.created_at)}
          disabled
          readOnly
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Select
          id="level"
          label="Level"
          value={level}
          onChange={setLevel}
          placeholder="—"
          options={LEVELS}
          disabled={locked}
        />
        <Select
          id="gender"
          label="Gender"
          value={gender}
          onChange={setGender}
          placeholder="—"
          options={GENDERS}
          disabled={locked}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <TextField
          id="phno"
          label="Phone"
          value={phno}
          onChange={(e) => setPhno(e.target.value)}
          disabled={locked}
        />
        <TextField
          id="country"
          label="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          disabled={locked}
        />
      </div>

      <div className="grid grid-cols-2 items-end gap-3">
        <TextField
          id="dob"
          type="date"
          label="Date of birth"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          disabled={locked}
        />
        <Checkbox
          checked={isVerified}
          onChange={setIsVerified}
          disabled={locked}
          label="Email verified"
          className="h-[42px]"
        />
      </div>

      <div className="rounded-xl border border-line bg-[#faf9f7] p-4">
        <span className="text-[10.5px] font-bold uppercase tracking-[0.06em] text-muted">
          Parent / guardian
        </span>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <TextField
            id="parent-name"
            label="Name"
            value={parentName}
            onChange={(e) => setParentName(e.target.value)}
            disabled={locked}
          />
          <TextField
            id="parent-phone"
            label="Phone"
            value={parentPhone}
            onChange={(e) => setParentPhone(e.target.value)}
            disabled={locked}
          />
          <TextField
            id="parent-email"
            type="email"
            label="Email"
            value={parentEmail}
            onChange={(e) => setParentEmail(e.target.value)}
            disabled={locked}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="goal" className="font-display text-[12.5px] font-bold text-ink-2">
          Goal
        </label>
        <textarea
          id="goal"
          rows={2}
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          disabled={locked}
          className="resize-none rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-yellow disabled:cursor-default disabled:bg-[#faf9f7]"
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
            <Button type="button" onClick={onEdit}>
              <EditIcon size={13} /> Edit
            </Button>
          </>
        )}
      </div>
    </form>
  );
}
