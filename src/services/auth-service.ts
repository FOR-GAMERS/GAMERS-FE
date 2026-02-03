import { api, setTokens, clearTokens } from '@/lib/api-client';
import { 
  LoginRequest, 
  CreateUserRequest, 
  ApiResponse, 
  UserResponse, 
  LogoutRequest,
  MyUserResponse
} from '@/types/api';
import Cookies from 'js-cookie';

export const authService = {
  async login(credentials: LoginRequest) {
    const response = await api.post<ApiResponse<{ 
      access_token: string; 
      refresh_token: string;
      user?: UserResponse;
    }>>('/auth/login', credentials, { requiresAuth: false });
    
    if (response.data) {
      setTokens(response.data.access_token, response.data.refresh_token);
    }
    return response;
  },

  async register(data: CreateUserRequest) {
    return api.post<ApiResponse<{ user_id: number }>>('/users', data, { requiresAuth: false });
  },

  async logout() {
    const accessToken = Cookies.get('access_token');
    const refreshToken = Cookies.get('refresh_token');

    if (accessToken && refreshToken) {
      try {
        await api.post<void>('/auth/logout', { 
          access_token: accessToken, 
          refresh_token: refreshToken 
        } as LogoutRequest);
      } catch (error) {
        console.error('Logout failed', error);
      }
    }
    clearTokens();
  },

  loginWithDiscord() {
    const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
    // Ensure protocol is present. If missing, assume https unless localhost
    const withProtocol = RAW_API_URL.match(/^https?:\/\//) 
      ? RAW_API_URL 
      : RAW_API_URL.includes('localhost') 
        ? `http://${RAW_API_URL}` 
        : `https://${RAW_API_URL}`;

    const BASE_URL = withProtocol.endsWith('/api') 
      ? withProtocol 
      : `${withProtocol.replace(/\/$/, '')}/api`;
    window.location.href = `${BASE_URL}/oauth2/discord/login`;
  },

  async handleDiscordCallback(code: string, state?: string) {
    const response = await api.get<ApiResponse<{
      access_token: string;
      refresh_token: string;
    }>>('/oauth2/discord/callback', { 
      params: { code, state },
      requiresAuth: false 
    });

    if (response.data) {
       setTokens(response.data.access_token, response.data.refresh_token);
    }
    return response;
  },

  async getMe() {
    // Guest users should be able to view the page, so don't redirect on 401, but attempt refresh
    const response = await api.get<ApiResponse<MyUserResponse>>('/users/my', { requiresAuth: true, redirectOnFail: false }); 
    return response.data;
  }
};
