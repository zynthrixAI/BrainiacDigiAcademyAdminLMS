import { api } from '@/lib/axios';
import type {
  MaintenanceMode,
  MaintenanceModeRequest,
  MarqueeBanner,
  MarqueeBannerRequest,
} from '@/types/settings';

/**
 * Global platform settings. The backend keeps a single "global" document and
 * lazily creates it on first read, so there is no create flow — GET always
 * returns a document. Both PUTs are full replacements (no PATCH): send the
 * whole block back, omitted fields become null.
 */

/** Current maintenance-mode block. */
export const getMaintenance = async (): Promise<MaintenanceMode> => {
  const { data } = await api.get<MaintenanceMode>('/admins/settings/maintenance');
  return data;
};

/** Replace the maintenance-mode block. */
export const updateMaintenance = async (
  body: MaintenanceModeRequest,
): Promise<MaintenanceMode> => {
  const { data } = await api.put<MaintenanceMode>('/admins/settings/maintenance', body);
  return data;
};

/** Current marquee-banner block. */
export const getMarquee = async (): Promise<MarqueeBanner> => {
  const { data } = await api.get<MarqueeBanner>('/admins/settings/marquee');
  return data;
};

/** Replace the marquee-banner block. */
export const updateMarquee = async (
  body: MarqueeBannerRequest,
): Promise<MarqueeBanner> => {
  const { data } = await api.put<MarqueeBanner>('/admins/settings/marquee', body);
  return data;
};
