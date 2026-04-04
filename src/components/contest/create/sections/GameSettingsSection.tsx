'use client';

import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ContestCreateFormValues } from '../schema';
import { cn } from '@/lib/utils';
import { ValorantSettings } from './ValorantSettings';
import { LoLSettings } from './LoLSettings';
import { motion, AnimatePresence } from 'framer-motion';

export function GameSettingsSection() {
  const { t } = useTranslation();
  const { watch, setValue } = useFormContext<ContestCreateFormValues>();

  const selectedGame = watch('game');

  const games = [
    { id: 'VALORANT' as const, name: 'VALORANT', color: 'text-[#FF4655]' },
    { id: 'LOL' as const, name: 'League of Legends', color: 'text-[#0BC6E3]' },
  ];

  return (
    <section id="game_settings" className="scroll-mt-32 flex flex-col gap-8 w-full max-w-4xl mx-auto py-12 border-b border-white/5">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-black text-[#EEEEF0] tracking-tight flex items-center gap-3">
          <span className="w-2 h-8 bg-neon-mint rounded-full" />
          {t('contests.create.sections.game_settings')}
        </h2>
        <p className="text-sm font-medium text-[#7A7A85]">
          대회에서 진행할 게임의 세부 규칙을 설정합니다.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <label className="text-[13px] font-bold text-[#BBBBCB]">
          {t('contests.create.game.select_game')}
          <span className="text-neon-mint ml-1">*</span>
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {games.map((game) => (
            <button
              key={game.id}
              type="button"
              onClick={() => setValue('game', game.id)}
              className={cn(
                "relative group flex items-center gap-4 p-6 rounded-2xl border transition-all duration-300",
                selectedGame === game.id
                  ? "bg-white/5 border-neon-mint/50 shadow-[0_0_30px_rgba(110,231,183,0.1)]"
                  : "bg-[#0C0C0F] border-white/5 hover:border-white/10 hover:bg-white/[0.02]"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center bg-[#141418] border transition-all group-hover:scale-110",
                selectedGame === game.id ? "border-neon-mint/30 shadow-[0_0_15px_rgba(110,231,183,0.1)]" : "border-white/5"
              )}>
                {/* Game Icon Placeholder or Initial */}
                <span className={cn("text-lg font-black", game.color)}>
                  {game.id === 'VALORANT' ? 'V' : 'L'}
                </span>
              </div>
              
              <div className="flex flex-col items-start gap-1">
                <span className={cn(
                  "text-sm font-black transition-colors uppercase tracking-widest",
                  selectedGame === game.id ? "text-neon-mint" : "text-[#EEEEF0]"
                )}>
                  {game.name}
                </span>
                <span className="text-[11px] font-medium text-[#7A7A85]">
                  {game.id === 'VALORANT' ? '5:5 Tactical Shooter' : '5:5 MOBA'}
                </span>
              </div>

              {selectedGame === game.id && (
                <div className="absolute top-4 right-4 animate-in fade-in zoom-in duration-300">
                   <div className="w-5 h-5 rounded-full bg-neon-mint flex items-center justify-center shadow-[0_0_15px_rgba(110,231,183,0.5)]">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 3L4.5 8.5L2 6" stroke="#0C0C0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                   </div>
                </div>
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {selectedGame === 'VALORANT' && (
            <motion.div
              key="valorant"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full"
            >
              <ValorantSettings />
            </motion.div>
          )}

          {selectedGame === 'LOL' && (
            <motion.div
              key="lol"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full"
            >
              <LoLSettings />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
