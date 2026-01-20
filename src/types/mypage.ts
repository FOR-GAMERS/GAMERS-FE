export interface UserProfile {
  id: string;
  username: string;
  discriminator: string; // e.g. #1234
  avatarUrl: string;
  bannerUrl: string;
  bio: string;
  joinDate: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Ascendant' | 'Immortal' | 'Radiant';
}

export interface ContestHistoryItem {
  id: string;
  title: string;
  date: string;
  tier: string;
  score: number;
  rank?: number;
  serverName: string;
  serverIconUrl: string;
}

export interface TeamInvite {
  id: string;
  teamName: string;
  inviterName: string;
  inviterAvatarUrl: string;
  contestTitle: string;
  status: 'pending' | 'accepted' | 'rejected';
  sentAt: string;
}

export interface AwardItem {
  id: string;
  title: string;
  contestName: string;
  date: string;
  rank: number; // 1, 2, 3...
  badgeUrl: string;
  teammates: string[];
}

export interface CommentActivity {
  id: string;
  content: string;
  targetType: 'contest' | 'game' | 'post';
  targetTitle: string;
  createdAt: string;
  likes: number;
}
