import { api } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';
import { 
  ValorantInfoResponse, 
  RegisterValorantRequest,
  CreateValorantScoreTableDto,
  ValorantScoreTableResponse
} from '@/types/valorant';

export const valorantService = {
  getValorantInfo: async () => {
    return api.get<ApiResponse<ValorantInfoResponse>>('/users/valorant');
  },

  registerValorant: async (data: RegisterValorantRequest) => {
    return api.post<ApiResponse<ValorantInfoResponse>>('/users/valorant', data);
  },

  unlinkValorant: async () => {
    return api.delete('/users/valorant');
  },

  refreshValorant: async () => {
    return api.post<ApiResponse<ValorantInfoResponse>>('/users/valorant/refresh');
  },

  createScoreTable: async (data: CreateValorantScoreTableDto) => {
    return api.post<ApiResponse<ValorantScoreTableResponse>>('/valorant/score-tables', data);
  }
};
