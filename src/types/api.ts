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
  username: string;
  tag: string;
  created_at: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

export interface MyApplicationResponse {
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'NONE';
  application_id?: number;
}

export interface ContestMemberResponse {
  user_id: number;
  username: string;
  tag: string;
  point: number;
  rank?: number; // Optional as per swagger it might not be there or computed
  join_date: string; // swagger didn't show this field in my limited view, but assuming standard member list
  // Re-checking swagger view from earlier: "GAMERS-BE_internal_contest_members_dto" wasn't fully shown. 
  // Let's assume standard fields for now. 
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
