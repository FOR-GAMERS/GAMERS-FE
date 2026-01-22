import { api } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';

export interface UploadResponse {
  url: string;
  uploaded_at: string;
}

export const storageService = {
  uploadContestBanner: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post<ApiResponse<UploadResponse>>('/v1/storage/contest-banner', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  uploadUserProfile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post<ApiResponse<UploadResponse>>('/v1/storage/user-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
    });
  }
};
