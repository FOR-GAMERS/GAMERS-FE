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
  contest_type: z.nativeEnum(ContestType).default(ContestType.TOURNAMENT),
  game_type: z.string().default('VALORANT'),
  game_point_table_id: z.number().optional(),
  
  // Team Composition
  max_team_count: z.number().min(1).default(16),
  total_team_member: z.number().min(1).default(5),
  total_point: z.number().min(0).default(100),
  
  // Schedule Settings
  started_at: z.string().min(1, 'contests.create.validation.start_date_required'),
  ended_at: z.string().min(1, 'contests.create.validation.end_date_required'),
  auto_start: z.boolean().default(false),
  
  // Discord Integration
  discord_guild_id: z.string().optional(),
  discord_text_channel_id: z.string().optional(),
  
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

