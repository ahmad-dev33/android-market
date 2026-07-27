import api from "./api";
import type { Notification, Review } from "@/types";

export const notificationsApi = {
  list: async () => {
    const { data } = await api.get<Notification[]>("/notifications/");
    return data;
  },

  registerDevice: async (token: string) => {
    await api.post("/notifications/register-device/", {
      token,
      platform: "android",
    });
  },

  markAsRead: async (id: number) => {
    await api.patch(`/notifications/${id}/read/`);
  },

  markAllRead: async () => {
    await api.post("/notifications/read-all/");
  },
};

export const reviewsApi = {
  productReviews: async (productId: number) => {
    const { data } = await api.get<Review[]>(
      `/products/${productId}/reviews/`
    );
    return data;
  },

  create: async (payload: {
    product: number;
    rating: number;
    title?: string;
    comment: string;
  }) => {
    const { data } = await api.post<Review>("/reviews/", payload);
    return data;
  },

  delete: async (id: number) => {
    await api.delete(`/reviews/${id}/`);
  },
};

export const couponsApi = {
  apply: async (code: string) => {
    const { data } = await api.post("/coupons/apply/", { code });
    return data;
  },

  remove: async () => {
    await api.delete("/coupons/remove/");
  },
};
