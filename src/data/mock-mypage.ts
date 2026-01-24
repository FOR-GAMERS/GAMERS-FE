import { UserProfile, ContestHistoryItem, TeamInvite, AwardItem, CommentActivity } from '@/types/mypage';

export const mockUserProfile: UserProfile = {
  id: 'u1',
  username: 'Sunwoo',
  discriminator: '#9999',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sunwoo', // Valid placeholder
  bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80', // Gaming related unsplash
  bio: 'Valorant Immortal / FPS Lover / Always ready to game.',
  joinDate: '2025-01-01',
  tier: 'Immortal',
};

export const mockHistory: ContestHistoryItem[] = [
  {
    id: 'c1',
    title: 'VALORANT Winter Cup 2025',
    date: '2025-12-15',
    tier: 'Diamond',
    score: 250,
    rank: 3,
    serverName: 'GAMERS Official',
    serverIconUrl: 'https://cdn.discordapp.com/embed/avatars/0.png',
  },
  {
    id: 'c2',
    title: 'Weekly Scrim #42',
    date: '2025-11-20',
    tier: 'N/A',
    score: 100,
    serverName: 'Scrim Net',
    serverIconUrl: 'https://cdn.discordapp.com/embed/avatars/1.png',
  },
  {
    id: 'c3',
    title: 'University League Qualifiers',
    date: '2025-10-05',
    tier: 'Platinum',
    score: 180,
    rank: 8,
    serverName: 'Uni League',
    serverIconUrl: 'https://cdn.discordapp.com/embed/avatars/2.png',
  },
];

export const mockInvites: TeamInvite[] = [
  {
    id: 'inv1',
    teamName: 'Team Liquid',
    inviterName: 'JettMain',
    inviterAvatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jett',
    contestTitle: 'VALORANT Spring Championship',
    status: 'pending',
    sentAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'inv2',
    teamName: 'Noob Slayers',
    inviterName: 'SageHealMe',
    inviterAvatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sage',
    contestTitle: 'Casual Weekend Cup',
    status: 'rejected',
    sentAt: '2026-02-28T14:30:00Z',
  },
];

export const mockAwards: AwardItem[] = [
  {
    id: 'a1',
    title: 'Champion',
    contestName: 'VALORANT Winter Cup 2025',
    date: '2025-12-15',
    rank: 1,
    badgeUrl: '/badges/gold-trophy.png', // Placeholder, using emoji/icon in UI probably
    teammates: ['PlayerOne', 'Shooter99', 'SupportKing', 'EntryFragger'],
  },
  {
    id: 'a2',
    title: 'Runner Up',
    contestName: 'Summer League 2025',
    date: '2025-08-20',
    rank: 2,
    badgeUrl: '/badges/silver-medal.png',
    teammates: ['DuoPartner'],
  },
];

export const mockActivity: CommentActivity[] = [
  {
    id: 'cm1',
    content: 'Good game everyone! Looking forward to next time.',
    targetType: 'contest',
    targetTitle: 'Weekly Scrim #42',
    createdAt: '2025-11-21T09:00:00Z',
    likes: 5,
  },
  {
    id: 'cm2',
    content: 'Can I join this team?',
    targetType: 'post',
    targetTitle: 'Looking for 1 member (Diamond+)',
    createdAt: '2025-11-10T15:45:00Z',
    likes: 0,
  },
];
