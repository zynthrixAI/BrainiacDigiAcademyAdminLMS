'use client';

import { useQuery } from '@tanstack/react-query';
import { getProfile } from '@/lib/api/auth';
import { getAccessToken } from '@/lib/auth-session';

/** The signed-in admin's profile. Disabled when there's no access token (e.g.
 *  on the login screen). Drives identity + role-based UI gating. */
export const useProfile = () =>
  useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    enabled: typeof window !== 'undefined' && Boolean(getAccessToken()),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
