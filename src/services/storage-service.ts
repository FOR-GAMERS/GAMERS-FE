import { api } from "@/lib/api-client";

export const storageService = {
  uploadContestBanner: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post<{ data: { image_key: string; url: string } }>("/storage/contest-banner", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
};
