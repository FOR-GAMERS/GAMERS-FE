import { z } from "zod";

export const createContestSchema = z.object({
  title: z.string().min(1, "Title is required").max(64, "Title must be less than 64 characters"),
  description: z.string().optional(),
  max_team_count: z.coerce.number().refine((val) => [4, 8, 16, 32].includes(val), "Must be 4, 8, 16, or 32").default(16),
  total_team_member: z.coerce.number().min(1, "At least 1 member required").max(6, "Max 6 members").default(5),
  total_point: z.number().optional(),
  contest_type: z.enum(["TOURNAMENT", "LEAGUE"]).default("TOURNAMENT"),
  game_type: z.string().default("VALORANT"),
  started_at: z.string().refine((date) => new Date(date) > new Date(), {
    message: "Start date must be in the future",
  }),
  ended_at: z.string(),
  auto_start: z.boolean().default(false),
  discord_guild_id: z.string().min(1, "Discord Server is required"),
  discord_text_channel_id: z.string().min(1, "Discord Channel is required"),
  thumbnail: z.string().optional(),
  game_point_table_id: z.number().optional(),
  games: z.array(z.object({
      id: z.number(), 
      startTime: z.string().min(1, "Start time is required")
  })).min(1, "At least one game is required"),
}).refine((data) => new Date(data.started_at) < new Date(data.ended_at), {
  message: "End date must be after start date",
  path: ["ended_at"],
});

export const valorantScoreTableSchema = z.object({
  iron_1: z.coerce.number().min(0, "Required"),
  iron_2: z.coerce.number().min(0, "Required"),
  iron_3: z.coerce.number().min(0, "Required"),
  bronze_1: z.coerce.number().min(0, "Required"),
  bronze_2: z.coerce.number().min(0, "Required"),
  bronze_3: z.coerce.number().min(0, "Required"),
  silver_1: z.coerce.number().min(0, "Required"),
  silver_2: z.coerce.number().min(0, "Required"),
  silver_3: z.coerce.number().min(0, "Required"),
  gold_1: z.coerce.number().min(0, "Required"),
  gold_2: z.coerce.number().min(0, "Required"),
  gold_3: z.coerce.number().min(0, "Required"),
  platinum_1: z.coerce.number().min(0, "Required"),
  platinum_2: z.coerce.number().min(0, "Required"),
  platinum_3: z.coerce.number().min(0, "Required"),
  diamond_1: z.coerce.number().min(0, "Required"),
  diamond_2: z.coerce.number().min(0, "Required"),
  diamond_3: z.coerce.number().min(0, "Required"),
  ascendant_1: z.coerce.number().min(0, "Required"),
  ascendant_2: z.coerce.number().min(0, "Required"),
  ascendant_3: z.coerce.number().min(0, "Required"),
  immortal_1: z.coerce.number().min(0, "Required"),
  immortal_2: z.coerce.number().min(0, "Required"),
  immortal_3: z.coerce.number().min(0, "Required"),
  radiant: z.coerce.number().min(0, "Required"),
});

export type CreateContestFormValues = z.infer<typeof createContestSchema>;
export type ValorantScoreTableFormValues = z.infer<typeof valorantScoreTableSchema>;
