import { Platform } from "react-native";

const TOKEN_KEY = "auth_token";

const hasWindow = typeof window !== "undefined";

async function getSecureStore() {
  const mod = await import("expo-secure-store");
  return mod;
}

export async function getToken(): Promise<string | null> {
  if (Platform.OS === "web") {
    if (!hasWindow) return null;
    try {
      return window.localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }
  const SecureStore = await getSecureStore();
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
  if (Platform.OS === "web") {
    if (!hasWindow) return;
    window.localStorage.setItem(TOKEN_KEY, token);
    return;
  }
  const SecureStore = await getSecureStore();
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function deleteToken(): Promise<void> {
  if (Platform.OS === "web") {
    if (!hasWindow) return;
    window.localStorage.removeItem(TOKEN_KEY);
    return;
  }
  const SecureStore = await getSecureStore();
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}