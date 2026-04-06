'use client';

import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ContestCreateFormValues } from '../schema';
import { cn } from '@/lib/utils';
import { Minus, Plus, Search, Info } from 'lucide-react';
import { useState } from 'react';

const VALORANT_MAPS = ['Ascent', 'Bind', 'Haven', 'Split', 'Icebox', 'Lotus', 'Pearl', 'Sunset', 'Abyss'];
const VALORANT_AGENTS = ['Jett', 'Reyna', 'Omen', 'Sage', 'Phoenix', 'Sova', 'Killjoy', 'Cypher', 'Viper', 'Brimstone'];

export function ValorantSettings() {
  const { t } = useTranslation();
  const { register, watch, setValue } = useFormContext<ContestCreateFormValues>();
  const [searchTerm, setSearchTerm] = useState('');

  const selectedMaps = watch('valorant.mapPool') || [];
  const selectedAgents = watch('valorant.agentRestrictions') || [];
  const rounds = watch('valorant.roundsPerMatch') || 3;
  const format = watch('valorant.format') || 'TOURNAMENT';

  const toggleMap = (map: string) => {
    const newMaps = selectedMaps.includes(map)
      ? selectedMaps.filter((m) => m !== map)
      : [...selectedMaps, map];
    setValue('valorant.mapPool', newMaps);
  };

  const toggleAgent = (agent: string) => {
    const newAgents = selectedAgents.includes(agent)
      ? selectedAgents.filter((a) => a !== agent)
      : [...selectedAgents, agent];
    setValue('valorant.agentRestrictions', newAgents);
  };

  return (
    <div className="flex flex-col gap-8 p-8 rounded-2xl bg-[#0C0C0F] border border-white/5 mt-6 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-neon-mint uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-mint animate-pulse" />
          {t('contests.create.game.valorant_settings')}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Format Selection */}
        <div className="flex flex-col gap-3">
          <label className="text-[13px] font-bold text-[#BBBBCB]">
            {t('contests.create.game.format')}
            <span className="text-neon-mint ml-1">*</span>
          </label>
          <div className="flex items-center p-1 bg-[#141418] rounded-xl border border-white/5 w-fit shadow-inner">
            <button
              type="button"
              onClick={() => setValue('valorant.format', 'TOURNAMENT')}
              className={cn(
                "px-6 py-2.5 rounded-lg text-xs font-black transition-all flex items-center gap-2",
                format === 'TOURNAMENT' ? "bg-neon-mint text-deep-black shadow-lg shadow-neon-mint/20" : "text-[#7A7A85] hover:text-[#EEEEF0]"
              )}
            >
              <div className={cn("w-1.5 h-1.5 rounded-full", format === 'TOURNAMENT' ? "bg-deep-black" : "bg-white/10")} />
              {t('contests.create.game.format_tournament')}
            </button>
            <button
              type="button"
              onClick={() => setValue('valorant.format', 'LEAGUE')}
              className={cn(
                "px-6 py-2.5 rounded-lg text-xs font-black transition-all flex items-center gap-2",
                format === 'LEAGUE' ? "bg-neon-mint text-deep-black shadow-lg shadow-neon-mint/20" : "text-[#7A7A85] hover:text-[#EEEEF0]"
              )}
            >
              <div className={cn("w-1.5 h-1.5 rounded-full", format === 'LEAGUE' ? "bg-deep-black" : "bg-white/10")} />
              {t('contests.create.game.format_league')}
            </button>
          </div>
          <p className="text-[11px] font-medium text-[#4A4A55] flex items-center gap-1.5">
            <Info className="h-3 w-3" />
            {format === 'TOURNAMENT' 
              ? t('contests.create.game_settings.valorant.tournament_desc') 
              : t('contests.create.game_settings.valorant.league_desc')}
          </p>
        </div>

        {/* Map Pool */}
        <div className="flex flex-col gap-3">
          <label className="text-[13px] font-bold text-[#BBBBCB]">
            {t('contests.create.game.map_pool')}
          </label>
          <div className="flex flex-wrap gap-2">
            {VALORANT_MAPS.map((map) => (
              <button
                key={map}
                type="button"
                onClick={() => toggleMap(map)}
                className={cn(
                  "px-4 py-2 rounded-lg text-[11px] font-black border transition-all duration-200",
                  selectedMaps.includes(map) 
                    ? "bg-neon-mint/10 border-neon-mint text-neon-mint shadow-[0_0_15px_rgba(110,231,183,0.1)]" 
                    : "bg-[#141418] border-white/5 text-[#7A7A85] hover:border-white/10 hover:text-[#EEEEF0]"
                )}
              >
                {map}
              </button>
            ))}
          </div>
        </div>

        {/* Agent Restrictions */}
        <div className="flex flex-col gap-3">
          <label className="text-[13px] font-bold text-[#BBBBCB]">
            {t('contests.create.game.agent_restrictions')}
          </label>
          <div className="relative group">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#4A4A55] group-focus-within:text-neon-mint transition-colors" />
             <input
               className="w-full bg-[#141418] border border-white/5 rounded-xl px-9 py-2.5 text-xs font-medium focus:outline-none focus:border-neon-mint transition-all"
               placeholder={t('contests.create.game.placeholder_agent')}
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {VALORANT_AGENTS.filter(a => a.toLowerCase().includes(searchTerm.toLowerCase())).map((agent) => (
              <button
                key={agent}
                type="button"
                onClick={() => toggleAgent(agent)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-black border transition-all",
                  selectedAgents.includes(agent) 
                    ? "bg-[#BBBBCB] border-transparent text-deep-black" 
                    : "bg-[#1C1C21] border-white/5 text-[#7A7A85] hover:bg-[#242428]"
                )}
              >
                {agent}
              </button>
            ))}
          </div>
        </div>

        {/* Rounds per Match */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-bold text-[#BBBBCB]">
              {t('contests.create.game.rounds_per_match')}
            </label>
            <span className="text-[11px] font-black text-neon-mint uppercase bg-neon-mint/5 px-2 py-0.5 rounded border border-neon-mint/10">Bo{rounds}</span>
          </div>
          <div className="flex items-center justify-between bg-[#141418] border border-white/5 rounded-xl p-2 shadow-inner">
            <button
              type="button"
              onClick={() => setValue('valorant.roundsPerMatch', Math.max(1, rounds - 1))}
              className="w-10 h-10 rounded-lg bg-[#0C0C0F] border border-white/5 text-[#7A7A85] hover:text-neon-mint hover:bg-[#1C1C21] transition-all flex items-center justify-center shadow-md active:scale-90"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="text-lg font-black text-[#EEEEF0] tabular-nums">{rounds}</span>
            <button
              type="button"
              onClick={() => setValue('valorant.roundsPerMatch', Math.min(13, rounds + 1))}
              className="w-10 h-10 rounded-lg bg-[#0C0C0F] border border-white/5 text-[#7A7A85] hover:text-neon-mint hover:bg-[#1C1C21] transition-all flex items-center justify-center shadow-md active:scale-90"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <p className="text-[11px] font-medium text-[#4A4A55] text-right">
            Bo{rounds} ({t('contests.create.game.win_condition', { count: Math.ceil(rounds/2) })})
          </p>
        </div>
      </div>
    </div>
  );
}
