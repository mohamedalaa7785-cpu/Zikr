import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  exp?: number;
  iat?: number;
  sub?: string;
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    if (!decoded.exp) return false;
    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
}

export function isTokenValid(token: string): boolean {
  if (!token || typeof token !== 'string') return false;
  return !isTokenExpired(token);
}

export function getTokenExpiration(token: string): number | null {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.exp ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
}