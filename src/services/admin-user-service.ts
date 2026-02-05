import { api } from "@/lib/api-client";
import { ApiResponse, PaginationResponse, UserResponse, UpdateUserInfoRequest } from "@/types/api";

export const adminUserService = {
  // Admin: List all users
  async getUsers(params: { page: number; page_size: number; search?: string }) {
    return api.get<ApiResponse<PaginationResponse<UserResponse>>>("/users", { params });
  },

  // Admin: Get specific user
  async getUser(id: number) {
    return api.get<ApiResponse<UserResponse>>(`/users/${id}`);
  },

  // Admin: Update user info
  async updateUser(id: number, data: UpdateUserInfoRequest) {
    return api.put<ApiResponse<UserResponse>>(`/users/${id}`, data);
  },

  // Admin: Delete user
  async deleteUser(id: number) {
    return api.delete<ApiResponse<void>>(`/users/${id}`);
  }
};
