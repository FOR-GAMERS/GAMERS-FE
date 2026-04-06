'use client';

import { Swords } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface BracketItemProps {
  round: string;
  status: string;
  teamA: string;
  teamB: string;
  isActive?: boolean;
}

function BracketItem({ round, status, teamA, teamB, isActive }: BracketItemProps) {
  return (
    <div className={cn(
      "flex flex-col gap-2 p-4 rounded-2xl border transition-all",
      isActive ? "bg-neon-mint/5 border-neon-mint/20" : "bg-black/20 border-white/5"
    )}>
      <div className="flex items-center justify-between">
        <span className={cn(
          "text-[10px] font-black uppercase tracking-wider",
          isActive ? "text-neon-mint" : "text-[#4A4A55]"
        )}>{round} · {status}</span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1 flex-1">
          <span className="text-[13px] font-black text-[#EEEEF0] leading-none mb-0.5">{teamA}</span>
          <span className="text-[13px] font-black text-[#EEEEF0] leading-none">{teamB}</span>
        </div>
        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-white/5 border border-white/5 text-[#4A4A55]">
           <Swords className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}

export function PlaygroundBracketPreview() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-white/5 bg-[#141418] p-8 h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-[17px] font-black italic tracking-tighter text-[#EEEEF0]">{t('common.bracket.title')}</h3>
        <button className="text-[11px] font-black uppercase tracking-widest text-[#4A4A55] hover:text-[#7A7A85]">{t('common.recent_matches.view_details')}</button>
      </div>

      <div className="flex flex-col gap-4">
        <BracketItem 
          round={t('playground.rounds.quarter_final')}
          status={t('common.status.completed')}
          teamA={`Antigravity (${t('common.recent_matches.win')})`}
          teamB={`Team Beta (${t('common.recent_matches.loss')})`}
        />
        <BracketItem 
          round={t('playground.rounds.semi_final')}
          status={t('common.status.active')}
          teamA="Antigravity"
          teamB="Team Delta"
          isActive
        />
        <BracketItem 
          round={t('playground.rounds.final')}
          status={t('common.status.pending')}
          teamA={t('common.bracket.winner_tbd')}
          teamB={t('common.bracket.winner_tbd')}
        />
      </div>
    </div>
  );
}
