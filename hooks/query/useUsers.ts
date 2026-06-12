'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getUsers } from '@/lib/api/users';
import type { UsersQuery } from '@/types/user';

/** Paginated users list. Keeps previous page visible while the next loads. */
export const useUsers = (query: UsersQuery) =>
  useQuery({
    queryKey: ['users', query],
    queryFn: () => getUsers(query),
    placeholderData: keepPreviousData,
  });
