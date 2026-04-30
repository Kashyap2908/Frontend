import type { DecodedToken } from '@/types/auth.types';

const TOKEN_KEY = 'neuro_auth_token';
const REFRESH_TOKEN_KEY = 'neuro_refresh_token';
const SESSION_COOKIE = 'neuro_session';

// ── Access token ─────────────────────────────────────────────────────────────

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `${SESSION_COOKIE}=1; path=/; SameSite=Strict`;
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${SESSION_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

// ── Refresh token ─────────────────────────────────────────────────────────────

export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setRefreshToken = (token: string): void => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const removeRefreshToken = (): void => {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// ── Token utilities ───────────────────────────────────────────────────────────

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload as DecodedToken;
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return true;
  return decoded.exp * 1000 < Date.now();
};

// ── Clear all auth state ──────────────────────────────────────────────────────

export const clearAuthStorage = (): void => {
  removeToken();
  removeRefreshToken();
};
