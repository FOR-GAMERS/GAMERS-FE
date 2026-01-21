import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { valorantService } from '@/services/valorant-service';
import { RegisterValorantRequest } from '@/types/valorant';

export const VALORANT_KEYS = {
  all: ['valorant'] as const,
  info: () => [...VALORANT_KEYS.all, 'info'] as const,
};

export function useValorantInfo() {
  return useQuery({
    queryKey: VALORANT_KEYS.info(),
    queryFn: valorantService.getValorantInfo,
    retry: false, // Don't retry if 404 (not linked)
  });
}

export function useValorantMutations() {
  const queryClient = useQueryClient();

  const registerValorant = useMutation({
    mutationFn: (data: RegisterValorantRequest) => valorantService.registerValorant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VALORANT_KEYS.info() });
    },
  });

  const unlinkValorant = useMutation({
    mutationFn: () => valorantService.unlinkValorant(),
    onSuccess: () => {
      queryClient.setQueryData(VALORANT_KEYS.info(), null); // Clear data immediately
      queryClient.invalidateQueries({ queryKey: VALORANT_KEYS.info() });
    },
  });

  const refreshValorant = useMutation({
    mutationFn: () => valorantService.refreshValorant(),
    onSuccess: (response) => {
        // Ideally update with new data directly
        if (response?.data) {
             queryClient.setQueryData(VALORANT_KEYS.info(), response);
        } else {
             queryClient.invalidateQueries({ queryKey: VALORANT_KEYS.info() });
        }
    },
  });

  return {
    registerValorant,
    unlinkValorant,
    refreshValorant,
  };
}
