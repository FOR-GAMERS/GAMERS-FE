'use client';

import { Trophy, Users, Clock, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SummaryCardProps {
  label: string;
  value: string;
  subValue: string;
  icon: React.ReactNode;
}

function SummaryCard({ label, value, subValue, icon }: SummaryCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-white/5 bg-[#141418] p-6 group hover:bg-[#1A1A22] hover:border-white/10 transition-all transition-duration-300">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-black uppercase tracking-widest text-[#4A4A55] group-hover:text-[#7A7A85] transition-colors">{label}</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-[#4A4A55] group-hover:text-neon-mint transition-colors border border-white/5 shadow-inner">
          {icon}
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-[28px] font-black italic text-[#EEEEF0] leading-none mb-2 tracking-tighter">
          {value}
        </span>
        <span className="text-[13px] font-black text-[#5A5A65] uppercase tracking-tight">
          {subValue}
        </span>
      </div>
    </div>
  );
}

export function PlaygroundSummaryCards() {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full">
      <SummaryCard 
        label={t('playground.summary.current_round')}
        value={t('playground.summary.semi_final')}
        subValue={t('playground.summary.quarter_final_done')}
        icon={<Trophy className="w-4 h-4" />}
      />
      <SummaryCard 
        label={t('playground.summary.team_performance')}
        value={t('playground.summary.stats_format', { win: 3, loss: 0 })}
        subValue={t('playground.summary.win_rate_format', { rate: 100, rounds: '13.0' })}
        icon={<Zap className="w-4 h-4 text-neon-mint" />}
      />
      <SummaryCard 
        label={t('playground.summary.next_match')}
        value={t('playground.summary.next_match_format', { opponent: 'Team Delta' })}
        subValue={t('playground.summary.next_match_time', { time: '21:00' })}
        icon={<Clock className="w-4 h-4 text-neon-blue" />}
      />
      <SummaryCard 
        label={t('playground.summary.team_readiness')}
        value={t('playground.summary.readiness_format', { count: 4, total: 4 })}
        subValue={t('playground.summary.all_ready')}
        icon={<Users className="w-4 h-4 text-neon-mint" />}
      />
    </div>
  );
}
