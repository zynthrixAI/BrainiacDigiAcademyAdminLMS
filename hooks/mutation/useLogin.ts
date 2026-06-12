'use client';

import { useMutation } from '@tanstack/react-query';
import { login } from '@/lib/api/auth';
import type { LoginCredentials, LoginResponse } from '@/types/auth';

/**
 * Mutation hook for admin sign in. Wraps the client-side `login` API call.
 * Consumers read `mutate`, `isPending`, `error`.
 */
export const useLogin = () =>
  useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: login,
  });
