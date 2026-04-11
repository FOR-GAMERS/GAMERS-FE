import { z } from 'zod';
import { ContestType } from '@/types/contest';

export const contestCreateSchema = z.object({
  // Basic Info
  title: z.string().min(1, 'contests.create.validation.name_required').max(255),
  description: z.string().min(1, 'contests.create.validation.desc_required'),
  
  // Image Settings (Stored as File object for individual upload, or string URL if already uploaded)
  thumbnail: z.any().optional(), 
  thumbnail_file: z.any().optional(), // For internal use
  
  // Settings
  contest_type: z.enum(['TOURNAMENT', 'LEAGUE', 'CASUAL']),
  game_type: z.enum(['VALORANT', 'LOL']),
  game_point_table_id: z.number().optional(),
  
  // Team Composition
  max_team_count: z.number().min(1),
  total_team_member: z.number().min(1),
  total_point: z.number().min(0),
  
  // Schedule Settings
  started_at: z.string().min(1, 'contests.create.validation.start_date_required'),
  ended_at: z.string().min(1, 'contests.create.validation.end_date_required'),
  auto_start: z.boolean(),
  
  // Discord Integration
  discord_guild_id: z.string().optional(),
  discord_text_channel_id: z.string().optional(),
  
  // Game Specific Settings
  valorant: z.object({
    format: z.enum(['TOURNAMENT', 'LEAGUE']),
    mapPool: z.array(z.string()),
    agentRestrictions: z.array(z.string()),
    roundsPerMatch: z.number(),
  }).optional(),
  
  lol: z.object({
    format: z.enum(['TOURNAMENT', 'LEAGUE']),
    patchVersion: z.string(),
    championRestrictions: z.array(z.string()),
  }).optional(),
  
  // Custom
  precautions: z.string().optional(),
}).refine((data) => {
  if (data.started_at && data.ended_at) {
    return new Date(data.started_at) < new Date(data.ended_at);
  }
  return true;
}, {
  message: "contests.create.validation.date_order",
  path: ["ended_at"],
});

export type ContestCreateFormValues = z.infer<typeof contestCreateSchema>;

