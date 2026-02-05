export const getValorantTierName = (tierId: number): string => {
  if (tierId === 0) return "Unrated";
  if (tierId < 3) return "Unknown";
  
  const tiers = [
    "Iron",
    "Bronze",
    "Silver",
    "Gold",
    "Platinum",
    "Diamond",
    "Ascendant",
    "Immortal"
  ];

  if (tierId >= 27) return "Radiant";

  const tierIndex = Math.floor((tierId - 3) / 3);
  const tierName = tiers[tierIndex] || "Unknown";
  const rankLevel = (tierId - 3) % 3 + 1;

  if (tierName === "Immortal") { 
    // Immortal logic might differ slightly in newer acts but generally 1-3 exists.
    return `${tierName} ${rankLevel}`;
  }

  return `${tierName} ${rankLevel}`;
};
