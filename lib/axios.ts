import axios, { isAxiosError, type InternalAxiosRequestConfig } from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  saveSession,
  clearSession,
} from '@/lib/auth-session';
import type { LoginResponse } from '@/types/auth';

const baseURL = process.env.NEXT_PUBLIC_API_URL;
const JSON_HEADERS = { 'Content-Type': 'application/json', accept: 'application/json' };

/**
 * Pre-configured axios instance. Reuse this everywhere — do not create a
 * second client. Base URL is read from `NEXT_PUBLIC_API_URL` (see .env.local).
 */
export const api = axios.create({ baseURL, headers: JSON_HEADERS });

// Attach the admin access token (set at login) to every request.
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Bare client with no interceptors — used only to rotate tokens, so the
 *  refresh call can never recurse back through the 401 handler below. */
const tokenClient = axios.create({ baseURL, headers: JSON_HEADERS });

const AUTH_PATHS = ['/admins/login', '/admins/refresh', '/admins/logout'];

let refreshInFlight: Promise<string | null> | null = null;

const rotateToken = async (): Promise<string | null> => {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;
  try {
    const { data } = await tokenClient.post<LoginResponse>('/admins/refresh', {
      refresh_token: refreshToken,
    });
    await saveSession(data);
    return data.access_token;
  } catch {
    return null;
  }
};

/** Single-flight refresh: concurrent 401s share one rotation so racing tabs
 *  / requests don't mutually invalidate each other's refresh token. */
const refreshAccessToken = (): Promise<string | null> => {
  if (!refreshInFlight) {
    refreshInFlight = rotateToken().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
};

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

// On a 401 from any authenticated call: refresh once and retry. If refresh
// fails, the session is dead — clear tokens and bounce to the login screen.
api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (isAxiosError(error)) {
      const original = error.config as RetriableConfig | undefined;
      const url = original?.url ?? '';
      const isAuthCall = AUTH_PATHS.some((path) => url.includes(path));

      if (error.response?.status === 401 && original && !original._retry && !isAuthCall) {
        original._retry = true;
        const token = await refreshAccessToken();
        if (token) {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        }
        await clearSession();
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  },
);
