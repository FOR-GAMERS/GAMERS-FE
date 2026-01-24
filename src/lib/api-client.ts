import Cookies from 'js-cookie';

const BASE_URL = '/api/proxy';

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  requiresAuth?: boolean;
}

// Keep these for compatibility with auth-service, but they primarily affect client-side logic
export const setTokens = (accessToken: string, refreshToken: string) => {
  Cookies.set('access_token', accessToken);
  Cookies.set('refresh_token', refreshToken);
};

export const clearTokens = () => {
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
};

export async function apiClient<T>(
  endpoint: string,
  method: RequestMethod = 'GET',
  { params, requiresAuth = true, headers, ...customConfig }: FetchOptions = {}
): Promise<T> {
  const safeEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = new URL(`${BASE_URL}${safeEndpoint}`, window.location.origin);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...customConfig,
  };

  // Authorization header is injected by Middleware (src/middleware.ts) based on HttpOnly cookies.
  
  let response = await fetch(url.toString(), config);

  // Handle 401 Unauthorized (Refresh Token Logic via Server Route)
  if (response.status === 401 && requiresAuth) {
      try {
        const refreshResponse = await fetch('/api/auth/refresh', {
          method: 'POST',
        });

        if (refreshResponse.ok) {
           // Token refreshed (cookies updated by server). Retry request.
           response = await fetch(url.toString(), config);
        } else {
           clearTokens();
           window.location.href = '/login';
        }
      } catch (error) {
        clearTokens();
        window.location.href = '/login';
      }
  }

  if (!response.ok) {
    let errorMessage = 'Something went wrong';
    let errorData = null;
    try {
      const errorBody = await response.json();
      errorMessage = errorBody.message || errorMessage;
      errorData = errorBody;
    } catch {
      // ignore JSON parse error
    }
    throw new ApiError(response.status, errorMessage, errorData);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return await response.json() as T;
}

export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) => 
    apiClient<T>(endpoint, 'GET', options),
  post: <T>(endpoint: string, body?: any, options?: FetchOptions) => 
    apiClient<T>(endpoint, 'POST', { ...options, body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body?: any, options?: FetchOptions) => 
    apiClient<T>(endpoint, 'PUT', { ...options, body: JSON.stringify(body) }),
  patch: <T>(endpoint: string, body?: any, options?: FetchOptions) => 
    apiClient<T>(endpoint, 'PATCH', { ...options, body: JSON.stringify(body) }),
  delete: <T>(endpoint: string, options?: FetchOptions) => 
    apiClient<T>(endpoint, 'DELETE', options),
};
