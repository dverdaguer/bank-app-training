/* eslint-disable @typescript-eslint/no-unused-vars */
// src/utils/jwt.ts
// Utility functions for handling JWT in the frontend

export function setToken(token: string) {
  localStorage.setItem('jwt_token', token);
}

export function getToken(): string | null {
  return localStorage.getItem('jwt_token');
}

export function removeToken() {
  localStorage.removeItem('jwt_token');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function decodeToken(token: string): any {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(decoded)));
  } catch (e) {
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getPayload(): any {
  const token = getToken();
  if (!token) return null;
  return decodeToken(token);
}
