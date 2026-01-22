import { api } from '@/lib/api-client';
import { 
  ApiResponse, 
  PaginationResponse, 
  ContestResponse, 
  CreateContestRequest, 
  UpdateContestRequest,
  ContestStatus,
  ContestApplicationResponse,
  MyApplicationResponse,
  ContestMemberResponse,
  GameResponse
} from '@/types/api';
import { ContestPointResponse } from '@/types/valorant';

export const contestService = {
  async getContests(params?: { 
    page?: number; 
    page_size?: number; 
    sort_by?: string; 
    order?: 'asc' | 'desc'; 
  }) {
    return api.get<ApiResponse<PaginationResponse<ContestResponse>>>('/contests', { params });
  },

  async getMyContests(params?: { 
    page?: number; 
    page_size?: number; 
    sort_by?: string; 
    order?: 'asc' | 'desc';
    status?: ContestStatus;
  }) {
    return api.get<ApiResponse<PaginationResponse<ContestResponse>>>('/contests/me', { params });
  },

  async getContest(id: number) {
    return api.get<ApiResponse<ContestResponse>>(`/contests/${id}`);
  },

  async createContest(data: CreateContestRequest) {
    return api.post<ApiResponse<ContestResponse>>('/contests', data);
  },

  async updateContest(id: number, data: UpdateContestRequest) {
    return api.patch<ApiResponse<ContestResponse>>(`/contests/${id}`, data);
  },

  async deleteContest(id: number) {
    return api.delete<void>(`/contests/${id}`);
  },
  
  async startContest(id: number) {
    return api.post<ApiResponse<ContestResponse>>(`/contests/${id}/start`);
  },

  async stopContest(id: number) {
    return api.post<ApiResponse<ContestResponse>>(`/contests/${id}/stop`);
  },

  // Applications
  async getContestApplications(contestId: number) {
    return api.get<ApiResponse<ContestApplicationResponse[]>>(`/contests/${contestId}/applications`);
  },

  async applyContest(contestId: number) {
    return api.post<ApiResponse<void>>(`/contests/${contestId}/applications`);
  },

  async cancelApplication(contestId: number) {
    return api.delete<ApiResponse<void>>(`/contests/${contestId}/applications/cancel`);
  },

  async getMyApplicationStatus(contestId: number) {
      try {
        return await api.get<ApiResponse<MyApplicationResponse>>(`/contests/${contestId}/applications/me`);
      } catch (error: any) {
          if (error.status === 404) {
              return { data: { status: 'NONE' } } as ApiResponse<MyApplicationResponse>;
          }
          throw error;
      }
  },

  async withdrawContest(contestId: number) {
    return api.delete<ApiResponse<void>>(`/contests/${contestId}/applications/withdraw`);
  },

  async acceptApplication(contestId: number, userId: number) {
    return api.post<ApiResponse<void>>(`/contests/${contestId}/applications/${userId}/accept`);
  },

  async rejectApplication(contestId: number, userId: number) {
    return api.post<ApiResponse<void>>(`/contests/${contestId}/applications/${userId}/reject`);
  },

  // Members
  async getContestMembers(contestId: number, params?: { page?: number; page_size?: number }) {
    return api.get<ApiResponse<PaginationResponse<ContestMemberResponse>>>(`/contests/${contestId}/members`, { params });
  },

  // Games
  async getContestGames(contestId: number) {
      return api.get<ApiResponse<GameResponse[]>>(`/contests/${contestId}/games`);
  },

  // Valorant Points
  async getContestPoint(contestId: number, scoreTableId: number) {
      return api.get<ApiResponse<ContestPointResponse>>(`/contests/${contestId}/valorant-point`, {
        params: { scoreTableId }
      });
  }
};
