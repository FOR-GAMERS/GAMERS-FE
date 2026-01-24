import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { ApiResponse, UserResponse } from '@/types/api';

export const USER_KEYS = {
  all: ['users'] as const,
  me: () => [...USER_KEYS.all, 'me'] as const,
  byId: (id: number) => [...USER_KEYS.all, id] as const,
};

export function useMe() {
  return useQuery({
    queryKey: USER_KEYS.me(),
    queryFn: async () => {
        return await api.get<ApiResponse<UserResponse>>('/users/my', { requiresAuth: false });
    },
    retry: false,
  });
}
