export interface ValorantInfoResponse {
  current_tier: number;
  current_tier_patched: string;
  elo: number;
  peak_tier: number;
  peak_tier_patched: string;
  ranking_in_tier: number;
  refresh_needed: boolean;
  region: string;
  riot_name: string;
  riot_tag: string;
  updated_at: string;
}

export interface RegisterValorantRequest {
  region: 'ap' | 'br' | 'eu' | 'kr' | 'latam' | 'na';
  riot_name: string;
  riot_tag: string;
}

export interface ContestPointResponse {
  current_tier_patched: string;
  current_tier_point: number;
  final_point: number;
  peak_tier_patched: string;
  peak_tier_point: number;
  refresh_message: string;
  refresh_needed: boolean;
  riot_name: string;
  riot_tag: string;
  user_id: number;
}
