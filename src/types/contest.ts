import { 
  ContestStatus, 
  ContestType, 
  MemberType, 
  LeaderType, 
  GameType, 
  ValorantRole, 
  ApplicationStatus 
} from './enums';

export { 
  ContestStatus, 
  ContestType, 
  MemberType, 
  LeaderType, 
  GameType, 
  ValorantRole, 
  ApplicationStatus 
};

export interface ContestResponse {
  contest_id: number;
  title: string;
  description: string;
  max_team_count: number;
  total_point: number;
  contest_type: ContestType;
  contest_status: ContestStatus;
  started_at: string;
  ended_at: string;
  auto_start: boolean;
  game_type: GameType | null;
  game_point_table_id: number | null;
  total_team_member: number;
  discord_guild_id: string | null;
  discord_text_channel_id: string | null;
  thumbnail: string | null;
  created_at: string;
  modified_at: string;
}

// Keep the old Contest interface as an alias for now, but update it
export interface Contest extends ContestResponse {}

export interface MyContestResponse extends ContestResponse {
  member_type: MemberType;
  leader_type: LeaderType;
  point: number;
}

export interface ContestMemberResponse {
  user_id: number;
  contest_id: number;
  member_type: MemberType;
  leader_type: LeaderType;
  point: number;
  valorant_roles: ValorantRole[];
  description: string;
  username: string;
  tag: string;
  avatar: string;
  current_tier: number | null;
  current_tier_patched: string | null;
  peak_tier: number | null;
  peak_tier_patched: string | null;
}

export interface CreateContestRequest {
  title: string;
  contest_type: ContestType;
  description?: string;
  max_team_count?: number;
  total_point?: number;
  started_at?: string;
  ended_at?: string;
  auto_start?: boolean;
  game_type?: GameType;
  game_point_table_id?: number;
  total_team_member?: number;
  discord_guild_id?: string;
  discord_text_channel_id?: string;
  thumbnail?: string;
  precautions?: string;
}

export interface UpdateContestRequest {
  title?: string;
  description?: string;
  max_team_count?: number;
  total_point?: number;
  contest_type?: ContestType;
  contest_status?: ContestStatus;
  started_at?: string;
  ended_at?: string;
  auto_start?: boolean;
  game_type?: GameType;
  game_point_table_id?: number;
  total_team_member?: number;
  discord_guild_id?: string;
  discord_text_channel_id?: string;
  thumbnail?: string;
  precautions?: string;
}

export interface RequestParticipateRequest {
  valorant_roles?: ValorantRole[];
  description?: string;
}

export interface ApplicationResponse {
  user_id: number;
  contest_id: number;
  status: ApplicationStatus;
  requested_at: string;
  processed_at: string | null;
  processed_by: number | null;
  sender: {
    user_id: number;
    username: string;
    tag: string;
    avatar: string;
    valorant_roles: ValorantRole[];
    description: string;
  } | null;
}

export interface UserContestStatusResponse {
  is_leader: boolean;
  is_member: boolean;
  has_applied: boolean;
  application_status: ApplicationStatus | null;
  member_type: MemberType | null;
}

export interface ChangeMemberRoleRequest {
  member_type: MemberType;
}

export interface ChangeMemberRoleResponse {
  user_id: number;
  contest_id: number;
  member_type: MemberType;
  leader_type: LeaderType;
}

export interface ThumbnailUploadResponse {
  key: string;
  url: string;
  size: number;
  mime_type: string;
  uploaded_at: string;
}

export interface DiscordLinkRequiredResponse {
  message: string;
  oauth_url: string;
}

export interface PaginationMeta {
  page: number;
  page_size: number;
  total_count: number;
  total_pages: number;
}

export interface ContestListResponse extends PaginationMeta {
  data: ContestResponse[];
}

export interface MyContestListResponse extends PaginationMeta {
  data: MyContestResponse[];
}

export interface ContestMemberListResponse extends PaginationMeta {
  data: ContestMemberResponse[];
}

export interface GetContestsParams {
  [key: string]: string | number | boolean | undefined;
  page?: number;
  page_size?: number;
  sort_by?: string;
  order?: 'asc' | 'desc';
  title?: string;
}

export interface GetMyContestsParams extends GetContestsParams {
  status?: ContestStatus;
}

export interface Author {
  user_id: number;
  username: string;
  tag: string;
  avatar?: string;
}

export interface ContestComment {
  comment_id: number;
  contest_id: number;
  content: string;
  author: Author;
  created_at: string;
  modified_at: string;
}

export interface ContestCommentListResponse extends PaginationMeta {
  data: ContestComment[];
}

export interface TeamSummary {
  team_id: number;
  team_name: string;
}

export interface RoundResult {
  round: number;
  round_name: string;
  games: any[];
}

export interface ContestResult {
  contest_id: number;
  title: string;
  contest_status: ContestStatus;
  total_rounds: number;
  rounds: RoundResult[];
  champion?: TeamSummary;
}

