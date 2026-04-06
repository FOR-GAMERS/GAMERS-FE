import { z } from 'zod';

export const contestCreateSchema = z.object({
  // Basic Info
  name: z.string().min(1, 'contests.create.validation.name_required').max(255),
  description: z.string().min(1, 'contests.create.validation.desc_required'),
  precautions: z.string().optional(),
  
  // Image Settings
  thumbnail: z.any().optional(), // In a real app, this would be a File or URL
  banner: z.any().optional(),
  
  // Game Settings
  game: z.enum(['VALORANT', 'LOL']),
  
  // Valorant Specific
  valorant: z.object({
    format: z.enum(['TOURNAMENT', 'LEAGUE']),
    mapPool: z.array(z.string()).min(1, 'contests.create.validation.map_pool_required'),
    agentRestrictions: z.array(z.string()).optional(),
    roundsPerMatch: z.number().min(1),
  }).optional(),
  
  // LoL Specific
  lol: z.object({
    format: z.enum(['TOURNAMENT', 'LEAGUE']),
    patchVersion: z.string().min(1, 'contests.create.validation.patch_required'),
    championRestrictions: z.array(z.string()).optional(),
  }).optional(),
  
  // Team Composition
  maxTeams: z.number().min(2).max(128),
  teamSize: z.number().min(1).max(10),
  totalPoints: z.number().min(0),
  
  // Schedule Settings
  startDate: z.string().min(1, 'contests.create.validation.start_date_required'),
  endDate: z.string().min(1, 'contests.create.validation.end_date_required'),
  autoStart: z.boolean(),
  
  // Discord Integration
  discordServerId: z.string().optional(),
  discordChannelId: z.string().optional(),
});

export type ContestCreateFormValues = z.infer<typeof contestCreateSchema>;
