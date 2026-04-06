'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

interface ContestCardProps {
  id: number | string;
  game: string;
  status: 'OPEN' | 'LIVE' | 'UPCOMING' | 'CLOSED';
  title: string;
  creator: string;
  date: string;
  prize: string;
  participants: number;
  maxParticipants: number;
  gameColor?: string;
}

const statusColors = {
  OPEN: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-500',
    dot: 'bg-emerald-500',
  },
  LIVE: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    text: 'text-red-500',
    dot: 'bg-red-500',
  },
  UPCOMING: {
    bg: 'bg-slate-400/10',
    border: 'border-slate-400/20',
    text: 'text-slate-400',
    dot: 'bg-slate-400',
  },
  CLOSED: {
    bg: 'bg-slate-600/10',
    border: 'border-slate-600/20',
    text: 'text-slate-600',
    dot: 'bg-slate-600',
  },
};

export function ContestCard({
  id,
  game,
  status,
  title,
  creator,
  date,
  prize,
  participants,
  maxParticipants,
  gameColor = 'bg-emerald-500/10',
}: ContestCardProps) {
  const { t } = useTranslation();
  const statusStyle = statusColors[status];
  const progress = (participants / maxParticipants) * 100;

  return (
    <Link href={`/contests/${id}`} className="block w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        className="group relative flex w-full flex-col rounded-2xl border border-white/5 bg-[#141418] p-6 transition-all hover:border-white/10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className={cn(
            "rounded py-1 px-3 border border-white/10 text-[11px] font-bold tracking-wider",
            gameColor
          )}>
            {game}
          </div>
          <div className={cn(
            "flex items-center gap-1.5 rounded py-1 px-2.5",
            statusStyle.bg
          )}>
            <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", statusStyle.dot)} />
            <span className={cn("font-barlow text-[11px] font-black tracking-widest", statusStyle.text)}>
              {t(`contests.detail.status.${status}`)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2 mb-6">
          <h3 className="font-pretendard text-xl font-bold leading-tight text-[#EEEEF0] group-hover:text-neon-mint transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-[13px] text-[#7A7A85]">
            <span>by {creator}</span>
            <span className="text-[#242428]">·</span>
            <span>{date}</span>
          </div>
        </div>

        <div className="h-[1px] bg-white/5 mb-6" />

        {/* Stats */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#7A7A85]">{t('contests.card.prize')}</span>
            <span className="font-barlow text-2xl font-bold text-[#EEEEF0]">{prize}</span>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#7A7A85]">{t('contests.card.participants')}</span>
            <span className="font-barlow text-2xl font-bold text-[#EEEEF0]">
              {participants} / {maxParticipants}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 h-1 w-full overflow-hidden rounded-full bg-[#242428]">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${progress}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={cn(
              "h-full rounded-full transition-all",
              status === 'LIVE' ? 'bg-red-500' : 'bg-neon-mint'
            )}
          />
        </div>

        {/* Action Button */}
        <div
          className={cn(
            "w-full rounded-lg py-3 text-sm font-bold transition-all text-center",
            status === 'CLOSED' || status === 'LIVE' 
              ? "bg-[#242428] text-[#7A7A85]" 
              : "bg-neon-mint text-deep-black group-hover:bg-neon-mint/90 active:scale-[0.98] shadow-[0_0_20px_rgba(110,231,183,0.2)]"
          )}
        >
          {status === 'CLOSED' || status === 'LIVE' ? t('contests.card.status_closed') : t('contests.card.apply')}
        </div>
      </motion.div>
    </Link>
  );
}
