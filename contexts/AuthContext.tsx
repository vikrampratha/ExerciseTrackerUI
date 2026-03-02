import { login, setAuthToken } from "@/services/auth";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const TOKEN_KEY = "auth_token";

type AuthContextValue = {
  token: string | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<{ ok: true } | { ok: false; message: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await SecureStore.getItemAsync(TOKEN_KEY);
        setToken(stored ?? null);
        setAuthToken(stored ?? null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      const data = await login(username.trim(), password);
      await SecureStore.setItemAsync(TOKEN_KEY, data.token);

      setToken(data.token);
      setAuthToken(data.token);

      return { ok: true as const };
    } catch (e: any) {
      console.error(e);
      const message =
        e?.response?.status === 401
          ? "Invalid credentials"
          : "Login failed. Check server connection.";
      return { ok: false as const, message };
    }
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setToken(null);
    setAuthToken(null);
  };

  const value = useMemo(() => ({ token, loading, signIn, signOut }), [token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}