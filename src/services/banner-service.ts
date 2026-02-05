import { api } from "@/lib/api-client";
import { Banner, BannerResponse, CreateBannerRequest, UpdateBannerRequest } from "@/types/api";

export const bannerService = {
  getAdminBanners: async () => {
    return api.get<{ data: BannerResponse }>("/admin/banners");
  },

  createBanner: async (data: CreateBannerRequest) => {
    return api.post<{ data: Banner }>("/admin/banners", data);
  },

  updateBanner: async (id: number, data: UpdateBannerRequest) => {
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
