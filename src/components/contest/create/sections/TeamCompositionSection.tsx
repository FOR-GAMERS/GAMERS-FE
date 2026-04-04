'use client';

import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ContestCreateFormValues } from '../schema';
import { cn } from '@/lib/utils';
import { Users, UserPlus, Zap, Minus, Plus } from 'lucide-react';

export function TeamCompositionSection() {
  const { t } = useTranslation();
  const { register, watch, setValue, formState: { errors } } = useFormContext<ContestCreateFormValues>();

  const maxTeams = watch('maxTeams') || 16;
  const teamSize = watch('teamSize') || 5;
  const totalPoints = watch('totalPoints') || 0;

  return (
    <section id="team_composition" className="scroll-mt-32 flex flex-col gap-8 w-full max-w-4xl mx-auto py-12 border-b border-white/5">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-black text-[#EEEEF0] tracking-tight flex items-center gap-3">
          <span className="w-2 h-8 bg-neon-mint rounded-full" />
          {t('contests.create.sections.team_composition')}
        </h2>
        <p className="text-sm font-medium text-[#7A7A85]">
          참가할 팀의 구성과 규모를 설정합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Max Teams */}
        <div className="flex flex-col gap-4 p-6 rounded-2xl bg-[#0C0C0F] border border-white/5 transition-all hover:border-white/10 group">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-neon-mint/5 flex items-center justify-center text-neon-mint group-hover:bg-neon-mint/10 transition-all">
              <Users className="h-5 w-5" />
            </div>
            <label className="text-[13px] font-black text-[#BBBBCB] uppercase tracking-widest">{t('contests.create.team.max_teams')}</label>
          </div>
          <div className="flex items-center justify-between bg-[#141418] border border-white/5 rounded-xl p-2 shadow-inner">
            <button
              type="button"
              onClick={() => setValue('maxTeams', Math.max(2, maxTeams - 2))}
              className="w-10 h-10 rounded-lg bg-[#0C0C0F] border border-white/5 text-[#7A7A85] hover:text-neon-mint hover:bg-[#1C1C21] transition-all flex items-center justify-center shadow-md active:scale-90"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="text-xl font-black text-[#EEEEF0] tabular-nums">{maxTeams}</span>
            <button
              type="button"
              onClick={() => setValue('maxTeams', Math.min(128, maxTeams + 2))}
              className="w-10 h-10 rounded-lg bg-[#0C0C0F] border border-white/5 text-[#7A7A85] hover:text-neon-mint hover:bg-[#1C1C21] transition-all flex items-center justify-center shadow-md active:scale-90"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <p className="text-[11px] font-medium text-[#4A4A55]">
            최소 2팀에서 최대 128팀까지 설정 가능합니다.
          </p>
        </div>

        {/* Team Size */}
        <div className="flex flex-col gap-4 p-6 rounded-2xl bg-[#0C0C0F] border border-white/5 transition-all hover:border-white/10 group">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-neon-mint/5 flex items-center justify-center text-neon-mint group-hover:bg-neon-mint/10 transition-all">
              <UserPlus className="h-5 w-5" />
            </div>
            <label className="text-[13px] font-black text-[#BBBBCB] uppercase tracking-widest">{t('contests.create.team.team_size')}</label>
          </div>
          <div className="flex items-center justify-between bg-[#141418] border border-white/5 rounded-xl p-2 shadow-inner">
            <button
              type="button"
              onClick={() => setValue('teamSize', Math.max(1, teamSize - 1))}
              className="w-10 h-10 rounded-lg bg-[#0C0C0F] border border-white/5 text-[#7A7A85] hover:text-neon-mint hover:bg-[#1C1C21] transition-all flex items-center justify-center shadow-md active:scale-90"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="text-xl font-black text-[#EEEEF0] tabular-nums">{teamSize}</span>
            <button
              type="button"
              onClick={() => setValue('teamSize', Math.min(10, teamSize + 1))}
              className="w-10 h-10 rounded-lg bg-[#0C0C0F] border border-white/5 text-[#7A7A85] hover:text-neon-mint hover:bg-[#1C1C21] transition-all flex items-center justify-center shadow-md active:scale-90"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <p className="text-[11px] font-medium text-[#4A4A55]">
            한 팀당 참가 인원수를 의미합니다 (교체 선수 미포함).
          </p>
        </div>

        {/* Total Points */}
        <div className="flex flex-col gap-4 p-6 rounded-2xl bg-[#0C0C0F] border border-white/5 transition-all hover:border-white/10 group">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-neon-mint/5 flex items-center justify-center text-neon-mint group-hover:bg-neon-mint/10 transition-all">
              <Zap className="h-5 w-5" />
            </div>
            <label className="text-[13px] font-black text-[#BBBBCB] uppercase tracking-widest">{t('contests.create.team.total_points')}</label>
          </div>
          <div className="relative">
            <input
              type="number"
              {...register('totalPoints', { valueAsNumber: true })}
              className={cn(
                "w-full bg-[#141418] border border-white/5 rounded-xl px-4 py-3.5 text-lg font-black text-[#EEEEF0] focus:outline-none focus:border-neon-mint transition-all shadow-inner tabular-nums",
                errors.totalPoints && "border-red-500/50"
              )}
              placeholder="0 (제한 없음)"
            />
            {totalPoints > 0 && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-neon-mint/10 border border-neon-mint/20 text-[10px] font-black text-neon-mint">
                LIMIT
              </div>
            )}
          </div>
          <p className="text-[11px] font-medium text-[#4A4A55]">
            팀 로스터의 총 포인트 합계를 제한합니다. (0점은 제한 없음)
          </p>
        </div>
      </div>
    </section>
  );
}
