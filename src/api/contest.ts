import { apiClient } from '@/lib/api-client';
import { 
  ContestResponse, 
  ContestListResponse, 
  GetContestsParams,
  ContestMemberListResponse,
  ContestResult,
  ContestCommentListResponse,
  CreateContestRequest,
  UpdateContestRequest,
  RequestParticipateRequest,
  ApplicationResponse,
  UserContestStatusResponse,
  ChangeMemberRoleRequest,
  ChangeMemberRoleResponse,
  ThumbnailUploadResponse,
  MyContestListResponse,
  GetMyContestsParams
} from '@/types/contest';
import { ApiResponse } from '@/types/api';

export const contestApi = {
  /**
   * Get all contests with pagination, sorting, and title search support
   */
  getContests: (params: GetContestsParams) => {
    return apiClient.get<ApiResponse<ContestListResponse>>('/api/contests', { params });
  },

  /**
   * Get contest details by contest ID
   */
  getContest: (id: number) => 
    apiClient.get<ApiResponse<ContestResponse>>(`/api/contests/${id}`),

  /**
   * Create a new contest
   */
  createContest: (data: CreateContestRequest) =>
    apiClient.post<ApiResponse<ContestResponse>>('/api/contests', data),

  /**
   * Update an existing contest
   */
  updateContest: (id: number, data: UpdateContestRequest) =>
    apiClient.patch<ApiResponse<ContestResponse>>(`/api/contests/${id}`, data),

  /**
   * Delete a contest
   */
  deleteContest: (id: number) =>
    apiClient.delete(`/api/contests/${id}`),

  /**
   * Start a contest (Leader only)
   */
  startContest: (id: number) =>
    apiClient.post<ApiResponse<ContestResponse>>(`/api/contests/${id}/start`),

  /**
   * Stop a contest (Leader only)
   */
  stopContest: (id: number) =>
    apiClient.post<ApiResponse<ContestResponse>>(`/api/contests/${id}/stop`),

  /**
   * Upload contest thumbnail (Leader only)
   */
  uploadThumbnail: (id: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<ApiResponse<ThumbnailUploadResponse>>(`/api/contests/${id}/thumbnail`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /**
   * Get my contests (participated or leading)
   */
  getMyContests: (params: GetMyContestsParams) =>
    apiClient.get<ApiResponse<MyContestListResponse>>('/api/contests/me', { params }),

  /**
   * Request to participate in a contest
   */
  applyToContest: (contestId: number, data?: RequestParticipateRequest) =>
    apiClient.post<ApiResponse<null>>(`/api/contests/${contestId}/applications`, data),

  /**
   * Get all applications for a contest (Leader only)
   */
  getApplications: (contestId: number) =>
    apiClient.get<ApiResponse<ApplicationResponse[]>>(`/api/contests/${contestId}/applications`),

  /**
   * Get my application status for a contest
   */
  getMyApplication: (contestId: number) =>
    apiClient.get<ApiResponse<ApplicationResponse>>(`/api/contests/${contestId}/applications/me`),

  /**
   * Accept an application (Leader only)
   */
  acceptApplication: (contestId: number, userId: number) =>
    apiClient.post<ApiResponse<null>>(`/api/contests/${contestId}/applications/${userId}/accept`),

  /**
   * Reject an application (Leader only)
   */
  rejectApplication: (contestId: number, userId: number) =>
    apiClient.post<ApiResponse<null>>(`/api/contests/${contestId}/applications/${userId}/reject`),

  /**
   * Cancel my pending application
   */
  cancelApplication: (contestId: number) =>
    apiClient.delete<ApiResponse<null>>(`/api/contests/${contestId}/applications/cancel`),

  /**
   * Withdraw from a contest
   */
  withdrawFromContest: (contestId: number) =>
    apiClient.delete<ApiResponse<null>>(`/api/contests/${contestId}/applications/withdraw`),

  /**
   * Get all members of a contest
   */
  getContestMembers: (contestId: number, params?: { [key: string]: any; page?: number; page_size?: number; sort_by?: string; order?: string }) => {
    return apiClient.get<ApiResponse<ContestMemberListResponse>>(`/api/contests/${contestId}/members`, { params });
  },

  /**
   * Change a member's role (Leader only)
   */
  changeMemberRole: (contestId: number, userId: number, data: ChangeMemberRoleRequest) =>
    apiClient.patch<ApiResponse<ChangeMemberRoleResponse>>(`/api/contests/${contestId}/members/${userId}/role`, data),

  /**
   * Get my participation status for a specific contest
   */
  getMyContestStatus: (contestId: number) =>
    apiClient.get<ApiResponse<UserContestStatusResponse>>(`/api/contests/${contestId}/status/me`),

  /**
   * Get contest results/bracket
   */
  getContestResult: (contestId: number) =>
    apiClient.get<ApiResponse<ContestResult>>(`/api/contests/${contestId}/result`),

  /**
   * Get all comments for a contest
   */
  getContestComments: (contestId: number, params?: { [key: string]: any; page?: number; page_size?: number; sort_by?: string; order?: string }) => {
    return apiClient.get<ApiResponse<ContestCommentListResponse>>(`/api/contests/${contestId}/comments`, { params });
  },

  /**
   * Create a new comment for a contest
   */
  createComment: (contestId: number, data: { content: string }) =>
    apiClient.post<ApiResponse<null>>(`/api/contests/${contestId}/comments`, data),
};

