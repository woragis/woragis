/**
 * Cookie utilities for browser cookie management
 * Provides type-safe, error-handled access to browser cookies
 */

export interface CookieOptions {
  expires?: Date | number; // Date object or days from now
  maxAge?: number; // seconds
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * Set a cookie with the given name, value, and options
 */
export function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): void {
  if (typeof document === 'undefined') {
    console.warn('setCookie: Document is not available (SSR environment)');
    return;
  }

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  // Handle expires
  if (options.expires) {
    if (typeof options.expires === 'number') {
      const date = new Date();
      date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
      cookieString += `; expires=${date.toUTCString()}`;
    } else {
      cookieString += `; expires=${options.expires.toUTCString()}`;
    }
  }

  // Handle maxAge
  if (options.maxAge !== undefined) {
    cookieString += `; max-age=${options.maxAge}`;
  }

  // Handle path
  if (options.path) {
    cookieString += `; path=${options.path}`;
  }

  // Handle domain
  if (options.domain) {
    cookieString += `; domain=${options.domain}`;
  }

  // Handle secure
  if (options.secure) {
    cookieString += '; secure';
  }

  // Handle httpOnly
  if (options.httpOnly) {
    cookieString += '; httponly';
  }

  // Handle sameSite
  if (options.sameSite) {
    cookieString += `; samesite=${options.sameSite}`;
  }

  document.cookie = cookieString;
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    console.warn('getCookie: Document is not available (SSR environment)');
    return null;
  }

  const nameEQ = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }

  return null;
}

/**
 * Remove a cookie by setting its expiration date to the past
 */
export function removeCookie(name: string, options: Pick<CookieOptions, 'path' | 'domain'> = {}): void {
  setCookie(name, '', {
    ...options,
    expires: new Date(0),
  });
}

/**
 * Get all cookies as an object
 */
export function getAllCookies(): Record<string, string> {
  if (typeof document === 'undefined') {
    console.warn('getAllCookies: Document is not available (SSR environment)');
    return {};
  }

  const cookies: Record<string, string> = {};
  const cookieStrings = document.cookie.split(';');

  for (let cookie of cookieStrings) {
    cookie = cookie.trim();
    const [name, value] = cookie.split('=');
    if (name && value) {
      cookies[decodeURIComponent(name)] = decodeURIComponent(value);
    }
  }

  return cookies;
}

/**
 * Check if cookies are enabled in the browser
 */
export function areCookiesEnabled(): boolean {
  if (typeof document === 'undefined') {
    return false;
  }

  try {
    const testCookie = 'cookie-test';
    setCookie(testCookie, 'test');
    const enabled = getCookie(testCookie) === 'test';
    removeCookie(testCookie);
    return enabled;
  } catch {
    return false;
  }
}

/**
 * Set a cookie for authentication with secure defaults
 */
export function setAuthCookie(token: string, options: Partial<CookieOptions> = {}): void {
  setCookie('auth-token', token, {
    httpOnly: true,
    secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    ...options,
  });
}

/**
 * Get an auth token from cookies
 */
export function getAuthCookie(): string | null {
  return getCookie('auth-token');
}

/**
 * Remove an auth cookie
 */
export function removeAuthCookie(): void {
  removeCookie('auth-token');
}
