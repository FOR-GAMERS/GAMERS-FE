'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Clock, Users, Trophy, ExternalLink, ChevronRight } from 'lucide-react';

interface ParticipatingProps {
  id: string;
  game: 'Valorant' | 'League of Legends' | string;
  title: string;
  host: string;
  date: string;
  statusText: string;
  formatText: string;
  myTeam: {
    name: string;
    logo?: string;
    membersCount: number;
  };
  nextMatch?: {
    opponent: string;
    time: string;
  };
  participantsProgress?: {
    current: number;
    max: number;
    isFull?: boolean;
  };
  startDate?: string;
  record: {
    wins: number;
    losses: number;
    isUnbeatable?: boolean;
  };
  prize: string;
  isLive?: boolean;
  actionType?: 'stadium' | 'distribution';
}

export function ContestCardParticipating({
  id,
  game,
  title,
  host,
  date,
  statusText,
  formatText,
  myTeam,
  nextMatch,
  participantsProgress,
  startDate,
  record,
  prize,
  isLive,
  actionType = 'stadium'
}: ParticipatingProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const handleAction = () => {
    if (actionType === 'stadium') {
      router.push(`/contests/${id}/playground`);
    } else {
      // Handle other action types if needed
      console.log('Action type:', actionType);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex flex-col gap-6 rounded-[32px] border border-white/5 bg-[#141418] p-8 transition-all hover:bg-[#1A1A20] hover:border-white/10"
    >
      {/* Left Border Accent */}
      <div className={cn(
        "absolute top-1/2 left-0 -translate-y-1/2 w-[4px] h-[75%] rounded-r-full shadow-[2px_0_8px_rgba(0,0,0,0.4)]",
        game === 'Valorant' ? "bg-neon-red shadow-[0_0_15px_rgba(224,92,92,0.4)]" : "bg-neon-blue shadow-[0_0_15px_rgba(43,127,255,0.4)]"
      )} />

      {/* Header Info */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
             <span className="rounded-lg bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#7A7A85] border border-white/5">
               {game}
             </span>
             {isLive ? (
               <span className="flex items-center gap-1.5 rounded-lg bg-neon-red/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-neon-red border border-neon-red/20">
                 <span className="relative flex h-1.5 w-1.5">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-red opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-neon-red"></span>
                 </span>
                 LIVE
               </span>
             ) : (
               <span className="flex items-center gap-1.5 rounded-lg bg-neon-mint/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-neon-mint border border-neon-mint/20">
                 OPEN
               </span>
             )}
          </div>
          
          <div className="flex flex-col gap-1.5">
            <h3 className="text-2xl font-black italic tracking-tighter text-[#EEEEF0] group-hover:text-neon-mint transition-colors leading-[1.1]">
              {title}
            </h3>
            <p className="text-[13px] font-bold text-[#5A5A65]">
              {host} · {date}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5 text-right mt-1">
          <div className="rounded-xl bg-white/5 border border-white/5 px-4 py-2 flex flex-col items-end">
            <span className="text-[15px] font-black italic text-neon-mint leading-none tracking-tight">{statusText}</span>
            <span className="text-[10px] font-black text-[#5A5A65] uppercase tracking-[0.1em] mt-1">{formatText}</span>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* My Team */}
        <div className="flex flex-col gap-3 rounded-2xl bg-black/20 p-5 border border-white/5">
          <span className="text-[10px] font-black uppercase tracking-[0.1em] text-[#4A4A55]">
            {t('my_contests.card.my_team')}
          </span>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 font-barlow text-sm font-black text-neon-mint border border-white/5">
              {myTeam.logo || myTeam.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-black text-[#EEEEF0] leading-tight tracking-tight">{myTeam.name}</span>
              <span className="text-[11px] font-bold text-[#5A5A65]">{t('my_contests.card.members_participating', { count: myTeam.membersCount })}</span>
            </div>
          </div>
        </div>

        {/* Middle Stats - Context Dependent */}
        {isLive ? (
          <>
            {/* Next Match */}
            <div className="flex flex-col gap-3 rounded-2xl bg-black/30 p-5 border border-white/5 group/stat hover:border-white/10 transition-colors">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#4A4A55] group-hover/stat:text-[#7A7A85] transition-colors">
                {t('my_contests.card.next_match')}
              </span>
              {nextMatch ? (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-neon-mint border border-white/5 group-hover/stat:border-neon-mint/30 transition-colors">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[15px] font-black text-[#EEEEF0] leading-tight">vs {nextMatch.opponent}</span>
                    <span className="text-[11px] font-bold text-neon-mint">{nextMatch.time}</span>
                  </div>
                </div>
              ) : (
                 <div className="flex h-10 items-center text-[13px] font-bold text-[#3A3A45]">
                   {t('my_contests.card.no_record')}
                 </div>
              )}
            </div>

            {/* My Record */}
            <div className="flex flex-col gap-3 rounded-2xl bg-black/30 p-5 border border-white/5 group/stat hover:border-white/10 transition-colors">
              <span className="text-[10px] font-black uppercase tracking-[0.1em] text-[#4A4A55] group-hover/stat:text-[#5A5A65] transition-colors">
                {t('my_contests.card.my_record')}
              </span>
              <div className="flex items-center gap-2.5">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black italic text-[#EEEEF0]">{record.wins}</span>
                  <span className="text-[11px] font-black text-[#4A4A55]">W</span>
                  <span className="mx-1 text-[#4A4A55] opacity-30">·</span>
                  <span className="text-xl font-black italic text-neon-red">{record.losses}</span>
                  <span className="text-[11px] font-black text-[#4A4A55]">L</span>
                </div>
                {record.isUnbeatable && (
                  <span className="rounded-md bg-neon-mint/5 border border-neon-mint/20 px-2 py-0.5 text-[9px] font-black text-neon-mint tracking-wider uppercase">
                    {t('my_contests.card.unbeatable')}
                  </span>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Participants Progress (OPEN state) */}
            <div className="flex flex-col gap-3 rounded-2xl bg-black/30 p-5 border border-white/5 group/stat hover:border-white/10 transition-colors">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#4A4A55] group-hover/stat:text-[#7A7A85] transition-colors">
                {t('my_contests.card.participants_status')}
              </span>
              {participantsProgress ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black italic text-[#EEEEF0]">{participantsProgress.current}</span>
                    <span className="text-[13px] font-black text-[#4A4A55] opacity-50">/</span>
                    <span className="text-[15px] font-black text-[#7A7A85]">{participantsProgress.max}{t('my_contests.card.team_suffix')}</span>
                    {participantsProgress.isFull && (
                      <span className="ml-auto text-[10px] font-black text-neon-red uppercase tracking-wider">{t('my_contests.card.full')}</span>
                    )}
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        participantsProgress.isFull ? "bg-neon-red" : "bg-neon-mint"
                      )} 
                      style={{ width: `${(participantsProgress.current / participantsProgress.max) * 100}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex h-10 items-center text-[13px] font-bold text-[#3A3A45]">
                  {t('my_contests.card.no_info')}
                </div>
              )}
            </div>

            {/* Start Date (OPEN state) */}
            <div className="flex flex-col gap-3 rounded-2xl bg-black/30 p-5 border border-white/5 group/stat hover:border-white/10 transition-colors">
              <span className="text-[10px] font-black uppercase tracking-[0.1em] text-[#4A4A55] group-hover/stat:text-[#5A5A65] transition-colors">
                {t('my_contests.card.contest_start')}
              </span>
              <div className="flex flex-col">
                <span className="text-[17px] font-black text-[#EEEEF0] italic leading-tight">{startDate}</span>
                <span className="text-[11px] font-black text-neon-blue uppercase tracking-tight opacity-80">D-8</span>
              </div>
            </div>
          </>
        )}

        {/* Prize */}
        <div className="flex flex-col gap-3 rounded-2xl bg-black/30 p-5 border border-white/5 group/stat hover:border-white/10 transition-colors">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#4A4A55] group-hover/stat:text-[#7A7A85] transition-colors">
            {t('my_contests.card.prize')}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black italic text-neon-mint tracking-tight shadow-[0_0_15px_rgba(0,212,122,0.1)]">{prize}</span>
            <span className="text-[11px] font-bold text-[#4A4A55]">{t('my_contests.card.prize_earned')}</span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-2 flex items-center justify-end gap-3">
        <Button 
          variant="ghost" 
          className="h-12 border border-white/5 bg-white/5 text-[13px] font-black text-[#BBBBCB] hover:bg-white/10 hover:text-white px-8 rounded-xl"
        >
          {t('my_contests.card.view_details')}
        </Button>
        <Button 
          onClick={handleAction}
          className={cn(
            "h-12 px-8 text-[13px] font-black rounded-xl gap-2 shadow-lg transition-all active:scale-95",
            actionType === 'stadium' 
              ? "bg-neon-red text-white hover:bg-neon-red/90 shadow-neon-red/20" 
              : "bg-neon-blue text-white hover:bg-neon-blue/90 shadow-neon-blue/20"
          )}
        >
          {actionType === 'stadium' ? (
            <>
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                ▶
              </motion.span>
              {t('my_contests.card.enter_stadium')}
            </>
          ) : (
            <>
              <ExternalLink className="w-4 h-4" />
              {t('my_contests.card.team_distribution')}
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
