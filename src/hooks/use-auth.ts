import { useState } from 'react';
import { authService } from '@/services/auth-service';
import { LoginRequest, CreateUserRequest, UserResponse } from '@/types/api';
import { useRouter } from 'next/navigation';
import { ApiError } from '@/lib/api-client';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = async (credentials: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      await authService.login(credentials);
      router.push('/'); // Redirect to home on success
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Login failed');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: CreateUserRequest) => {
    setLoading(true);
    setError(null);
    try {
      await authService.register(data);
      // Automatically login or redirect to login? 
      // Usually redirect to login or auto-login.
      // Let's assume redirect to login.
      router.push('/login');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Registration failed');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      router.push('/login');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loginWithDiscord = () => {
    authService.loginWithDiscord();
  };

  const handleDiscordCallback = async (code: string, state?: string) => {
    setLoading(true);
    setError(null);
    try {
      await authService.handleDiscordCallback(code, state);
      router.push('/');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Discord login failed');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    register,
    logout,
    loginWithDiscord,
    handleDiscordCallback,
    loading,
    error,
  };
}
