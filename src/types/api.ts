export type ApiResponse<T> = {
  data: T;
  message: string;
  status: number;
};

export type PaginationResponse<T> = {
  data: T[];
  page: number;
  page_size: number;
  total_count: number;
  total_pages: number;
};

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface LogoutRequest {
  access_token: string;
  refresh_token: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password?: string;
  tag: string;
  avatar?: string;
  bio?: string;
}

export interface UpdateUserRequest {
  password: string;
}

export interface UserResponse {
  user_id: number;
  email: string;
  created_at: string;
  modified_at: string;
  username: string;
  tag: string;
  avatar?: string;
  bio?: string;
  role?: string | "ADMIN" | "USER"; 
}

export interface MyUserResponse {
  avatar: string;
  bio: string;
  created_at: string;
  email: string;
  modified_at: string;
  tag: string;
  user_id: number;
  username: string;
  role: string | "ADMIN" | "USER"; 
  profile_key?: string; // Likely the Discord ID or external ID
}


export type ContestStatus = 'PENDING' | 'ACTIVE' | 'FINISHED' | 'CANCELLED' | 'RECRUITING' | 'PREPARING';
export type ContestType = 'TOURNAMENT' | 'LEAGUE' | 'CASUAL';
export type GameType = 'VALORANT' | 'LOL';

export interface ContestResponse {
  contest_id: number;
  title: string;
  description?: string;
  contest_type: ContestType;
  game_type: GameType;
  contest_status: ContestStatus;
  max_team_count: number;
  current_team_count?: number;
  total_team_member: number;
  total_point: number;
  thumbnail?: string;
  started_at?: string;
  ended_at?: string;
  created_at: string;
  modified_at?: string;
  auto_start?: boolean;
  game_point_table_id?: number;
  discord_guild_id?: string;
  discord_text_channel_id?: string;
}

export interface CreateContestRequest {
  title: string;
  description?: string;
  contest_type: ContestType;
  game_type?: GameType;
  max_team_count?: number;
  total_team_member?: number;
  total_point?: number;
  thumbnail?: string;
  started_at?: string;
  ended_at?: string;
  auto_start?: boolean;
  game_point_table_id?: number;
  discord_guild_id?: string;
  discord_text_channel_id?: string;
}

export interface UpdateContestRequest {
  title?: string;
  description?: string;
  contest_type?: ContestType;
  game_type?: GameType;
  contest_status?: ContestStatus;
  max_team_count?: number;
  total_team_member?: number;
  total_point?: number;
  thumbnail?: string;
  started_at?: string;
  ended_at?: string;
  auto_start?: boolean;
  game_point_table_id?: number;
  discord_guild_id?: string;
  discord_text_channel_id?: string;
}

export interface DiscordLinkRequiredResponse {
  message: string;
  oauth_url: string;
}

export interface ContestApplicationResponse {
  user_id: number;
  contest_id?: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  requested_at: string;
  sender: {
      user_id: number;
      username: string;
      tag: string;
      avatar?: string;
  };
  created_at?: string; // Kept optional for backward compatibility if needed, but requested_at is primary
}

export interface MyApplicationResponse {
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'NONE';
  application_id?: number;
}

export interface ContestMemberResponse {
  user_id: number;
  contest_id: number;
  member_type: 'STAFF' | 'NORMAL' | 'LEADER';
  leader_type: 'LEADER' | 'MEMBER';
  username: string;
  tag: string;
  point: number;
  avatar?: string;
  current_tier: number;
  current_tier_patched?: string;
  peak_tier: number;
  peak_tier_patched?: string;
  join_date?: string; // Optional as it was missing in the sample
  profile_key?: string;
}

// --- Games ---

export type GameStatus = 'PENDING' | 'ACTIVE' | 'FINISHED' | 'CANCELLED';
export type GameTeamType = 'SINGLE' | 'DUO' | 'TRIO' | 'FULL' | 'HURUPA';

export interface GameResponse {
  game_id: number;
  contest_id: number;
  game_status: GameStatus;
  game_team_type: GameTeamType;
  started_at: string;
  ended_at: string;
  created_at: string;
  modified_at?: string;
}

export interface CreateGameRequest {
  contest_id: number;
  game_team_type: GameTeamType;
  started_at: string;
  ended_at: string;
}

export interface UpdateGameRequest {
  game_status?: GameStatus;
  game_team_type?: GameTeamType;
  started_at?: string;
  ended_at?: string;
}

// Notifications
export enum NotificationType {
  TEAM_INVITE_RECEIVED = 'TEAM_INVITE_RECEIVED',
  TEAM_INVITE_ACCEPTED = 'TEAM_INVITE_ACCEPTED',
  TEAM_INVITE_REJECTED = 'TEAM_INVITE_REJECTED',
  APPLICATION_ACCEPTED = 'APPLICATION_ACCEPTED',
  APPLICATION_REJECTED = 'APPLICATION_REJECTED'
}

export interface NotificationResponse {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  type: NotificationType;
  created_at: string;
  data: Record<string, any>; // Flexible data payload
}

export interface TeamMember {
  user_id: number;
  username: string;
  tag: string;
  avatar?: string;
  member_type: 'LEADER' | 'MEMBER';
  grade?: number;
  point?: number; // Added for point calculation
  discord_id?: string;
}

export interface TeamResponse {
  team_id?: number; // Added based on context, might be needed
  game_id: number; // Keeping for legacy/compatibility if returned
  contest_id: number;
  name: string; // Team Name
  invite_code: string; // Invite Code
  leader_id: number; // Leader ID
  game_status?: GameStatus;
  game_team_type?: GameTeamType;
  members: TeamMember[];
  created_at: string;
}

export interface CreateTeamRequest {
  team_name?: string; // Optional based on swagger
}

export interface InviteTeamMemberRequest {
  user_id: number;
}

export interface NotificationListResponse {
  notifications: NotificationResponse[];
  total: number;
  unread_count: number;
}
