'use client';

import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ContestCreateFormValues } from '../schema';
import { cn } from '@/lib/utils';
import { Calendar, Clock, AlertCircle } from 'lucide-react';

export function ScheduleSettingsSection() {
  const { t } = useTranslation();
  const { register, watch, setValue, formState: { errors } } = useFormContext<ContestCreateFormValues>();

  const autoStart = watch('autoStart') || false;

  return (
    <section id="schedule_settings" className="scroll-mt-32 flex flex-col gap-8 w-full max-w-4xl mx-auto py-12 border-b border-white/5">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-black text-[#EEEEF0] tracking-tight flex items-center gap-3">
          <span className="w-2 h-8 bg-neon-mint rounded-full" />
          {t('contests.create.sections.schedule_settings')}
        </h2>
        <p className="text-sm font-medium text-[#7A7A85]">
          대회의 진행 일정을 설정합니다. 시간대는 현재 브라우저 기준(KST)입니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Start Date */}
        <div className="flex flex-col gap-3">
          <label className="text-[13px] font-bold text-[#BBBBCB]">
            {t('contests.create.schedule.start_date')}
            <span className="text-neon-mint ml-1">*</span>
          </label>
          <div className="relative group">
            <Calendar className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
              errors.startDate ? "text-red-500" : "text-[#4A4A55] group-focus-within:text-neon-mint"
            )} />
            <input
              type="datetime-local"
              {...register('startDate')}
              className={cn(
                "w-full bg-[#0C0C0F] border border-white/5 rounded-2xl pl-11 pr-4 py-3.5 text-xs font-medium focus:outline-none focus:border-neon-mint transition-all shadow-inner uppercase",
                errors.startDate && "border-red-500/50"
              )}
            />
          </div>
          {errors.startDate && (
            <p className="text-[11px] font-bold text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.startDate.message}
            </p>
          )}
        </div>

        {/* End Date */}
        <div className="flex flex-col gap-3">
          <label className="text-[13px] font-bold text-[#BBBBCB]">
            {t('contests.create.schedule.end_date')}
            <span className="text-neon-mint ml-1">*</span>
          </label>
          <div className="relative group">
            <Calendar className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
              errors.endDate ? "text-red-500" : "text-[#4A4A55] group-focus-within:text-neon-mint"
            )} />
            <input
              type="datetime-local"
              {...register('endDate')}
              className={cn(
                "w-full bg-[#0C0C0F] border border-white/5 rounded-2xl pl-11 pr-4 py-3.5 text-xs font-medium focus:outline-none focus:border-neon-mint transition-all shadow-inner uppercase",
                errors.endDate && "border-red-500/50"
              )}
            />
          </div>
          {errors.endDate && (
            <p className="text-[11px] font-bold text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.endDate.message}
            </p>
          )}
        </div>

        {/* Auto Start Toggle */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-[#0C0C0F] border border-white/5 transition-all hover:border-white/10 group">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-neon-mint/5 flex items-center justify-center text-neon-mint">
                <Clock className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-black text-[#EEEEF0] uppercase tracking-widest">{t('contests.create.schedule.auto_start')}</label>
                <p className="text-[11px] font-medium text-[#7A7A85]">
                  {t('contests.create.schedule.auto_start_desc')}
                </p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => setValue('autoStart', !autoStart)}
              className={cn(
                "w-12 h-6 rounded-full transition-all relative",
                autoStart ? "bg-neon-mint shadow-[0_0_15px_rgba(110,231,183,0.3)]" : "bg-[#1C1C21] border border-white/5"
              )}
            >
              <div className={cn(
                "absolute top-1 w-4 h-4 rounded-full transition-all shadow-md",
                autoStart ? "left-7 bg-deep-black" : "left-1 bg-[#4A4A55]"
              )} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
