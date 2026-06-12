'use client';

import { useQuery } from '@tanstack/react-query';
import { getAdmins } from '@/lib/api/admins';

/** All admin accounts (superadmin only). Pass `enabled=false` to skip the call
 *  for plain admins (who would get a 403). */
export const useAdmins = (enabled = true) =>
  useQuery({
    queryKey: ['admins'],
    queryFn: getAdmins,
    enabled,
  });
