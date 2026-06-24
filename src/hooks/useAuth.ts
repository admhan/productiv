import { useState, useCallback } from 'react';
import type { AuthRole } from '../types';

const AUTH_KEY = 'productiv-auth';
const OWNER_PIN = '04101920';

interface AuthState {
  authenticated: boolean;
  role: AuthRole;
}

function getStoredAuth(): AuthState {
  const raw = sessionStorage.getItem(AUTH_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as AuthState;
    } catch {
      return { authenticated: false, role: 'guest' };
    }
  }
  return { authenticated: false, role: 'guest' };
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>(getStoredAuth);

  const login = useCallback((pin: string): boolean => {
    if (pin === OWNER_PIN) {
      const state: AuthState = { authenticated: true, role: 'owner' };
      sessionStorage.setItem(AUTH_KEY, JSON.stringify(state));
      setAuth(state);
      return true;
    }
    return false;
  }, []);

  const enterGuest = useCallback(() => {
    const state: AuthState = { authenticated: true, role: 'guest' };
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(state));
    setAuth(state);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_KEY);
    setAuth({ authenticated: false, role: 'guest' });
  }, []);

  const isOwner = auth.role === 'owner';

  return { authenticated: auth.authenticated, role: auth.role, isOwner, login, enterGuest, logout };
}
