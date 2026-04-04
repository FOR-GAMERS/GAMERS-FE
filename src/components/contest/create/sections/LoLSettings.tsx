'use client';

import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ContestCreateFormValues } from '../schema';
import { cn } from '@/lib/utils';
import { Search, Info } from 'lucide-react';
import { useState } from 'react';

const LOL_CHAMPIONS = ['Ahri', 'Akali', 'Alistar', 'Amumu', 'Anivia', 'Annie', 'Ashe', 'Aurelion Sol', 'Azir', 'Bard', 'Bel\'Veth', 'Blitzcrank', 'Brand', 'Braum', 'Caitlyn', 'Camille', 'Cassiopeia', 'Cho\'Gath', 'Corki', 'Darius', 'Diana', 'Dr. Mundo', 'Draven', 'Ekko', 'Elise', 'Evelynn', 'Ezreal', 'Fiddlesticks', 'Fiora', 'Fizz', 'Galio', 'Gangplank', 'Garen', 'Gnar', 'Gragas', 'Graves', 'Gwen', 'Hecarim', 'Heimerdinger', 'Illaoi', 'Irelia', 'Ivern', 'Janna', 'Jarvan IV', 'Jax', 'Jayce', 'Jhin', 'Jinx', 'K\'Sante', 'Kai\'Sa', 'Kalista', 'Karma', 'Karthus', 'Kassadin', 'Katarina', 'Kayle', 'Kayn', 'Kennen', 'Kha\'Zix', 'Kindred', 'Kled', 'Kog\'Maw', 'LeBlanc', 'Lee Sin', 'Leona', 'Lillia', 'Lissandra', 'Lucian', 'Lulu', 'Lux', 'Malphite', 'Malzahar', 'Maokai', 'Master Yi', 'Milio', 'Miss Fortune', 'Mordekaiser', 'Morgana', 'Naafiri', 'Nami', 'Nasus', 'Nautilus', 'Neeko', 'Nidalee', 'Nilah', 'Nocturne', 'Nunu & Willump', 'Olaf', 'Orianna', 'Ornn', 'Pantheon', 'Poppy', 'Pyke', 'Qiyana', 'Quinn', 'Rakan', 'Rammus', 'Rek\'Sai', 'Rell', 'Renata Glasc', 'Renekton', 'Rengar', 'Riven', 'Rumble', 'Ryze', 'Samira', 'Sejuani', 'Senna', 'Seraphine', 'Sett', 'Shaco', 'Shen', 'Shyvana', 'Singed', 'Sion', 'Sivir', 'Skarner', 'Sona', 'Soraka', 'Swain', 'Sylas', 'Syndra', 'Tahm Kench', 'Taliyah', 'Talon', 'Taric', 'Teemo', 'Thresh', 'Tristana', 'Trundle', 'Tryndamere', 'Twisted Fate', 'Twitch', 'Udyr', 'Urgot', 'Varus', 'Vayne', 'Veigar', 'Vel\'Koz', 'Vex', 'Vi', 'Viego', 'Viktor', 'Vladimir', 'Volibear', 'Warwick', 'Wukong', 'Xayah', 'Xerath', 'Xin Zhao', 'Yasuo', 'Yone', 'Yorick', 'Yuumi', 'Zac', 'Zed', 'Zeri', 'Ziggs', 'Zilean', 'Zoe', 'Zyra'];

export function LoLSettings() {
  const { t } = useTranslation();
  const { watch, setValue } = useFormContext<ContestCreateFormValues>();
  const [searchTerm, setSearchTerm] = useState('');

  const selectedChampions = watch('lol.championRestrictions') || [];
  const format = watch('lol.format') || 'TOURNAMENT';
  const patch = watch('lol.patchVersion') || '14.6';

  const toggleChampion = (champion: string) => {
    const newChampions = selectedChampions.includes(champion)
      ? selectedChampions.filter((c) => c !== champion)
      : [...selectedChampions, champion];
    setValue('lol.championRestrictions', newChampions);
  };

  return (
    <div className="flex flex-col gap-8 p-8 rounded-2xl bg-[#0C0C0F] border border-white/5 mt-6 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-neon-mint uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-mint animate-pulse" />
          {t('contests.create.game.lol_settings')}
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
              onClick={() => setValue('lol.format', 'TOURNAMENT')}
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
              onClick={() => setValue('lol.format', 'LEAGUE')}
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
              ? '토너먼트: 드래프트 픽 규칙이 적용되는 다단계 토너먼트입니다.' 
              : '리그: 풀리그 방식으로 모든 팀과 경기합니다.'}
          </p>
        </div>

        {/* Patch Version */}
        <div className="flex flex-col gap-3">
          <label className="text-[13px] font-bold text-[#BBBBCB]">
            {t('contests.create.game.patch_version')}
          </label>
          <select
            value={patch}
            onChange={(e) => setValue('lol.patchVersion', e.target.value)}
            className="w-full bg-[#141418] border border-white/5 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-neon-mint transition-all appearance-none cursor-pointer"
          >
            <option value="14.6">14.6 (Latest)</option>
            <option value="14.5">14.5</option>
            <option value="14.4">14.4</option>
            <option value="Pro-14.2">LCP Pro Patch (14.2)</option>
          </select>
        </div>

        {/* Champion Restrictions */}
        <div className="flex flex-col gap-3 md:col-span-2">
          <label className="text-[13px] font-bold text-[#BBBBCB]">
            {t('contests.create.game.champion_restrictions')}
          </label>
          <div className="relative group max-w-md">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#4A4A55] group-focus-within:text-neon-mint transition-colors" />
             <input
               className="w-full bg-[#141418] border border-white/5 rounded-xl px-9 py-2.5 text-xs font-medium focus:outline-none focus:border-neon-mint transition-all"
               placeholder={t('contests.create.game.placeholder_champion')}
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          
          <div className="mt-4 bg-[#141418] border border-white/5 rounded-2xl p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {LOL_CHAMPIONS.filter(c => c.toLowerCase().includes(searchTerm.toLowerCase())).map((champion) => (
                <button
                  key={champion}
                  type="button"
                  onClick={() => toggleChampion(champion)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-2 rounded-xl transition-all border group",
                    selectedChampions.includes(champion)
                      ? "bg-neon-mint/5 border-neon-mint/30 shadow-[0_0_15px_rgba(110,231,183,0.05)]"
                      : "bg-[#0C0C0F] border-white/5 hover:border-white/10"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-lg bg-[#1C1C21] border flex items-center justify-center text-[10px] font-black uppercase transition-all overflow-hidden",
                    selectedChampions.includes(champion) ? "border-neon-mint/50 scale-105" : "border-white/5 grayscale group-hover:grayscale-0 group-hover:scale-105"
                  )}>
                    {/* Placeholder for champion icon */}
                    <span className={cn(
                      selectedChampions.includes(champion) ? "text-neon-mint" : "text-[#4A4A55]"
                    )}>{champion.substring(0, 2)}</span>
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold text-center truncate w-full",
                    selectedChampions.includes(champion) ? "text-neon-mint" : "text-[#7A7A85]"
                  )}>{champion}</span>
                  
                  {selectedChampions.includes(champion) && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-neon-mint rounded-full shadow-[0_0_8px_rgba(110,231,183,1)]" />
                  )}
                </button>
              ))}
            </div>
            
            {/* Selected Count */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
               <span className="text-[11px] font-medium text-[#4A4A55]">
                 검색 결과: <span className="text-[#EEEEF0] font-bold">{LOL_CHAMPIONS.filter(c => c.toLowerCase().includes(searchTerm.toLowerCase())).length}</span>개
               </span>
               <span className="text-[11px] font-medium text-[#4A4A55]">
                 제한된 챔피언: <span className="text-neon-mint font-bold">{selectedChampions.length}</span>명
               </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
