import api from "./api";
import type { Vendor } from "@/types";

export const vendorApi = {
  register: async (payload: {
    store_name: string;
    slug: string;
    description?: string;
    phone?: string;
    email?: string;
  }) => {
    const { data } = await api.post<Vendor>("/vendor/register/", payload);
    return data;
  },

  dashboard: async () => {
    const { data } = await api.get<Vendor & { total_revenue: number; total_orders: number }>(
      "/vendor/dashboard/"
    );
    return data;
  },

  list: async () => {
    const { data } = await api.get<Vendor[]>("/vendor/");
    return data;
  },

  detail: async (slug: string) => {
    const { data } = await api.get<Vendor>(`/vendor/${slug}/`);
    return data;
  },
};
