import Cookies from 'js-cookie';
import { ApiResponse, ApiError } from '@/types/api';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.gamers.io.kr';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, headers, ...rest } = options;

  let url = `${BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const accessToken = Cookies.get('access_token');
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (accessToken) {
    defaultHeaders['Authorization'] = `Bearer ${accessToken}`;
  }

  const config = {
    ...rest,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  };

  try {
    const response = await fetch(url, config);

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    const result = await response.json() as ApiResponse<T>;

    if (!response.ok) {
      // Handle 401 Unauthorized - trigger token refresh
      if (response.status === 401 && !endpoint.includes('/api/auth/refresh')) {
        const refreshToken = Cookies.get('refresh_token');
        
        if (refreshToken) {
          try {
            // Attempt to refresh tokens
            const refreshResponse = await fetch(`${BASE_URL}/api/auth/refresh`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refresh_token: refreshToken }),
            });

            if (refreshResponse.ok) {
              const refreshResult = await refreshResponse.json() as ApiResponse<any>;
              const { access_token, refresh_token: newRefreshToken } = refreshResult.data;
              
              // Update cookies
              Cookies.set('access_token', access_token, { expires: 1 });
              Cookies.set('refresh_token', newRefreshToken, { expires: 7 });
              
              // Retry original request with new token
              return request<T>(endpoint, options);
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
          }
        }
        
        // If refresh fails or no refresh token, clear and throw error
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        
        // Optional: window.location.href = '/login' can be handled here or in hooks
      }
      
      const error: ApiError = {
        message: result.message || 'An error occurred',
        status: response.status,
        data: result.data,
      };
      throw error;
    }

    return result.data;
  } catch (error) {
    if (error instanceof Error) {
      throw {
        message: error.message,
        status: 500,
      } as ApiError;
    }
    throw error;
  }
}

export const apiClient = {
  get: <T>(url: string, options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'GET' }),
  post: <T>(url: string, data?: any, options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'POST', body: JSON.stringify(data) }),
  put: <T>(url: string, data?: any, options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'PUT', body: JSON.stringify(data) }),
  patch: <T>(url: string, data?: any, options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'PATCH', body: JSON.stringify(data) }),
  delete: <T>(url: string, options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'DELETE' }),
};
