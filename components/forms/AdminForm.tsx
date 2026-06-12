'use client';

import { useState, type FormEvent } from 'react';
import { isAxiosError } from 'axios';
import type { AdminProfile, AdminCreateRequest, AdminUpdateRequest } from '@/types/admin';
import { useAdminMutations } from '@/hooks/mutation/useAdminMutations';
import { TextField } from '@/components/ui/TextField';
import { Button } from '@/components/ui/Button';

interface AdminFormProps {
  admin?: AdminProfile;
  onSaved: () => void;
  onCancel: () => void;
}

/** Create a new admin, or edit an existing one's name / email / password.
 *  Role is intentionally not editable here (exactly one superadmin exists). */
export function AdminForm({ admin, onSaved, onCancel }: AdminFormProps) {
  const isEdit = Boolean(admin);
  const { create, update } = useAdminMutations();

  const [name, setName] = useState(admin?.name ?? '');
  const [email, setEmail] = useState(admin?.email ?? '');
  const [password, setPassword] = useState('');

  const mutation = isEdit ? update : create;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isEdit && admin) {
      const body: AdminUpdateRequest = { name: name.trim(), email: email.trim() };
      if (password.trim()) body.password = password;
      update.mutate({ id: admin.id, body }, { onSuccess: onSaved });
    } else {
      const body: AdminCreateRequest = {
        name: name.trim(),
        email: email.trim(),
        password,
      };
      create.mutate(body, { onSuccess: onSaved });
    }
  };

  let errorText: string | null = null;
  if (mutation.error) {
    const detail = isAxiosError(mutation.error)
      ? (mutation.error.response?.data as { detail?: unknown } | undefined)?.detail
      : undefined;
    errorText =
      typeof detail === 'string'
        ? detail
        : 'Couldn’t save the admin — the email may already be in use.';
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <TextField
        id="admin-name"
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        autoFocus
      />
      <TextField
        id="admin-email"
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <TextField
        id="admin-password"
        type="password"
        label={isEdit ? 'New password' : 'Password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={isEdit ? 'Leave blank to keep current' : undefined}
        autoComplete="new-password"
        required={!isEdit}
      />

      {isEdit && (
        <p className="rounded-xl border border-line bg-[#faf9f7] px-3.5 py-2.5 text-[12.5px] text-muted">
          Setting a new password signs this admin out of all sessions on their next refresh.
        </p>
      )}

      {errorText && <p className="text-[13px] font-medium text-[var(--red)]">{errorText}</p>}

      <div className="flex justify-end gap-2 border-t border-line pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving…' : isEdit ? 'Save changes' : 'Create admin'}
        </Button>
      </div>
    </form>
  );
}
