"use client";

/**
 * Auth context + useAuth hook.
 *
 * Wraps the apiClient token store. Provides:
 *   - user: User | null
 *   - isLoading: boolean
 *   - login / register / logout
 *
 * Usage: wrap your portal layouts with <AuthProvider> and call useAuth() in
 * any Client Component descendant.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { User, LoginDto, RegisterDto, AuthResponse } from "@freightbridge/shared-types";
import { authApi, ApiClientError } from "./apiClient";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (dto: LoginDto) => Promise<AuthResponse>;
  register: (dto: RegisterDto) => Promise<AuthResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hydrate current user on mount — avoids SSR mismatch by only running client-side
  useEffect(() => {
    let cancelled = false;
    authApi
      .me()
      .then((u) => {
        if (!cancelled) setUser(u);
      })
      .catch(() => {
        // Token missing / expired — not an error state, just unauthenticated
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (dto: LoginDto): Promise<AuthResponse> => {
    setError(null);
    try {
      const res = await authApi.login(dto);
      setUser(res.user);
      return res;
    } catch (err) {
      const msg = err instanceof ApiClientError ? err.message : "Login failed";
      setError(msg);
      throw err;
    }
  }, []);

  const register = useCallback(async (dto: RegisterDto): Promise<AuthResponse> => {
    setError(null);
    try {
      const res = await authApi.register(dto);
      setUser(res.user);
      return res;
    } catch (err) {
      const msg = err instanceof ApiClientError ? err.message : "Registration failed";
      setError(msg);
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
