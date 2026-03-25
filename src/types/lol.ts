export interface LOLInfoResponse {
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

export interface RegisterLOLRequest {
  region: 'kr' | 'jp' | 'na' | 'euw' | 'eune' | 'oce' | 'lan' | 'las' | 'tr' | 'ru' | 'br';
  riot_name: string;
  riot_tag: string;
}
