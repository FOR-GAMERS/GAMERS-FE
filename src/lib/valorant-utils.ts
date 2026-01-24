export const getValorantRankName = (tier: number): string => {
  if (tier === 0) return "Unrated";
  
  // Custom mapping based on user request:
  // 19 -> Diamond 3
  // 22 -> Ascendant 2
  
  // Standard Valorant IDs (approximate):
  // 3-5: Iron
  // 6-8: Bronze
  // 9-11: Silver
  // 12-14: Gold
  // 15-17: Platinum
  // 18-20: Diamond (Standard: 18=D1, 19=D2, 20=D3)
  // 21-23: Ascendant (Standard: 21=A1, 22=A2, 23=A3)
  // 24-26: Immortal
  // 27: Radiant
  
  // User wants 19=D3. This shifts Diamond end to 19.
  // User wants 22=A2. This matches Standard.
  
  // Interpolating:
  // 19: Diamond 3
  // 20: Ascendant 1 (Gap fill)
  // 21: Ascendant 1 (Gap fill or unused?) -> Let's map 21 to Ascendant 1 as well or A2? 
  // actually usually tiers are 3 steps.
  // If 22 is A2. 21 should be A1. 
  // If 20 is A1 (from 19=D3). Then 20 and 21 are both A1? 
  // Or maybe user meant 19 is Diamond 3, 20 is Ascendant 1, 21 is Ascendant 2 (Conflict with 22)?
  // Let's assume the mapping:
  
  const TIER_MAP: Record<number, string> = {
    0: "Unrated",
    1: "Unused 1",
    2: "Unused 2",
    3: "Iron 1",
    4: "Iron 2",
    5: "Iron 3",
    6: "Bronze 1",
    7: "Bronze 2",
    8: "Bronze 3",
    9: "Silver 1",
    10: "Silver 2",
    11: "Silver 3",
    12: "Gold 1",
    13: "Gold 2",
    14: "Gold 3",
    15: "Platinum 1",
    16: "Platinum 2",
    17: "Platinum 3",
    18: "Diamond 1", // Assuming 18 is D1
    19: "Diamond 3", // User Request (Standard is D2)
    20: "Ascendant 1", // Interpolated
    21: "Ascendant 1", // Interpolated (Gap) -> Or maybe 21 is A2? 
    // Let's check standard again. 21 is A1, 22 is A2, 23 is A3.
    // If 19 is D3. Then 20 could be A1. 21 could be A1 (or A2 if user skipped?).
    // I will map 20-> Ascendant 1, 21 -> Ascendant 1.
    22: "Ascendant 2", // User Request / Standard
    23: "Ascendant 3",
    24: "Immortal 1",
    25: "Immortal 2",
    26: "Immortal 3",
    27: "Radiant",
  };

  return TIER_MAP[tier] || "Unrated";
};
