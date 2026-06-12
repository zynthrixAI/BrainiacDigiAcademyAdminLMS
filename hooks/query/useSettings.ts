'use client';

import { useQuery } from '@tanstack/react-query';
import { getMaintenance, getMarquee } from '@/lib/api/settings';

/** Fetches the maintenance-mode settings block. */
export const useMaintenanceSettings = () =>
  useQuery({
    queryKey: ['settings', 'maintenance'],
    queryFn: getMaintenance,
  });

/** Fetches the marquee-banner settings block. */
export const useMarqueeSettings = () =>
  useQuery({
    queryKey: ['settings', 'marquee'],
    queryFn: getMarquee,
  });
