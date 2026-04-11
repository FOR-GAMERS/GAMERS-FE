'use client';

import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ContestCreateFormValues } from './schema';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function ContestPreviewCard() {
  const { t } = useTranslation();
  const { watch } = useFormContext<ContestCreateFormValues>();

  const title = watch('title') || t('contests.create.basic.title_placeholder');
  const game = watch('game_type') || 'VALORANT';
  const maxTeams = watch('max_team_count') || 16;
  const thumbnail = watch('thumbnail');
  
  // For preview, we use a fixed status
  const status = 'OPEN';
  const participants = 0;
  const prize = 'TBD';

  const gameStyles = {
    VALORANT: {
      tag: 'bg-[#FF4655]/10 text-[#FF4655] border-[#FF4655]/20',
      label: 'VALORANT'
    },
    LOL: {
      tag: 'bg-[#0BC6E3]/10 text-[#0BC6E3] border-[#0BC6E3]/20',
      label: 'LOL'
    }
  };

  const currentStyle = gameStyles[game as keyof typeof gameStyles] || gameStyles.VALORANT;

  return (
    <div className="flex flex-col gap-4 sticky top-32">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-[11px] font-black text-[#7A7A85] uppercase tracking-[0.2em]">{t('contests.create.preview.live')}</h3>
        <div className="flex items-center gap-1.5">
           <div className="w-1.5 h-1.5 rounded-full bg-neon-mint animate-pulse" />
           <span className="text-[10px] font-bold text-neon-mint uppercase">{t('contests.create.preview.draft')}</span>
        </div>
      </div>

      <motion.div
        className="group relative flex w-full flex-col rounded-[24px] border border-white/5 bg-[#0C0C0F] p-6 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        {/* Background Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-neon-mint/5 blur-[80px] rounded-full" />

        {/* Thumbnail Preview */}
        <div className="relative w-full aspect-square rounded-2xl bg-[#141418] border border-white/5 mb-6 overflow-hidden">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt="Thumbnail Preview"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 opacity-20">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                   <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                   <circle cx="8.5" cy="8.5" r="1.5" />
                   <polyline points="21 15 16 10 5 21" />
                 </svg>
              </div>
               <span className="text-[10px] font-black uppercase tracking-widest text-center px-4">
                 {t('contests.create.preview.thumbnail_preview')}
               </span>
            </div>
          )}

          {/* Overlay Status */}
           <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/10">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-500 tracking-wider">
                {t('contests.create.preview.status')}
              </span>
           </div>
        </div>

        {/* Header Information */}
        <div className="flex flex-col gap-3 mb-6">
          <div className={cn(
            "w-fit px-3 py-1 rounded-lg border text-[10px] font-black tracking-widest transition-all",
            currentStyle.tag
          )}>
            {currentStyle.label}
          </div>
          
          <h3 className="text-xl font-black text-[#EEEEF0] leading-tight line-clamp-2 min-h-[3.5rem] transition-all group-hover:text-neon-mint">
            {title}
          </h3>
          
          <div className="flex items-center gap-2 text-[11px] font-bold text-[#7A7A85]">
             <span className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-[#1C1C21] border border-white/10" />
                {t('contests.create.preview.organizer')}
             </span>
             <span className="opacity-20">•</span>
             <span>{t('contests.create.preview.just_now')}</span>
           </div>
        </div>

        <div className="h-px bg-white/5 mb-6" />

        {/* Stats Grid */}
         <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex flex-col gap-1">
               <span className="text-[10px] font-black text-[#4A4A55] uppercase tracking-widest">
                 {t('contests.create.preview.entry_fee')}
               </span>
               <span className="text-lg font-black text-[#EEEEF0]">
                 {t('contests.create.preview.free')}
               </span>
            </div>
            <div className="flex flex-col gap-1 items-end">
               <span className="text-[10px] font-black text-[#4A4A55] uppercase tracking-widest">
                 {t('contests.create.preview.slots')}
               </span>
               <span className="text-lg font-black text-[#EEEEF0] tabular-nums">0 / {maxTeams}</span>
            </div>
         </div>

        {/* Action Button */}
         <div className="w-full h-12 bg-neon-mint rounded-xl flex items-center justify-center text-deep-black text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(110,231,183,0.3)] group-hover:shadow-[0_0_30px_rgba(110,231,183,0.5)] transition-all active:scale-95 cursor-not-allowed">
            {t('contests.create.preview.apply')}
         </div>
      </motion.div>
      
      {/* Visual Indicator */}
      <div className="bg-[#141418] border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
          <h4 className="text-[10px] font-black text-[#BBBBCB] uppercase tracking-wider flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-neon-mint" />
            {t('contests.create.preview.summary')}
          </h4>
          <div className="grid grid-cols-2 gap-2">
             <div className="p-2 rounded-lg bg-[#0C0C0F] border border-white/5 flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-[#4A4A55] uppercase">
                  {t('contests.create.preview.mode')}
                </span>
                <span className="text-[10px] font-black text-[#EEEEF0]">
                  {t('contests.create.preview.tournament')}
                </span>
             </div>
             <div className="p-2 rounded-lg bg-[#0C0C0F] border border-white/5 flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-[#4A4A55] uppercase">
                  {t('contests.create.preview.region')}
                </span>
                <span className="text-[10px] font-black text-[#EEEEF0]">
                  {t('contests.create.preview.asia')}
                </span>
             </div>
          </div>
      </div>
    </div>
  );
}
