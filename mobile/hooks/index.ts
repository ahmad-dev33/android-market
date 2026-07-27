import { useEffect } from "react";
import { useAppStore } from "@/store";

export function useAuth() {
  const { user, isAuthenticated, isLoading, login, register, logout, loadUser } =
    useAppStore();

  useEffect(() => {
    loadUser();
  }, []);

  return { user, isAuthenticated, isLoading, login, register, logout };
}

export function useCart() {
  const { cart, cartItemCount, fetchCart, addToCart, removeFromCart, clearCart } =
    useAppStore();
  return { cart, cartItemCount, fetchCart, addToCart, removeFromCart, clearCart };
}

export function useNotifications() {
  const { notifications, unreadCount, fetchNotifications, markNotificationRead } =
    useAppStore();
  return { notifications, unreadCount, fetchNotifications, markNotificationRead };
}
