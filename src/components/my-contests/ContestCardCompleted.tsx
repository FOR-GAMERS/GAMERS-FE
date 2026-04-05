'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, XCircle, ChevronRight } from 'lucide-react';

interface CompletedProps {
  id: string;
  game: 'Valorant' | 'League of Legends' | 'CS2' | string;
  title: string;
  date: string;
  rank: number;
  totalTeams: number;
  prize: string;
  record: {
    wins: number;
    losses: number;
  };
  resultLabel?: string;
  resultType?: 'winner' | 'runnerup' | 'none';
}

export function ContestCardCompleted({
  game,
  title,
  date,
  rank,
  totalTeams,
  prize,
  record,
  resultLabel,
  resultType
}: CompletedProps) {
  const { t } = useTranslation();

  const isWinner = rank === 1 || resultType === 'winner';
  const isRunnerUp = rank === 2 || resultType === 'runnerup';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group flex flex-col gap-5 rounded-3xl border border-white/5 bg-[#141418] p-6 transition-all hover:bg-[#1A1A20] hover:border-white/10"
    >
      <div className="flex items-center justify-between">
        <span className="rounded-lg bg-white/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#4A4A55] border border-white/5">
          {game}
        </span>
        
        <div className={cn(
          "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-black border",
          isWinner ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
          isRunnerUp ? "bg-slate-400/10 text-slate-300 border-slate-400/20" :
          "bg-white/5 text-[#7A7A85] border-white/5"
        )}>
          {isWinner ? <Trophy className="w-3 h-3" /> : isRunnerUp ? <Medal className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
          {resultLabel || `${rank}${t('my_contests.card.rank_suffix')}`}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <h4 className="text-[17px] font-black italic tracking-tight text-[#EEEEF0] line-clamp-1 group-hover:text-neon-mint transition-colors">
          {title}
        </h4>
        <p className="text-[12px] font-bold text-[#4A4A55] tracking-tight">{date} {t('my_contests.card.completed_suffix')}</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center justify-center gap-1.5 rounded-xl bg-white/[0.02] border border-white/5 py-4">
          <span className="text-[14px] font-black text-[#EEEEF0] italic leading-none">{rank}{t('my_contests.card.rank_suffix')}</span>
          <span className="text-[9px] font-black text-[#4A4A55] uppercase tracking-widest leading-none">{t('my_contests.card.final_rank')}</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1.5 rounded-xl bg-white/[0.02] border border-white/5 py-4">
          <span className={cn(
            "text-[14px] font-black italic leading-none",
            prize !== '—' ? "text-[#EEEEF0]" : "text-[#4A4A55]"
          )}>{prize}</span>
          <span className="text-[9px] font-black text-[#4A4A55] uppercase tracking-widest leading-none">{t('my_contests.card.prize_earned')}</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1.5 rounded-xl bg-white/[0.02] border border-white/5 py-4">
          <span className="text-[14px] font-black text-[#EEEEF0] italic leading-none">{record.wins}W{record.losses}L</span>
          <span className="text-[9px] font-black text-[#4A4A55] uppercase tracking-widest leading-none">{t('my_contests.card.total_record')}</span>
        </div>
      </div>

      <Button 
        variant="ghost" 
        className="h-10 w-full border border-white/5 bg-white/5 text-[12px] font-bold text-[#BBBBCB] hover:bg-white/10 hover:text-white rounded-xl"
      >
        {t('my_contests.card.view_results')}
      </Button>
    </motion.div>
  );
}
