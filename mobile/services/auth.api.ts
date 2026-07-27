import api from "./api";
import type { User, AuthTokens, PaginatedResponse } from "@/types";

export const authApi = {
  register: async (payload: {
    email: string;
    username: string;
    password: string;
    password_confirm: string;
    first_name?: string;
    last_name?: string;
  }) => {
    const { data } = await api.post<{
      user: User;
      tokens: AuthTokens;
    }>("/auth/register/", payload);
    return data;
  },

  login: async (payload: { email: string; password: string }) => {
    const { data } = await api.post<{
      user: User;
      tokens: AuthTokens;
    }>("/auth/login/", payload);
    return data;
  },

  logout: async (refreshToken: string) => {
    await api.post("/auth/logout/", { refresh: refreshToken });
  },

  getProfile: async () => {
    const { data } = await api.get<User>("/auth/profile/");
    return data;
  },

  updateProfile: async (payload: Partial<User>) => {
    const { data } = await api.patch<User>("/auth/profile/", payload);
    return data;
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    await api.post("/auth/change-password/", {
      old_password: oldPassword,
      new_password: newPassword,
    });
  },

  requestPasswordReset: async (email: string) => {
    await api.post("/auth/password-reset/", { email });
  },
};
