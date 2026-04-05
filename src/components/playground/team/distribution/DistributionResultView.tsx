'use client';

import { motion } from 'framer-motion';
import { RefreshCcw, Copy, RotateCcw, Share2, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import type { Participant } from './ParticipantGrid';

interface DistributionResultViewProps {
  blueTeam: Participant[];
  redTeam: Participant[];
  onReroll: () => void;
  onNewSession: () => void;
  className?: string;
}

export function DistributionResultView({ blueTeam, redTeam, onReroll, onNewSession, className }: DistributionResultViewProps) {
  const { t } = useTranslation();

  const handleCopy = () => {
    const text = [
      `[${t('playground.team_distribution.result.blue_side')}]`,
      ...blueTeam.map(p => `${t(`playground.team_distribution.roles.${p.role}`)}: ${p.name} (${t(`playground.team_distribution.tiers.${p.tier}`)})`),
      '',
      `[${t('playground.team_distribution.result.red_side')}]`,
      ...redTeam.map(p => `${t(`playground.team_distribution.roles.${p.role}`)}: ${p.name} (${t(`playground.team_distribution.tiers.${p.tier}`)})`),
    ].join('\n');
    
    navigator.clipboard.writeText(text);
    alert(t('playground.team.copied'));
  };

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden lg:block">
          <div className="bg-[#0C0C0D] border border-white/10 rounded-full px-6 py-2 text-[14px] font-black text-white italic tracking-widest shadow-2xl">
            VS
          </div>
        </div>

        {/* Blue Team */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-sky-500/10 border border-sky-500/20">
            <div className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
            <h4 className="text-[14px] font-black text-sky-500 uppercase tracking-widest italic">{t('playground.team_distribution.result.blue_side')}</h4>
          </div>

          <div className="flex flex-col gap-2">
            {blueTeam.map((p, i) => (
              <TeamMemberCard key={p.id} participant={p} side="blue" delay={i * 0.1} />
            ))}
          </div>
        </div>

        {/* Red Team */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-ruby/10 border border-ruby/20 flex-row-reverse">
            <div className="h-2 w-2 rounded-full bg-ruby animate-pulse" />
            <h4 className="text-[14px] font-black text-ruby uppercase tracking-widest italic">{t('playground.team_distribution.result.red_side')}</h4>
          </div>

          <div className="flex flex-col gap-2">
            {redTeam.map((p, i) => (
              <TeamMemberCard key={p.id} participant={p} side="red" delay={i * 0.1} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-white/[0.02] border border-white/5 mt-4">
         <div className="flex items-center gap-6">
            <div className="flex flex-col">
               <span className="text-[10px] font-bold text-[#5A5A65] tracking-widest uppercase">MATCH QUALITY</span>
               <div className="flex items-center gap-2 mt-0.5">
                  <TrendingUp className="h-4 w-4 text-neon-mint" />
                  <span className="text-[16px] font-black text-[#EEEEF0] italic">94.2%</span>
               </div>
            </div>
         </div>

         <div className="flex items-center gap-3">
            <button
              onClick={onReroll}
              className="flex items-center gap-2 bg-[#0C0C0D] border border-white/10 text-[#EEEEF0] h-12 px-6 rounded-2xl text-[13px] font-black transition-all hover:bg-white/5 hover:border-white/20 active:scale-95"
            >
              <RefreshCcw className="h-4 w-4 text-[#5A5A65]" />
              <span>{t('playground.team_distribution.result.reroll')}</span>
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 bg-[#0C0C0D] border border-white/10 text-[#EEEEF0] h-12 px-6 rounded-2xl text-[13px] font-black transition-all hover:bg-white/5 hover:border-white/20 active:scale-95"
            >
              <Copy className="h-4 w-4 text-[#5A5A65]" />
              <span>{t('playground.team_distribution.result.copy_result')}</span>
            </button>
            <button
              onClick={onNewSession}
              className="flex items-center gap-2 bg-neon-mint text-black h-12 px-6 rounded-2xl text-[13px] font-black transition-all hover:brightness-110 active:scale-95"
            >
              <RotateCcw className="h-4 w-4" />
              <span>{t('playground.team_distribution.result.new_session')}</span>
            </button>
         </div>
      </div>
    </div>
  );
}

function TeamMemberCard({ participant, side, delay }: { participant: Participant; side: 'blue' | 'red'; delay: number }) {
  const { t } = useTranslation();
  
  return (
    <motion.div
      initial={{ opacity: 0, x: side === 'blue' ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={cn(
        "group relative flex items-center justify-between p-4 rounded-2xl border transition-all truncate",
        side === 'blue' 
          ? "bg-sky-500/5 border-sky-500/10 hover:border-sky-500/30" 
          : "bg-ruby/5 border-ruby/10 hover:border-ruby/30 flex-row-reverse"
      )}
    >
      <div className={cn("flex items-center gap-4", side === 'red' && "flex-row-reverse")}>
         <div className={cn(
           "flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-black",
           side === 'blue' ? "bg-sky-500/20 text-sky-500" : "bg-ruby/20 text-ruby"
         )}>
           {participant.name[0]?.toUpperCase()}
         </div>
         <div className={cn("flex flex-col", side === 'red' && "items-end")}>
           <span className="text-[15px] font-black text-[#EEEEF0]">{participant.name}</span>
           <span className="text-[11px] font-bold text-[#5A5A65] tracking-widest uppercase">
              {t(`playground.team_distribution.tiers.${participant.tier}`)}
           </span>
         </div>
      </div>

      <div className={cn(
        "flex h-8 px-4 items-center justify-center rounded-lg text-[11px] font-black tracking-widest",
        side === 'blue' ? "bg-sky-500/20 text-sky-500" : "bg-ruby/20 text-ruby"
      )}>
        {t(`playground.team_distribution.roles.${participant.role}`)}
      </div>
      
      {/* Glow Effect */}
      <div className={cn(
        "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10",
        side === 'blue' ? "bg-sky-500/20" : "bg-ruby/20"
      )} />
    </motion.div>
  );
}
