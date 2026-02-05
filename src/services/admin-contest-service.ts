import { api } from "@/lib/api-client";
import { 
  ApiResponse, 
  PaginationResponse, 
  ContestResponse, 
  CreateContestRequest, 
  UpdateContestRequest 
} from "@/types/api";

export const adminContestService = {
  // Admin: List all contests
  async getContests(params?: { 
    page?: number; 
    page_size?: number; 
    sort_by?: string; 
    order?: 'asc' | 'desc'; 
    title?: string;
  }) {
    return api.get<ApiResponse<PaginationResponse<ContestResponse>>>('/contests', { params });
  },

  // Admin: Get specific contest
  async getContest(id: number) {
    return api.get<ApiResponse<ContestResponse>>(`/contests/${id}`);
  },

  // Admin: Create contest
  async createContest(data: CreateContestRequest) {
    return api.post<ApiResponse<ContestResponse>>('/contests', data);
  },

  // Admin: Update contest
  async updateContest(id: number, data: UpdateContestRequest) {
    return api.patch<ApiResponse<ContestResponse>>(`/contests/${id}`, data);
  },

  // Admin: Delete contest
  async deleteContest(id: number) {
    return api.delete<void>(`/contests/${id}`);
  }
};
