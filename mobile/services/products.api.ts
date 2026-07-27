import api from "./api";
import type { Product, Category, PaginatedResponse } from "@/types";

export const productsApi = {
  list: async (params?: Record<string, string | number>) => {
    const { data } = await api.get<PaginatedResponse<Product>>("/products/", {
      params,
    });
    return data;
  },

  detail: async (idOrSlug: string) => {
    const { data } = await api.get<Product>(`/products/${idOrSlug}/`);
    return data;
  },

  featured: async () => {
    const { data } = await api.get<Product[]>("/products/featured/");
    return data;
  },

  search: async (query: string) => {
    const { data } = await api.get<Product[]>(`/products/search/?q=${query}`);
    return data;
  },

  categories: async () => {
    const { data } = await api.get<Category[]>("/categories/");
    return data;
  },

  create: async (formData: FormData) => {
    const { data } = await api.post<Product>("/products/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  update: async (id: number, formData: FormData) => {
    const { data } = await api.patch<Product>(`/products/${id}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  delete: async (id: number) => {
    await api.delete(`/products/${id}/`);
  },
};
