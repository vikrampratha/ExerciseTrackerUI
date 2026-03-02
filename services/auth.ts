import { InternalAxiosRequestConfig } from 'axios';
import { api } from './api';

export type LoginResponse = { token: string };

let inMemoryToken: string | null = null;

export function setAuthToken(token: string | null) {
  inMemoryToken = token;

  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

// attach token even if changed mid-session
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const url = config.url ?? "";
  if (url.startsWith("/auth/")) return config;
  if (inMemoryToken) {
    (config.headers as any).Authorization = `Bearer ${inMemoryToken}`;
  }
  return config;
});


export async function login(username: string, password: string) {
  const res = await api.post<LoginResponse>("/auth/login", { username, password });
  return res.data; // { token }
}