import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { contestService } from '@/services/contest-service';
import { 
  CreateContestRequest, 
  UpdateContestRequest, 
  ContestStatus 
} from '@/types/api';
import { useRouter } from 'next/navigation';

export const CONTEST_KEYS = {
  all: ['contests'] as const,
  lists: () => [...CONTEST_KEYS.all, 'list'] as const,
  list: (params: any) => [...CONTEST_KEYS.lists(), params] as const,
  myLists: () => [...CONTEST_KEYS.all, 'my'] as const,
  myList: (params: any) => [...CONTEST_KEYS.myLists(), params] as const,
  details: () => [...CONTEST_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...CONTEST_KEYS.details(), id] as const,
  applications: (id: number) => [...CONTEST_KEYS.detail(id), 'applications'] as const,
  myApplication: (id: number) => [...CONTEST_KEYS.detail(id), 'my-application'] as const,
  members: (id: number, params: any) => [...CONTEST_KEYS.detail(id), 'members', params] as const,
  games: (id: number) => [...CONTEST_KEYS.detail(id), 'games'] as const,
};

export function useContests(params: { 
  page?: number; 
  page_size?: number; 
  sort_by?: string; 
  order?: 'asc' | 'desc'; 
  title?: string;
} = { page: 1, page_size: 10, sort_by: 'created_at', order: 'desc' }) {
  return useQuery({
    queryKey: CONTEST_KEYS.list(params),
    queryFn: () => contestService.getContests(params),
    placeholderData: keepPreviousData,
  });
}

export function useMyContests(params: { 
  page?: number; 
  page_size?: number; 
  sort_by?: string; 
  order?: 'asc' | 'desc'; 
  status?: ContestStatus;
} = { page: 1, page_size: 10, sort_by: 'created_at', order: 'desc' }) {
  return useQuery({
    queryKey: CONTEST_KEYS.myList(params),
    queryFn: () => contestService.getMyContests(params),
    placeholderData: keepPreviousData,
  });
}

export function useContest(id: number | null) {
  return useQuery({
    queryKey: CONTEST_KEYS.detail(id!),
    queryFn: () => contestService.getContest(id!),
    enabled: !!id,
  });
}

export function useContestApplications(id: number) {
  return useQuery({
    queryKey: CONTEST_KEYS.applications(id),
    queryFn: () => contestService.getContestApplications(id),
    enabled: !!id,
  });
}

export function useMyApplicationStatus(id: number) {
  return useQuery({
    queryKey: CONTEST_KEYS.myApplication(id),
    queryFn: () => contestService.getMyApplicationStatus(id),
    enabled: !!id,
    retry: false, // Don't retry on 404/etc as handled in service
  });
}

export function useContestMembers(id: number, params: { page?: number; page_size?: number } = { page: 1, page_size: 10 }) {
  return useQuery({
    queryKey: CONTEST_KEYS.members(id, params),
    queryFn: () => contestService.getContestMembers(id, params),
    enabled: !!id,
    placeholderData: keepPreviousData,
  });
}

export function useContestGames(id: number) {
    return useQuery({
        queryKey: CONTEST_KEYS.games(id),
        queryFn: () => contestService.getContestGames(id),
        enabled: !!id
    });
}

// Mutations

export function useContestMutations() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const createContest = useMutation({
    mutationFn: (data: CreateContestRequest) => contestService.createContest(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CONTEST_KEYS.lists() });
      if (data?.data?.contest_id) {
        router.push(`/contests/${data.data.contest_id}`);
      }
    },
  });

  const updateContest = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateContestRequest }) => 
      contestService.updateContest(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: CONTEST_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: CONTEST_KEYS.lists() });
    },
  });

  const deleteContest = useMutation({
    mutationFn: (id: number) => contestService.deleteContest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTEST_KEYS.lists() });
      router.push('/contests');
    },
  });

  const startContest = useMutation({
    mutationFn: (id: number) => contestService.startContest(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: CONTEST_KEYS.detail(id) });
    }
  });

  const stopContest = useMutation({
    mutationFn: (id: number) => contestService.stopContest(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: CONTEST_KEYS.detail(id) });
    }
  });

  const uploadThumbnail = useMutation({
    mutationFn: ({ contestId, file }: { contestId: number, file: File }) => 
        contestService.uploadThumbnail(contestId, file),
    onSuccess: (_, { contestId }) => {
        queryClient.invalidateQueries({ queryKey: CONTEST_KEYS.detail(contestId) });
    }
  });


  // Application Mutations
  const applyContest = useMutation({
    mutationFn: (id: number) => contestService.applyContest(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: CONTEST_KEYS.myApplication(id) });
      queryClient.invalidateQueries({ queryKey: CONTEST_KEYS.applications(id) }); // Update list for leaders
    }
  });

  const cancelApplication = useMutation({
      mutationFn: (id: number) => contestService.cancelApplication(id),
      onSuccess: (_, id) => {
          queryClient.invalidateQueries({ queryKey: CONTEST_KEYS.myApplication(id) });
      }
  });

  const withdrawContest = useMutation({
      mutationFn: (id: number) => contestService.withdrawContest(id),
      onSuccess: (_, id) => {
          queryClient.invalidateQueries({ queryKey: CONTEST_KEYS.myApplication(id) });
          // Also invalidate members if they were part of it
          queryClient.invalidateQueries({ queryKey: CONTEST_KEYS.details() }); // conservative invalidation
      }
  });

  const acceptApplication = useMutation({
      mutationFn: ({ contestId, userId }: { contestId: number, userId: number }) => 
          contestService.acceptApplication(contestId, userId),
      onSuccess: (_, { contestId }) => {
          queryClient.invalidateQueries({ queryKey: CONTEST_KEYS.applications(contestId) });
          queryClient.invalidateQueries({ queryKey: CONTEST_KEYS.detail(contestId) }); // member count might change
      }
  });

  const rejectApplication = useMutation({
      mutationFn: ({ contestId, userId }: { contestId: number, userId: number }) => 
          contestService.rejectApplication(contestId, userId),
      onSuccess: (_, { contestId }) => {
          queryClient.invalidateQueries({ queryKey: CONTEST_KEYS.applications(contestId) });
      }
  });

  return {
    createContest,
    updateContest,
    deleteContest,
    startContest,
    stopContest,
    uploadThumbnail,
    applyContest,
    cancelApplication,
    withdrawContest,
    acceptApplication,
    rejectApplication
  };
}
