import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const TOKEN_KEY = "auth_token";

type AuthContextValue = {
  token: string | null;
  loading: boolean;
  signInMock: (username: string, password: string) => Promise<{ ok: true } | { ok: false; message: string }>;
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
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signInMock = async (username: string, password: string) => {
    if (username !== "admin" || password !== "admin") {
      return { ok: false as const, message: "Invalid credentials" };
    }

    // todo: replace mock JWT token with backend token
    const fakeJwt = "mock.jwt.token";

    await SecureStore.setItemAsync(TOKEN_KEY, fakeJwt);
    setToken(fakeJwt);

    return { ok: true as const };
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setToken(null);
  };

  const value = useMemo(() => ({ token, loading, signInMock, signOut }), [token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}