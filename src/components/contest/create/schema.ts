import { z } from 'zod';

export const contestCreateSchema = z.object({
  // Basic Info
  name: z.string().min(1, '대회명을 입력해주세요').max(255),
  description: z.string().min(1, '대회 소개를 입력해주세요'),
  precautions: z.string().optional(),
  
  // Image Settings
  thumbnail: z.any().optional(), // In a real app, this would be a File or URL
  banner: z.any().optional(),
  
  // Game Settings
  game: z.enum(['VALORANT', 'LOL']),
  
  // Valorant Specific
  valorant: z.object({
    format: z.enum(['TOURNAMENT', 'LEAGUE']).default('TOURNAMENT'),
    mapPool: z.array(z.string()).min(1, '최소 하나 이상의 맵을 선택해주세요'),
    agentRestrictions: z.array(z.string()).optional(),
    roundsPerMatch: z.number().min(1).default(3),
  }).optional(),
  
  // LoL Specific
  lol: z.object({
    format: z.enum(['TOURNAMENT', 'LEAGUE']).default('TOURNAMENT'),
    patchVersion: z.string().min(1, '패치 버전을 선택해주세요'),
    championRestrictions: z.array(z.string()).optional(),
  }).optional(),
  
  // Team Composition
  maxTeams: z.number().min(2).max(128).default(32),
  teamSize: z.number().min(1).max(10).default(5),
  totalPoints: z.number().min(0).default(100),
  
  // Schedule Settings
  startDate: z.string().min(1, '시작일을 선택해주세요'),
  endDate: z.string().min(1, '종료일을 선택해주세요'),
  autoStart: z.boolean().default(false),
  
  // Discord Integration
  discordServerId: z.string().optional(),
  discordChannelId: z.string().optional(),
});

export type ContestCreateFormValues = z.infer<typeof contestCreateSchema>;
