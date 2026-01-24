import { api } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';

export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
}

export interface DiscordChannel {
  id: string;
  name: string;
  type: number; // 0 for text channel
}

export interface DiscordGuildsResponse {
  guilds: DiscordGuild[];
}

export interface DiscordChannelsResponse {
  channels: DiscordChannel[];
}

export const discordService = {
  getGuilds: async (): Promise<DiscordGuildsResponse> => {
    return api.get<DiscordGuildsResponse>('/discord/guilds');
  },

  getChannels: async (guildId: string): Promise<DiscordChannelsResponse> => {
    return api.get<DiscordChannelsResponse>(`/discord/guilds/${guildId}/channels`);
  }
};
