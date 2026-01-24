import { api } from '@/lib/api-client';
import { 
  ApiResponse, 
  GameResponse, 
  CreateGameRequest, 
  UpdateGameRequest,
  PaginationResponse,
  ContestMemberResponse
} from '@/types/api';

export const gameService = {
  // Game Lifecycle
  async getGame(id: number) {
    return api.get<ApiResponse<GameResponse>>(`/games/${id}`);
  },

  async createGame(data: CreateGameRequest) {
    return api.post<ApiResponse<GameResponse>>('/games', data);
  },

  async updateGame(id: number, data: UpdateGameRequest) {
    return api.patch<ApiResponse<GameResponse>>(`/games/${id}`, data);
  },

  async deleteGame(id: number) {
    return api.delete<void>(`/games/${id}`);
  },

  async startGame(id: number) {
    return api.post<ApiResponse<GameResponse>>(`/games/${id}/start`);
  },

  async finishGame(id: number) {
    return api.post<ApiResponse<GameResponse>>(`/games/${id}/finish`);
  },

  async cancelGame(id: number) {
    return api.delete<ApiResponse<GameResponse>>(`/games/${id}/cancel`);
  },

  // Contest Games (Short-cut if not in contest-service, but usually handled there)
  async getContestGames(contestId: number) {
      return api.get<ApiResponse<GameResponse[]>>(`/contests/${contestId}/games`);
  },

  // Team Management within Game
  async getGameMembers(id: number) {
    return api.get<ApiResponse<ContestMemberResponse[]>>(`/games/${id}/members`);
  },

  async createGameTeam(id: number, data: { name?: string }) {
      return api.post<ApiResponse<any>>(`/games/${id}/team`, data);
  },

  async inviteToTeam(id: number, userId: number) {
      return api.post<ApiResponse<void>>(`/games/${id}/team/invite`, { userId });
  },

  async acceptInvitation(id: number) {
      return api.post<ApiResponse<void>>(`/games/${id}/team/invite/accept`);
  },

  async rejectInvitation(id: number) {
      return api.post<ApiResponse<void>>(`/games/${id}/team/invite/reject`);
  },

  async kickMember(id: number, userId: number) {
      return api.post<ApiResponse<void>>(`/games/${id}/team/kick`, { userId });
  },

  async leaveTeam(id: number) {
      return api.post<ApiResponse<void>>(`/games/${id}/team/leave`);
  },

  async finalizeTeams(id: number) {
      return api.post<ApiResponse<void>>(`/games/${id}/team/finalize`);
  },
  
  // Game Teams
  async getGameTeams(id: number) {
      return api.get<ApiResponse<any>>(`/games/${id}/game-teams`);
  }
};
