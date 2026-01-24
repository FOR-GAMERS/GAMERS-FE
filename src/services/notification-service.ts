import { api } from '@/lib/api-client';
import { ApiResponse, NotificationListResponse } from '@/types/api';

export const notificationService = {
  async getNotifications(params?: { page?: number; page_size?: number; only_unread?: boolean }) {
    return api.get<ApiResponse<NotificationListResponse>>('/notifications', { params });
  },

  async markAsRead(id: number) {
    return api.patch<ApiResponse<void>>(`/notifications/${id}/read`);
  },

  async markAllAsRead() {
    return api.patch<ApiResponse<void>>('/notifications/read-all');
  },

  getStreamUrl() {
    // Determine base URL based on environment or api-client convention
    // Since api-client uses /api/proxy, we should target that through the proxy as well
    // to ensure cookies are passed correctly.
    // The middleware likely rewrites /api/proxy/* to BACKEND/*
    // Our backend SSE endpoint is /api/notifications/stream
    // So we should call /api/proxy/notifications/stream
    return '/api/proxy/notifications/stream';
  }
};
