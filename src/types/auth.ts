import { UserRole } from './enums';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  username: string;
  avatar?: string;
}

export interface LogoutRequest {
  access_token: string;
  refresh_token: string;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface User {
  user_id: number;
  email: string;
  username: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  tag?: string;
  region?: string;
  riot_name?: string;
  riot_tag?: string;
  current_tier?: number;
  current_tier_patched?: string;
  peak_tier?: number;
  peak_tier_patched?: string;
  elo?: number;
  ranking_in_tier?: number;
  profile_key?: string;
  valorant_updated_at?: string;
  created_at: string;
  modified_at: string;
}

export interface AuthResponseData {
  user: User;
  tokens: AuthTokens;
}
