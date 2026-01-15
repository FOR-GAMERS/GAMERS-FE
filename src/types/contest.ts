export type ContestType = 'TEAM' | 'INDIVIDUAL';
export type ContestStatus = 'RECRUITING' | 'ONGOING' | 'FINISHED' | 'PREPARING';

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
  created_at: string;
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
  discord_text_channel_id: ""
};
