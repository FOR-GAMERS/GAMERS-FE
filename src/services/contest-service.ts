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
  GameResponse,
  TeamResponse,
  CreateTeamRequest,
  ScheduleGameRequest
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

  async applyContest(contestId: number, data?: { point?: number; current_tier?: string; peak_tier?: string }) {
    return api.post<ApiResponse<void>>(`/contests/${contestId}/applications`, data);
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
  async getContestMembers(contestId: number, params?: { 
    page?: number; 
    page_size?: number;
    sort_by?: string;
    order?: 'asc' | 'desc';
    search?: string;
  }) {
    return api.get<ApiResponse<PaginationResponse<ContestMemberResponse>>>(`/contests/${contestId}/members`, { params });
  },

  async changeMemberRole(contestId: number, userId: number, role: 'NORMAL' | 'STAFF' | 'LEADER') {
    return api.patch<ApiResponse<void>>(`/contests/${contestId}/members/${userId}/role`, { role });
  },


  // Games & Teams
  // Teams (New Implementation)
  async getTeam(contestId: number) {
    return api.get<ApiResponse<TeamResponse>>(`/contests/${contestId}/team`);
  },

  async createTeam(contestId: number, data?: CreateTeamRequest) {
    return api.post<ApiResponse<TeamResponse>>(`/contests/${contestId}/team`, data);
  },

  async inviteMember(contestId: number, userId: number) {
    return api.post<ApiResponse<void>>(`/contests/${contestId}/team/invite`, { user_id: userId });
  },

  async acceptInvite(contestId: number, token: string) { // Assuming token based or just query param
      // Swagger says POST /api/contests/{id}/team/invite/accept
      // Check swagger for parameters. It seemed to be a POST.
      return api.post<ApiResponse<void>>(`/contests/${contestId}/team/invite/accept`); 
  },

  async deleteTeam(contestId: number) {
    return api.delete<ApiResponse<void>>(`/contests/${contestId}/team`);
  },

  async finalizeTeam(contestId: number) {
      return api.post<ApiResponse<TeamResponse>>(`/contests/${contestId}/team/finalize`);
  },

  // Legacy Game Methods (Keep if needed for backward compat or specific game actions)
  async getContestGames(contestId: number) {
      return api.get<ApiResponse<GameResponse[]>>(`/contests/${contestId}/games`);
  },

  async scheduleGame(contestId: number, gameId: number, data: ScheduleGameRequest) {
      return api.put<ApiResponse<GameResponse>>(`/contests/${contestId}/games/${gameId}/schedule`, data);
  },

  async getGameMembers(gameId: number) {
      return api.get<ApiResponse<{
          discord_id: string;
          game_id: number;
          member_type: string;
          tag: string;
          team_id: number;
          user_id: number;
          username: string;
          avatar?: string;
      }[]>>(`/games/${gameId}/members`);
  },

  async inviteUserToTeam(gameId: number, userId: number) {
      return api.post<ApiResponse<void>>(`/games/${gameId}/team/invite`, { user_id: userId });
  },

  async leaveTeam(gameId: number) {
      return api.post<ApiResponse<void>>(`/games/${gameId}/team/leave`);
  },

  // Valorant Points
  async getContestPoint(contestId: number, scoreTableId: number) {
      return api.get<ApiResponse<ContestPointResponse>>(`/contests/${contestId}/valorant-point`, {
        params: { scoreTableId }
      });
  },
  // Status
  async getMyContestStatus(contestId: number) {
    return api.get<ApiResponse<{
        is_leader: boolean;
        is_member: boolean;
        has_applied: boolean;
        application_status: string;
        member_type: 'NORMAL' | 'STAFF' | 'LEADER';
    }>>(`/contests/${contestId}/status/me`);
  },
};

