import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lolService } from '@/services/lol-service';
import { RegisterLOLRequest } from '@/types/lol';

export const LOL_KEYS = {
  all: ['lol'] as const,
  info: () => [...LOL_KEYS.all, 'info'] as const,
};

export function useLOLInfo() {
  return useQuery({
    queryKey: LOL_KEYS.info(),
    queryFn: () => lolService.getLOLInfo(),
    retry: false,
  });
}

export function useLOLMutations() {
  const queryClient = useQueryClient();

  const registerLOL = useMutation({
    mutationFn: (data: RegisterLOLRequest) => lolService.registerLOL(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOL_KEYS.info() });
    },
  });

  const unlinkLOL = useMutation({
    mutationFn: () => lolService.unlinkLOL(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOL_KEYS.info() });
    },
  });

  const refreshLOL = useMutation({
    mutationFn: () => lolService.refreshLOL(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOL_KEYS.info() });
    },
  });

  return {
    registerLOL,
    unlinkLOL,
    refreshLOL,
  };
}
