import { api } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';
import { 
  LOLInfoResponse, 
  RegisterLOLRequest
} from '@/types/lol';

export const lolService = {
  getLOLInfo: async () => {
    return api.get<ApiResponse<LOLInfoResponse>>('/users/lol');
  },

  registerLOL: async (data: RegisterLOLRequest) => {
    return api.post<ApiResponse<LOLInfoResponse>>('/users/lol', data);
  },

  unlinkLOL: async () => {
    return api.delete('/users/lol');
  },

  refreshLOL: async () => {
    return api.post<ApiResponse<LOLInfoResponse>>('/users/lol/refresh');
  }
};
