/**
 * Options accepted when setting a cookie — mirrors the options supported by
 * Next.js' server `cookies().set(...)`.
 */
export interface CookieOptions {
  maxAge?: number;
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: boolean | 'lax' | 'strict' | 'none';
  priority?: 'low' | 'medium' | 'high';
  partitioned?: boolean;
}
