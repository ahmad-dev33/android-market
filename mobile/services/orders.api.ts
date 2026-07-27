import api from "./api";
import type { Order } from "@/types";

export const ordersApi = {
  list: async (status?: string) => {
    const params = status ? { status } : {};
    const { data } = await api.get<Order[]>("/orders/", { params });
    return data;
  },

  detail: async (id: number) => {
    const { data } = await api.get<Order>(`/orders/${id}/`);
    return data;
  },

  checkout: async (payload: {
    shipping_address: Record<string, string>;
    billing_address?: Record<string, string>;
    notes?: string;
  }) => {
    const { data } = await api.post<Order>("/orders/checkout/", payload);
    return data;
  },

  updateStatus: async (orderId: number, status: string) => {
    const { data } = await api.patch<Order>(`/orders/${orderId}/status/`, {
      status,
    });
    return data;
  },
};
