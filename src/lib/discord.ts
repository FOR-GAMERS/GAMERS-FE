export function getDiscordAvatarUrl(userId: string, avatarHash?: string | null) {
  if (!userId || !avatarHash) return null;
  if (avatarHash.startsWith('http') || avatarHash.startsWith('/')) {
    return avatarHash;
  }
  return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.png`;
}
