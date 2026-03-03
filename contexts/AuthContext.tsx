import { login, setAuthToken } from "@/services/auth";
import { deleteToken, getToken, setToken } from "@/services/tokenStorage";
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
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await getToken();
        setTokenState(stored ?? null);
        setAuthToken(stored ?? null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      const { token } = await login(username.trim(), password);
      await setToken(token);

      setTokenState(token);
      setAuthToken(token);

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
    await deleteToken();
    setTokenState(null);
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