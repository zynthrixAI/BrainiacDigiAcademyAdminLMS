import { setCookie, getCookie, deleteCookie } from '@/lib/actions/cookies';
import type { CookieOptions } from '@/types/cookies';
import type { LoginResponse } from '@/types/auth';

/**
 * Single source of truth for admin session tokens.
 * - access token: localStorage (sent as the Bearer header by the axios client)
 * - refresh token: httpOnly cookie (rotated on login/refresh, cleared on logout)
 */

export const ACCESS_TOKEN_KEY = 'bda_admin_token';
const REFRESH_COOKIE = 'refresh_token';

const REFRESH_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 60 * 60 * 24 * 30, // 30 days
};

export const getAccessToken = (): string | null =>
  typeof window !== 'undefined' ? localStorage.getItem(ACCESS_TOKEN_KEY) : null;

export const getRefreshToken = (): Promise<string | undefined> => getCookie(REFRESH_COOKIE);

/** Persist a fresh token pair after login or a successful refresh. */
export const saveSession = async (tokens: LoginResponse): Promise<void> => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
  }
  await setCookie(REFRESH_COOKIE, tokens.refresh_token, REFRESH_COOKIE_OPTIONS);
};

/** Drop both tokens (logout, or a dead/rotated refresh token). */
export const clearSession = async (): Promise<void> => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
  await deleteCookie(REFRESH_COOKIE);
};
