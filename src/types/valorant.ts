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

export interface CreateValorantScoreTableDto {
  iron_1: number;
  iron_2: number;
  iron_3: number;
  bronze_1: number;
  bronze_2: number;
  bronze_3: number;
  silver_1: number;
  silver_2: number;
  silver_3: number;
  gold_1: number;
  gold_2: number;
  gold_3: number;
  platinum_1: number;
  platinum_2: number;
  platinum_3: number;
  diamond_1: number;
  diamond_2: number;
  diamond_3: number;
  ascendant_1: number;
  ascendant_2: number;
  ascendant_3: number;
  immortal_1: number;
  immortal_2: number;
  immortal_3: number;
  radiant: number;
}

export interface ValorantScoreTableResponse extends CreateValorantScoreTableDto {
  score_table_id: number;
}
