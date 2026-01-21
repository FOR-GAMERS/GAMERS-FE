export type ContestType = 'TEAM' | 'INDIVIDUAL';
export type ContestStatus = 'PENDING' | 'ACTIVE' | 'FINISHED' | 'CANCELLED' | 'RECRUITING' | 'PREPARING'; // Added missing from swagger

export interface ContestResponse {
  contest_id: number;
  title: string;
  description?: string;
  max_team_count?: number;
  total_point: number;
  contest_type: ContestType;
  contest_status: ContestStatus;
  started_at?: string;
  ended_at?: string;
  auto_start?: boolean;
  active?: boolean; // From previous view, but swagger doesn't show it explicitly in allOf? Checking CreateContestRequest shows it.
  created_at: string;
  discord_guild_id?: string;
  discord_text_channel_id?: string;
  thumbnail?: string;
  total_team_member?: number;
  game_type?: 'VALORANT' | 'LOL'; // Added from swagger
  game_point_table_id?: number;
}

export interface CreateContestRequest {
  title: string;
  description?: string;
  max_team_count?: number;
  total_point?: number;
  contest_type: ContestType;
  started_at?: string;
  ended_at?: string;
  discord_guild_id?: string;
  discord_text_channel_id?: string;
  auto_start?: boolean;
  thumbnail?: string;
  game_type?: 'VALORANT' | 'LOL';
  game_point_table_id?: number;
  total_team_member?: number;
}

export interface UpdateContestRequest extends Partial<CreateContestRequest> {
  contest_status?: ContestStatus;
}

export const INITIAL_CREATE_CONTEST_STATE: CreateContestRequest = {
  title: "",
  description: "",
  max_team_count: 32,
  total_point: 1000,
  contest_type: "TEAM",
  started_at: "",
  ended_at: "",
  discord_guild_id: "",
  discord_text_channel_id: "",
  auto_start: false,
  game_type: 'VALORANT',
  total_team_member: 5
};

// Application DTOs
export interface ContestApplicationResponse { // For leader view
    application_id: number; // Swagger doesn't explicitly show this in 'get pending' response schema (just 'OK'), need to infer or check if it returns UserResponse directly? 
    // Swagger says: "/api/contests/{contestId}/applications" returns 200 OK. Schema ref: global_response.Response. 
    // Usually data is a list of applications. Let's assume common fields.
    // Wait, swagger definitions for "GAMERS-BE_internal_contest_application_dto" don't include an ApplicationResponse.
    // Let's assume it returns a list of Users or specialized objects.
    // Based on typical patterns:
    user_id: number;
    username: string;
    tag: string;
    created_at: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED'; 
}

export interface MyApplicationResponse {
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'NONE'; // 'NONE' for 404
    application_id?: number;
}

// Member DTOs
export interface ContestMemberResponse {
    user_id: number;
    username: string;
    tag: string;
    point: number;
    rank?: number;
    join_date: string;
}

// Game DTOs
export interface GameResponse {
    game_id: number;
    contest_id: number;
    game_status: 'PENDING' | 'ACTIVE' | 'FINISHED' | 'CANCELLED';
    game_team_type: 'SINGLE' | 'DUO' | 'TRIO' | 'FULL' | 'HURUPA';
    created_at: string;
    started_at?: string;
    ended_at?: string;
    modified_at?: string;
}

export interface DiscordLinkRequiredResponse {
    message: string;
    oauth_url: string;
}

