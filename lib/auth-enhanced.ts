/**
 * Enhanced Authentication Utilities
 * Provides robust session management and token validation
 */

import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  exp?: number;
  iat?: number;
  sub?: string;
  email?: string;
  role?: string;
}

interface SessionData {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  user?: {
    id: string;
    email: string;
  };
}

const TOKEN_BUFFER = 60; // Refresh token 60 seconds before expiry

/**
 * Check if a token is expired
 */
export function isTokenExpired(token: string | null | undefined): boolean {
  if (!token || typeof token !== 'string') return true;
  
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    if (!decoded.exp) return false; // No expiry means valid
    
    // Add buffer to refresh before actual expiry
    const expiryTime = (decoded.exp * 1000) - (TOKEN_BUFFER * 1000);
    return Date.now() >= expiryTime;
  } catch (error) {
    console.warn('[auth] Failed to decode token:', error instanceof Error ? error.message : 'unknown error');
    return true;
  }
}

/**
 * Check if a token is valid (not expired and properly formatted)
 */
export function isTokenValid(token: string | null | undefined): boolean {
  if (!token || typeof token !== 'string') return false;
  return !isTokenExpired(token);
}

/**
 * Get token expiration time in milliseconds
 */
export function getTokenExpiration(token: string | null | undefined): number | null {
  if (!token || typeof token !== 'string') return null;
  
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.exp ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
}

/**
 * Get time until token expires in seconds
 */
export function getTokenTimeRemaining(token: string | null | undefined): number | null {
  const expiration = getTokenExpiration(token);
  if (!expiration) return null;
  
  const remaining = Math.floor((expiration - Date.now()) / 1000);
  return remaining > 0 ? remaining : 0;
}

/**
 * Decode token to get user info
 */
export function decodeToken(token: string | null | undefined) {
  if (!token || typeof token !== 'string') return null;
  
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
      expiresAt: decoded.exp ? decoded.exp * 1000 : null,
    };
  } catch {
    return null;
  }
}

/**
 * Validate session data structure
 */
export function isValidSessionData(data: unknown): data is SessionData {
  if (!data || typeof data !== 'object') return false;
  
  const session = data as Record<string, unknown>;
  return (
    typeof session.accessToken === 'string' &&
    typeof session.expiresAt === 'number' &&
    (!session.refreshToken || typeof session.refreshToken === 'string')
  );
}

/**
 * Create session data from tokens
 */
export function createSessionData(
  accessToken: string,
  refreshToken?: string,
  expiresIn?: number
): SessionData {
  const expiresAt = Date.now() + ((expiresIn || 3600) * 1000);
  
  return {
    accessToken,
    refreshToken,
    expiresAt,
    user: decodeToken(accessToken) as any,
  };
}

/**
 * Check if session needs refresh
 */
export function shouldRefreshSession(session: SessionData | null): boolean {
  if (!session) return false;
  
  const timeRemaining = session.expiresAt - Date.now();
  // Refresh if less than 5 minutes remaining
  return timeRemaining < 5 * 60 * 1000;
}

/**
 * Validate OAuth callback response
 */
export function validateOAuthResponse(hash: string) {
  try {
    const params = new URLSearchParams(hash.replace(/^#/, ''));
    
    const error = params.get('error');
    const errorDescription = params.get('error_description');
    
    if (error) {
      throw new Error(errorDescription || error);
    }
    
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const expiresIn = params.get('expires_in');
    
    if (!accessToken) {
      throw new Error('تعذر الحصول على رمز الوصول من Supabase. يرجى المحاولة مرة أخرى.');
    }
    
    return {
      accessToken,
      refreshToken: refreshToken || undefined,
      expiresIn: expiresIn ? parseInt(expiresIn, 10) : undefined,
    };
  } catch (error) {
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'حدث خطأ في معالجة رد الاتصال من Google. يرجى المحاولة مرة أخرى.'
    );
  }
}

/**
 * Build OAuth redirect URI
 */
export function buildOAuthRedirectUri(baseUrl: string, nextPath?: string): string {
  const url = new URL('/auth/callback', baseUrl);
  if (nextPath) {
    url.searchParams.set('next', nextPath);
  }
  return url.toString();
}

/**
 * Extract next redirect path from URL
 */
export function extractNextPath(searchParams: URLSearchParams): string {
  const next = searchParams.get('next');
  
  // Validate next path to prevent open redirect
  if (!next) return '/profile';
  
  try {
    const url = new URL(next, 'http://localhost');
    // Only allow relative paths
    if (url.pathname.startsWith('/')) {
      return url.pathname + url.search;
    }
  } catch {
    // Invalid URL, use default
  }
  
  return '/profile';
}
