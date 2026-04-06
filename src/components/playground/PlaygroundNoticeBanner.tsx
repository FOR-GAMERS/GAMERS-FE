'use client';

import { Megaphone, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export function PlaygroundNoticeBanner() {
  const { t } = useTranslation();

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-neon-mint/20 bg-neon-mint/5 p-6 shadow-lg shadow-neon-mint/5">
      {/* Background Glow */}
      <div className="absolute top-[-100px] left-[-100px] h-[300px] w-[300px] bg-neon-mint opacity-[0.03] blur-[100px]" />
      
      <div className="relative flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neon-mint text-[#0C0C0D] shadow-[0_0_20px_rgba(110,231,183,0.3)] border border-white/20">
            <Megaphone className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="text-[17px] font-black italic tracking-tighter text-[#EEEEF0] leading-tight">
              {t('playground.notice_banner.title')}
            </h4>
            <p className="text-[13px] font-bold text-[#5A5A65] tracking-tight">
              {t('playground.notice_banner.description')}
            </p>
          </div>
        </div>
        
        <Button 
          className="h-12 border border-neon-mint/20 bg-neon-mint text-[#0C0C0D] text-[13px] font-black uppercase px-8 rounded-xl shadow-[0_0_20px_rgba(110,231,183,0.2)] hover:bg-neon-mint/90 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{t('playground.notice_banner.button')}</span>
        </Button>
      </div>
    </div>
  );
}
