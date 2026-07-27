import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import type { User, Cart, Notification } from "@/types";
import { authApi } from "@/services/auth.api";
import { cartApi } from "@/services/cart.api";
import { notificationsApi } from "@/services/notifications.api";

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  cart: Cart | null;
  cartItemCount: number;

  notifications: Notification[];
  unreadCount: number;

  login: (email: string, password: string) => Promise<void>;
  register: (payload: {
    email: string;
    username: string;
    password: string;
    password_confirm: string;
    first_name?: string;
    last_name?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;

  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;

  fetchNotifications: () => Promise<void>;
  markNotificationRead: (id: number) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  cart: null,
  cartItemCount: 0,

  notifications: [],
  unreadCount: 0,

  login: async (email, password) => {
    const { user, tokens } = await authApi.login({ email, password });
    await AsyncStorage.setItem("access_token", tokens.access);
    await AsyncStorage.setItem("refresh_token", tokens.refresh);
    await AsyncStorage.setItem("user", JSON.stringify(user));
    set({ user, isAuthenticated: true });
    get().fetchCart();
  },

  register: async (payload) => {
    const { user, tokens } = await authApi.register(payload);
    await AsyncStorage.setItem("access_token", tokens.access);
    await AsyncStorage.setItem("refresh_token", tokens.refresh);
    await AsyncStorage.setItem("user", JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },

  logout: async () => {
    const refreshToken = await AsyncStorage.getItem("refresh_token");
    if (refreshToken) {
      try {
        await authApi.logout(refreshToken);
      } catch {}
    }
    await AsyncStorage.multiRemove(["access_token", "refresh_token", "user"]);
    set({
      user: null,
      isAuthenticated: false,
      cart: null,
      cartItemCount: 0,
      notifications: [],
      unreadCount: 0,
    });
  },

  loadUser: async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        set({ isLoading: false });
        return;
      }
      const user = await authApi.getProfile();
      await AsyncStorage.setItem("user", JSON.stringify(user));
      set({ user, isAuthenticated: true, isLoading: false });
      get().fetchCart();
      get().fetchNotifications();
    } catch {
      await AsyncStorage.multiRemove(["access_token", "refresh_token", "user"]);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  updateProfile: async (data) => {
    const user = await authApi.updateProfile(data);
    await AsyncStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },

  fetchCart: async () => {
    try {
      const cart = await cartApi.get();
      set({ cart, cartItemCount: cart.total_items });
    } catch {}
  },

  addToCart: async (productId, quantity = 1) => {
    await cartApi.addItem(productId, quantity);
    await get().fetchCart();
  },

  removeFromCart: async (itemId) => {
    await cartApi.removeItem(itemId);
    await get().fetchCart();
  },

  clearCart: async () => {
    await cartApi.clear();
    set({ cart: null, cartItemCount: 0 });
  },

  fetchNotifications: async () => {
    try {
      const notifications = await notificationsApi.list();
      const unreadCount = notifications.filter((n) => !n.is_read).length;
      set({ notifications, unreadCount });
    } catch {}
  },

  markNotificationRead: async (id) => {
    await notificationsApi.markAsRead(id);
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, is_read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },
}));
