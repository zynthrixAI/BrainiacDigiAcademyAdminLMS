'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMaintenance, updateMarquee } from '@/lib/api/settings';
import type { MaintenanceModeRequest, MarqueeBannerRequest } from '@/types/settings';

/** Saves the maintenance-mode block (full-replacement PUT). */
export const useUpdateMaintenance = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: MaintenanceModeRequest) => updateMaintenance(body),
    onSuccess: (data) => {
      qc.setQueryData(['settings', 'maintenance'], data);
    },
  });
};

/** Saves the marquee-banner block (full-replacement PUT). */
export const useUpdateMarquee = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: MarqueeBannerRequest) => updateMarquee(body),
    onSuccess: (data) => {
      qc.setQueryData(['settings', 'marquee'], data);
    },
  });
};
