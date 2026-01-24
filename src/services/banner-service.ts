import { api } from "@/lib/api-client";
// import { BannerResponse, CreateBannerRequest, UpdateBannerRequest } from "@/types/api"; 
// Note: Since types/api might not have these specific definitions generated yet, I will define them here locally or in a types file if needed.
// Checking swagger again, the types should ideally be in types/api.ts if generated. Use `any` or define interfaces if missing.

export interface Banner {
  id: number;
  title: string;
  link_url: string;
  image_key: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  modified_at: string;
}

export interface CreateBannerDto {
  title: string;
  link_url: string;
  image_key: string;
  is_active: boolean;
  display_order: number;
}

export interface UpdateBannerDto {
  title?: string;
  link_url?: string;
  image_key?: string;
  is_active?: boolean;
  display_order?: number;
}

export const bannerService = {
  getAdminBanners: async () => {
    return api.get<{ data: { banners: Banner[] } }>("/admin/banners");
  },

  createBanner: async (data: CreateBannerDto) => {
    return api.post<{ data: Banner }>("/admin/banners", data);
  },

  updateBanner: async (id: number, data: UpdateBannerDto) => {
    return api.patch<{ data: Banner }>(`/admin/banners/${id}`, data);
  },

  deleteBanner: async (id: number) => {
    return api.delete(`/admin/banners/${id}`);
  },

  // Helper to upload image if needed
  uploadBannerImage: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post<{ data: { image_key: string; url: string } }>("/storage/contest-banner", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
