'use client';

import { useState, type FormEvent } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';

interface NameModalProps {
  open: boolean;
  title: string;
  nameLabel: string;
  initialName: string;
  pending: boolean;
  error: string | null;
  onSubmit: (name: string) => void;
  onClose: () => void;
}

/** Shared modal for creating/editing a topic or subtopic — name only; order is automatic. */
export function NameModal({
  open,
  title,
  nameLabel,
  initialName,
  pending,
  error,
  onSubmit,
  onClose,
}: NameModalProps) {
  const [name, setName] = useState(initialName);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return;
    onSubmit(name.trim());
  };

  return (
    <Modal open={open} title={title} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField
          id="name-modal-input"
          label={nameLabel}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />
        {error && <p className="text-[13px] font-medium text-[var(--red)]">{error}</p>}
        <div className="flex justify-end gap-2 border-t border-line pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
