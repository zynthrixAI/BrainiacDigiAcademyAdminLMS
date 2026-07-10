'use client';

import { useState, type FormEvent } from 'react';
import type { PlanInterval, SubscriptionPlan } from '@/types/subscription';
import { apiErrorMessage } from '@/lib/utils/api-error';
import { usePlanMutations } from '@/hooks/mutation/usePlanMutations';
import { TextField } from '@/components/ui/TextField';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface PlanFormProps {
  plan?: SubscriptionPlan;
  onSaved: () => void;
  onCancel: () => void;
}

const INTERVALS = [
  { label: '1 Month (monthly)', value: 'monthly' },
  { label: '3 Months (quarterly)', value: 'quarterly' },
  { label: '1 Year (yearly)', value: 'yearly' },
];

/** Create (always as draft) or edit a subscription plan. */
export function PlanForm({ plan, onSaved, onCancel }: PlanFormProps) {
  const isEdit = Boolean(plan);
  const { create, update } = usePlanMutations();

  const [name, setName] = useState(plan?.name ?? '');
  const [description, setDescription] = useState(plan?.description ?? '');
  const [price, setPrice] = useState(plan ? String(plan.price) : '');
  const [interval, setInterval] = useState<string>(plan?.interval ?? 'monthly');
  const [priceError, setPriceError] = useState<string | null>(null);

  const mutation = isEdit ? update : create;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const priceValue = Number(price);
    if (!Number.isFinite(priceValue) || priceValue <= 0) {
      setPriceError('Price must be a whole PKR amount greater than 0.');
      return;
    }
    setPriceError(null);
    const body = {
      name: name.trim(),
      description: description.trim(),
      price: Math.round(priceValue),
      interval: interval as PlanInterval,
    };
    if (isEdit && plan) {
      update.mutate({ id: plan.id, body }, { onSuccess: onSaved });
    } else {
      create.mutate(body, { onSuccess: onSaved });
    }
  };

  const errorText = mutation.error
    ? apiErrorMessage(mutation.error, 'Couldn’t save the plan. Please try again.')
    : null;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <TextField
        id="plan-name"
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Premium Monthly"
        required
      />

      <div className="flex flex-col gap-2">
        <label htmlFor="plan-desc" className="font-display text-[12.5px] font-bold text-ink-2">
          Description
        </label>
        <textarea
          id="plan-desc"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="resize-none rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-yellow"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <TextField
          id="plan-price"
          label="Price (PKR)"
          type="number"
          min={1}
          step={1}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="e.g. 1500"
          required
        />
        <Select
          id="plan-interval"
          label="Interval"
          value={interval}
          onChange={setInterval}
          options={INTERVALS}
        />
      </div>

      {!isEdit && (
        <p className="text-[12.5px] text-muted">
          New plans are created as drafts — students only see them after you publish.
        </p>
      )}

      {(priceError || errorText) && (
        <p className="text-[13px] font-medium text-[var(--red)]">{priceError ?? errorText}</p>
      )}

      <div className="flex justify-end gap-2 border-t border-line pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving…' : isEdit ? 'Save changes' : 'Create draft plan'}
        </Button>
      </div>
    </form>
  );
}
