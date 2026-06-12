'use client';

import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/lib/api/users';

/** Fetch a single user by id. Disabled until an id is provided. */
export const useUser = (id: string | null) =>
  useQuery({
    queryKey: ['user', id],
    queryFn: () => getUser(id as string),
    enabled: id !== null,
  });
