'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { discordService } from '@/services/discord-service';
import { Server, Hash, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { Controller, Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { CreateContestFormValues } from '@/schemas/contest-schema';
import AnimatedSelect from '../ui/AnimatedSelect';

interface DiscordServerSelectorProps {
  control: Control<CreateContestFormValues>;
  setValue: UseFormSetValue<CreateContestFormValues>;
  watch: UseFormWatch<CreateContestFormValues>;
}

export default function DiscordServerSelector({ control, setValue, watch }: DiscordServerSelectorProps) {
  const selectedGuildId = watch('discord_guild_id');
  
  // State for internal dropdown visibility
  const [isGuildOpen, setIsGuildOpen] = React.useState(false);

  const { data: guildsResponse, isLoading: isLoadingGuilds, error: guildError, refetch: refetchGuilds, isRefetching: isRefetchingGuilds } = useQuery({
    queryKey: ['discord-guilds'],
    queryFn: async () => {
        const res = await discordService.getGuilds();
        console.log('[DiscordServerSelector] Raw Guilds Response:', res);
        return res;
    },
    staleTime: 1000 * 60 * 60, // 1 hour cache
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Handle responses: wrapped in 'guilds' (actual), 'data' (standard), or direct array
  // The service now returns DiscordGuildsResponse ( { guilds: [] } )
  const guilds = guildsResponse?.guilds || [];

  // Query: Fetch Channels (Dependent on selectedGuildId)
  const { data: channelsResponse, isLoading: isLoadingChannels } = useQuery({
    queryKey: ['discord-channels', selectedGuildId],
    queryFn: () => discordService.getChannels(selectedGuildId!),
    enabled: !!selectedGuildId,
    staleTime: 1000 * 60 * 10, // 10 minutes cache
    refetchOnWindowFocus: false,
  });

  const channels = channelsResponse?.channels || [];

  const selectedGuild = guilds.find((g) => g.id === selectedGuildId);

  // ... (Skeleton Loader) ...
  if (isLoadingGuilds) {
      // ... same skeleton code ...
    return (
        <div className="animate-section bg-[#0f172a]/80 border border-white/5 rounded-2xl p-6 space-y-6">
            <div className="h-7 w-48 bg-white/10 rounded-md animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <div className="h-4 w-24 bg-white/10 rounded-md animate-pulse" />
                    <div className="w-full h-[50px] bg-white/5 rounded-xl animate-pulse" />
                </div>
                <div className="space-y-2">
                     <div className="h-4 w-32 bg-white/10 rounded-md animate-pulse" />
                     <div className="w-full h-[50px] bg-white/5 rounded-xl animate-pulse" />
                </div>
            </div>
            <div className="h-10 w-full bg-white/5 rounded-lg animate-pulse" />
        </div>
    );
  }

  // Helper: Construct Discord Icon URL
  const getIconUrl = (guildId: string, iconHash: string | null) => {
    if (!iconHash) return null;
    return `https://cdn.discordapp.com/icons/${guildId}/${iconHash}.png`;
  };

  return (
    <div className="animate-section bg-[#0f172a]/80 border border-white/5 rounded-2xl p-6 space-y-6">
       <div className="flex items-center justify-between border-b border-white/5 pb-4">
           {/* ... header content ... */}
           <h3 className="text-lg font-bold flex items-center gap-2">
               <span className="w-1 h-6 bg-[#5865F2] rounded-full block"></span>
               Discord Integration
           </h3>
           <button 
                type="button"
                onClick={() => refetchGuilds()}
                className="text-[10px] text-muted-foreground hover:text-white flex items-center gap-1 transition-colors"
                disabled={isRefetchingGuilds}
           >
               {isRefetchingGuilds ? <Loader2 className="animate-spin" size={12}/> : <RefreshCw size={12} />}
               Refresh
           </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Guild Selector (Custom Dropdown) */}
           <div className="space-y-2 relative">
               <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                   <Server size={12} /> Target Server
               </label>
               
               {/* Hidden Input for Form Registration */}
               <Controller
                   control={control}
                   name="discord_guild_id"
                   render={({ field }) => (
                       <input type="hidden" {...field} />
                   )}
               />

               {/* Custom Trigger */}
               <div 
                  onClick={() => setIsGuildOpen(!isGuildOpen)}
                  className={`w-full bg-black/40 border ${isGuildOpen ? 'border-[#5865F2]' : 'border-white/10'} rounded-xl px-4 py-3 text-sm font-medium flex items-center justify-between cursor-pointer hover:border-white/30 transition-colors`}
               >
                  <div className="flex items-center gap-2">
                      {selectedGuild ? (
                          <>
                            {selectedGuild.icon ? (
                                <Image src={getIconUrl(selectedGuild.id, selectedGuild.icon)!} alt="" width={20} height={20} className="rounded-full" />
                            ) : (
                                <div className="w-5 h-5 rounded-full bg-[#5865F2] flex items-center justify-center text-[10px] text-white">
                                    {selectedGuild.name.substring(0, 1)}
                                </div>
                            )}
                            <span className="text-white">{selectedGuild.name}</span>
                          </>
                      ) : (
                          <span className="text-muted-foreground">Select Server</span>
                      )}
                  </div>
                  <div className="text-white/30">
                     {isLoadingGuilds ? <Loader2 className="animate-spin" size={16}/> : '▼'}
                  </div>
               </div>

               {/* Dropdown Menu */}
               {isGuildOpen && !isLoadingGuilds && (
                   <>
                       <div className="fixed inset-0 z-40" onClick={() => setIsGuildOpen(false)} />
                       <div className="absolute top-full left-0 right-0 mt-2 bg-[#1e293b] border border-white/10 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
                           {guilds.length === 0 ? (
                               <div className="p-4 text-center text-muted-foreground text-sm">
                                   No Discord servers found.
                               </div>
                           ) : (
                               guilds.map((guild) => (
                               <div 
                                   key={guild.id}
                                   onClick={() => {
                                       setValue('discord_guild_id', guild.id, { shouldValidate: true });
                                       setValue('discord_text_channel_id', '', { shouldValidate: true });
                                       setIsGuildOpen(false);
                                   }}
                                   className="px-4 py-3 flex items-center gap-3 hover:bg-[#5865F2]/20 cursor-pointer transition-colors border-b border-white/5 last:border-0"
                               >
                                   {guild.icon ? (
                                       <Image src={getIconUrl(guild.id, guild.icon)!} alt="" width={32} height={32} className="rounded-full" />
                                   ) : (
                                       <div className="w-8 h-8 rounded-full bg-[#5865F2] flex items-center justify-center text-xs font-bold text-white">
                                           {guild.name.substring(0, 1)}
                                       </div>
                                   )}
                                   <div className="flex flex-col">
                                       <span className="text-sm font-bold text-white">{guild.name}</span>
                                   </div>
                               </div>
                           )))}
                       </div>
                   </>
               )}
               {guildError && <p className="text-xs text-red-500">Failed to load servers.</p>}
           </div>

           {/* Channel Selector */}
           <div className="space-y-2">
               <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                   <Hash size={12} /> Notification Channel
               </label>
               <div className="relative">
                   <Controller
                       control={control}
                       name="discord_text_channel_id"
                       render={({ field }) => (
                           <select
                               {...field}
                               className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#5865F2] transition-colors appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                               disabled={!selectedGuildId || isLoadingChannels}
                           >
                               <option value="" disabled>
                                   {selectedGuildId ? "Select Channel" : "Select Server First"}
                               </option>
                               {channels?.map((channel) => (
                                   <option key={channel.id} value={channel.id}>
                                       #{channel.name}
                                   </option>
                               ))}
                           </select>
                       )}
                   />
                   <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
                       {isLoadingChannels ? <Loader2 className="animate-spin" size={16}/> : '▼'}
                   </div>
               </div>
           </div>
       </div>

       <div className="bg-[#5865F2]/10 border border-[#5865F2]/20 rounded-lg p-4 text-xs text-[#5865F2] leading-relaxed flex gap-2">
           <AlertTriangle size={16} className="shrink-0 mt-0.5" />
           <span>
               <strong>Note:</strong> A contest announcement will be automatically posted to the selected Discord channel upon creation. Ensure the bot has permission to send messages.
           </span>
       </div>
    </div>
  );
}
