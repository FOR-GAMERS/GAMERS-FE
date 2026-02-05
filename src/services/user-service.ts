import { api } from "@/lib/api-client";
import { ApiResponse, PaginationResponse, UserResponse } from "@/types/api";

export const userService = {
  async getUsers(params?: { 
    page?: number; 
    page_size?: number; 
    search?: string; 
  }) {
    return api.get<ApiResponse<PaginationResponse<UserResponse>>>("/users", { params });
  },

  async getUser(id: number) {
    return api.get<ApiResponse<UserResponse>>(`/users/${id}`);
  },

  async updateUser(id: number, data: Partial<UserResponse>) {
    return api.put<ApiResponse<UserResponse>>(`/users/${id}`, data);
  },

  async deleteUser(id: number) {
    return api.delete<ApiResponse<void>>(`/users/${id}`);
  }
};
