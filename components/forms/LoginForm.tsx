'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { isAxiosError } from 'axios';
import { useLogin } from '@/hooks/mutation/useLogin';
import { saveSession } from '@/lib/auth-session';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { ArrowIcon } from '@/components/icons/ArrowIcon';
import { UserIcon } from '@/components/icons/UserIcon';
import { LockIcon } from '@/components/icons/LockIcon';

/**
 * Admin sign-in form. Owns the email/password input state, delegates the API
 * call to the `useLogin` mutation hook, and persists the returned token pair
 * via the shared auth-session helper (access token + httpOnly refresh cookie).
 */
export function LoginForm() {
  const router = useRouter();
  const { mutate, isPending, error } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate(
      { email, password },
      {
        onSuccess: async (data) => {
          await saveSession(data);
          router.push('/dashboard');
        },
      },
    );
  };

  const errorMessage = error
    ? (isAxiosError(error) &&
        (error.response?.data as { detail?: string } | undefined)?.detail) ||
      'Couldn’t sign you in. Check your credentials and try again.'
    : null;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col" noValidate>
      <div className="mb-4 mt-7">
        <TextField
          id="email"
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          placeholder="you@brainiacsdigiacademy.com"
          icon={<UserIcon size={16} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-5">
        <TextField
          id="password"
          name="password"
          type="password"
          label="Password"
          autoComplete="current-password"
          placeholder="••••••••••"
          icon={<LockIcon size={16} />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {errorMessage && (
        <p className="mb-4 text-[13px] font-medium text-red-600">{errorMessage}</p>
      )}

      <Button type="submit" disabled={isPending} className="w-full px-4 py-3">
        {isPending ? 'Signing in…' : 'Sign in to admin'}
        {!isPending && <ArrowIcon size={14} />}
      </Button>

      <div className="mt-6 flex items-center justify-center gap-2">
        <a href="#" className="text-xs font-semibold text-muted">
          Teacher portal
        </a>
        <span className="text-xs text-muted">·</span>
        <a href="#" className="text-xs font-semibold text-muted">
          Student portal
        </a>
      </div>
    </form>
  );
}
