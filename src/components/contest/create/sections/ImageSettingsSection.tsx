'use client';

import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Upload, X, Image as ImageIcon, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ContestCreateFormValues } from '../schema';

export function ImageSettingsSection() {
  const { t } = useTranslation();
  const { setValue, watch } = useFormContext<ContestCreateFormValues>();
  
  const thumbPreview = watch('thumbnail');
  const bannerPreview = watch('banner');

  const handleThumbUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setValue('thumbnail', reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setValue('banner', reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-8 rounded-3xl bg-[#141418] border border-white/5 p-8 shadow-xl shadow-black/20" id="image_settings">
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-black text-[#EEEEF0] tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neon-mint" />
            {t('contests.create.sections.image_settings')}
          </h2>
          <p className="text-sm text-[#7A7A85]">{t('contests.create.image_settings_subtitle', '대회의 시각적인 정체성을 설정합니다.')}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Thumbnail Upload */}
        <div className="flex flex-col gap-3 w-48">
          <label className="text-[13px] font-bold text-[#BBBBCB]">
            {t('contests.create.image.thumbnail')}
          </label>
          <div className="relative aspect-square w-48 group">
            <div className={cn(
              "absolute inset-0 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-[#0C0C0F]",
              thumbPreview ? "border-neon-mint/50" : "border-[#242428] hover:border-neon-mint/30 hover:bg-[#111115]"
            )}>
              {thumbPreview ? (
                <>
                  <img src={thumbPreview} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <Camera className="h-6 w-6 text-white" />
                    <span className="text-[11px] font-black text-white uppercase">교체하기</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 px-4 text-center">
                  <div className="w-12 h-12 rounded-xl bg-[#1C1C21] flex items-center justify-center text-[#4A4A55] group-hover:text-neon-mint group-hover:scale-110 transition-all">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-black text-[#7A7A85] group-hover:text-[#EEEEF0]">{t('contests.create.image.click_to_upload')}</span>
                    <span className="text-[9px] font-medium text-[#4A4A55]">{t('contests.create.image.upload_desc')}</span>
                  </div>
                </div>
              )}
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleThumbUpload} accept="image/*" />
            </div>
            {thumbPreview && (
              <button 
                onClick={() => setValue('thumbnail', null)}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-10"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Banner Upload */}
        <div className="flex flex-col gap-3 flex-1">
          <label className="text-[13px] font-bold text-[#BBBBCB]">
            {t('contests.create.image.banner')}
          </label>
          <div className="relative aspect-[16/5] w-full group">
            <div className={cn(
              "absolute inset-0 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-[#0C0C0F]",
              bannerPreview ? "border-neon-mint/50" : "border-[#242428] hover:border-neon-mint/30 hover:bg-[#111115]"
            )}>
              {bannerPreview ? (
                <>
                  <img src={bannerPreview} alt="Banner Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <Camera className="h-8 w-8 text-white" />
                    <span className="text-xs font-black text-white uppercase tracking-wider">교체하기</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-4 px-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#1C1C21] flex items-center justify-center text-[#4A4A55] group-hover:text-neon-mint group-hover:scale-110 transition-all">
                    <ImageIcon className="h-8 w-8" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-black text-[#7A7A85] group-hover:text-[#EEEEF0]">{t('contests.create.image.click_to_upload')}</span>
                    <span className="text-[10px] font-medium text-[#4A4A55]">{t('contests.create.image.banner_upload_desc')}</span>
                  </div>
                </div>
              )}
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleBannerUpload} accept="image/*" />
            </div>
            {bannerPreview && (
              <button 
                onClick={() => setValue('banner', null)}
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-10 border-4 border-[#141418]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
