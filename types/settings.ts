/** Global platform settings (singleton, keyed "global" on the backend). */

/** Maintenance-mode block as returned by the API. */
export interface MaintenanceMode {
  is_enabled: boolean;
  /** ISO-8601 UTC; informational only — the backend does not auto-toggle. */
  start_at: string | null;
  end_at: string | null;
}

/** PUT body for maintenance mode — full replacement, not a patch. */
export interface MaintenanceModeRequest {
  is_enabled: boolean;
  start_at?: string | null;
  end_at?: string | null;
}

/** Marquee-banner block as returned by the API. */
export interface MarqueeBanner {
  is_enabled: boolean;
  message: string | null;
}

/** PUT body for the marquee banner — full replacement, not a patch. */
export interface MarqueeBannerRequest {
  is_enabled: boolean;
  message?: string | null;
}
