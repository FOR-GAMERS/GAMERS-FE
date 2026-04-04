'use client';

import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { ContestCreateFormValues } from '../schema';
import { Info, Image as ImageIcon, Bold, Italic, Link as LinkIcon, List, Eye } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

export function BasicInfoSection() {
  const { t } = useTranslation();
  const { register, watch, formState: { errors } } = useFormContext<ContestCreateFormValues>();
  const [isPreview, setIsPreview] = useState(false);
  
  const description = watch('description') || '';

  return (
    <div className="flex flex-col gap-8 rounded-3xl bg-[#141418] border border-white/5 p-8 shadow-xl shadow-black/20" id="basic_info">
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-black text-[#EEEEF0] tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neon-mint" />
            {t('contests.create.sections.basic_info')}
          </h2>
          <p className="text-sm text-[#7A7A85]">{t('contests.create.basic_info_subtitle', '대회의 가장 기본적인 정보를 입력합니다.')}</p>
        </div>
        <span className="text-[10px] font-black uppercase text-[#7A7A85] bg-[#1C1C21] px-2 py-1 rounded-md border border-white/5">필수</span>
      </div>

      <div className="flex flex-col gap-6">
        {/* Contest Name */}
        <div className="flex flex-col gap-3">
          <label className="text-[13px] font-bold text-[#BBBBCB] flex items-center gap-1.5">
            {t('contests.create.basic.contest_name')}
            <span className="text-neon-mint">*</span>
          </label>
          <div className="relative group">
            <Input
              {...register('name')}
              placeholder={t('contests.create.basic.placeholder_name')}
              className={cn(
                "bg-[#0C0C0F] border-[#242428] hover:border-[#383840] focus:border-neon-mint h-14 font-medium transition-all group-hover:bg-[#111115]",
                errors.name && "border-red-500/50"
              )}
            />
            {errors.name && (
              <span className="text-xs font-bold text-red-500 mt-1.5 flex items-center gap-1">
                <Info className="h-3.5 w-3.5" />
                {errors.name.message}
              </span>
            )}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[#7A7A85] tabular-nums">
              {watch('name')?.length || 0} / 255
            </div>
          </div>
        </div>

        {/* Contest Intro */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-bold text-[#BBBBCB] flex items-center gap-1.5">
              {t('contests.create.basic.contest_intro')}
              <span className="text-neon-mint">*</span>
              <span className="ml-2 text-[11px] font-black text-[#7A7A85] uppercase tracking-wider bg-[#1C1C21] px-2 py-0.5 rounded border border-white/5">MDX</span>
            </label>
            <div className="flex items-center gap-1 p-1 bg-[#0C0C0F] rounded-lg border border-white/5 shadow-inner">
              <button
                type="button"
                onClick={() => setIsPreview(false)}
                className={cn(
                  "px-3 py-1 flex items-center gap-1.5 rounded-md text-[11px] font-black transition-all",
                  !isPreview ? "bg-[#1C1C21] text-neon-mint shadow-md" : "text-[#7A7A85] hover:text-[#EEEEF0]"
                )}
              >
                편집
              </button>
              <button
                type="button"
                onClick={() => setIsPreview(true)}
                className={cn(
                  "px-3 py-1 flex items-center gap-1.5 rounded-md text-[11px] font-black transition-all",
                  isPreview ? "bg-[#1C1C21] text-neon-mint shadow-md" : "text-[#7A7A85] hover:text-[#EEEEF0]"
                )}
              >
                <Eye className="h-3 w-3" />
                미리보기
              </button>
            </div>
          </div>
          
          <div className="relative flex flex-col rounded-xl overflow-hidden bg-[#0C0C0F] border border-[#242428] group focus-within:border-neon-mint transition-all">
            {/* Toolbar */}
            {!isPreview && (
              <div className="flex items-center gap-1 p-2 border-b border-white/5 bg-[#141418]/50 overflow-x-auto no-scrollbar">
                <button type="button" className="p-1.5 rounded-md text-[#7A7A85] hover:bg-white/5 hover:text-white transition-colors"><Bold className="h-4 w-4" /></button>
                <button type="button" className="p-1.5 rounded-md text-[#7A7A85] hover:bg-white/5 hover:text-white transition-colors"><Italic className="h-4 w-4" /></button>
                <div className="w-px h-4 bg-white/5 mx-1" />
                <button type="button" className="p-1.5 rounded-md text-[#7A7A85] hover:bg-white/5 hover:text-white transition-colors font-black text-xs">H1</button>
                <button type="button" className="p-1.5 rounded-md text-[#7A7A85] hover:bg-white/5 hover:text-white transition-colors font-black text-xs">H2</button>
                <button type="button" className="p-1.5 rounded-md text-[#7A7A85] hover:bg-white/5 hover:text-white transition-colors font-black text-xs">H3</button>
                <div className="w-px h-4 bg-white/5 mx-1" />
                <button type="button" className="p-1.5 rounded-md text-[#7A7A85] hover:bg-white/5 hover:text-white transition-colors"><List className="h-4 w-4" /></button>
                <button type="button" className="p-1.5 rounded-md text-[#7A7A85] hover:bg-white/5 hover:text-white transition-colors"><LinkIcon className="h-4 w-4" /></button>
                <button type="button" className="p-1.5 rounded-md text-[#7A7A85] hover:bg-white/5 hover:text-white transition-colors"><ImageIcon className="h-4 w-4" /></button>
                <div className="ml-auto flex items-center gap-2 pr-2">
                  <span className="text-[10px] font-black text-neon-mint/50 animate-pulse">자동저장 완료</span>
                </div>
              </div>
            )}

            <div className="min-h-[300px] relative">
              {!isPreview ? (
                <textarea
                  {...register('description')}
                  placeholder={t('contests.create.basic.placeholder_intro')}
                  className="w-full h-full min-h-[300px] p-6 bg-transparent text-[#EEEEF0] text-sm font-medium resize-none focus:outline-none placeholder:text-[#7A7A85] leading-relaxed"
                />
              ) : (
                <div className="p-6 prose prose-invert prose-sm max-w-none h-full min-h-[300px] overflow-y-auto">
                  {description ? (
                    <ReactMarkdown>{description}</ReactMarkdown>
                  ) : (
                    <span className="text-[#4A4A55] font-medium leading-relaxed italic">내용을 입력하면 미리보기가 생성됩니다.</span>
                  )}
                </div>
              )}
              {!isPreview && (
                <div className="absolute right-4 bottom-4 text-[11px] font-bold text-[#7A7A85] pointer-events-none tabular-nums">
                  {description.length} / 1000
                </div>
              )}
            </div>
          </div>
          {errors.description && (
            <span className="text-xs font-bold text-red-500 mt-1 flex items-center gap-1">
              <Info className="h-3.5 w-3.5" />
              {errors.description.message}
            </span>
          )}
        </div>

        {/* Precautions */}
        <div className="flex flex-col gap-3">
          <label className="text-[13px] font-bold text-[#BBBBCB] flex items-center gap-1.5">
            {t('contests.create.basic.precautions')}
          </label>
          <textarea
            {...register('precautions')}
            placeholder={t('contests.create.basic.placeholder_precautions')}
            className="w-full min-h-[100px] rounded-xl border border-[#242428] bg-[#0C0C0F] p-4 text-sm text-[#EEEEF0] font-medium focus:outline-none focus:border-neon-mint hover:bg-[#111115] transition-all resize-none placeholder:text-[#7A7A85] leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}
