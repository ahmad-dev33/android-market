import api from "./api";
import type { Cart } from "@/types";

export const cartApi = {
  get: async () => {
    const { data } = await api.get<Cart>("/cart/");
    return data;
  },

  addItem: async (productId: number, quantity: number, variantId?: number) => {
    const { data } = await api.post("/cart/items/", {
      product_id: productId,
      quantity,
      variant_id: variantId || null,
    });
    return data;
  },

  updateItem: async (itemId: number, quantity: number) => {
    const { data } = await api.put(`/cart/items/${itemId}/`, { quantity });
    return data;
  },

  removeItem: async (itemId: number) => {
    await api.delete(`/cart/items/${itemId}/remove/`);
  },

  clear: async () => {
    await api.delete("/cart/clear/");
  },
};
