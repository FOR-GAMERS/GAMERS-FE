'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export function AuthSidePanel() {
  const { t } = useTranslation();

  return (
    <div className="hidden lg:flex flex-col justify-between w-full max-w-[520px] h-full relative shrink-0 py-20 px-16 overflow-hidden bg-[#0C0C0F] border-r border-[#242428]">
      {/* Background Gradients */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(180deg, rgba(110, 231, 183, 0.08) 0%, transparent 100%), linear-gradient(90deg, rgba(110, 231, 183, 0.08) 0%, transparent 100%)' 
        }} 
      />
      <div 
        className="absolute -bottom-20 -right-20 w-[600px] h-[500px] opacity-20 pointer-events-none blur-[100px]" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at center, rgba(110, 231, 183, 0.3) 0%, transparent 70%)' 
        }} 
      />
      
      {/* Decorative Shapes */}
      <div className="absolute top-[15%] right-[10%] w-16 h-16 rounded-[2rem] border-[1.5px] border-[#6EE7B726] rotate-[15deg] backdrop-blur-sm" />
      <div className="absolute top-[22%] right-[18%] w-10 h-10 rounded-2xl border-[1.5px] border-[#6EE7B714] rotate-[-8deg] backdrop-blur-[2px]" />

      {/* Top Section: Logo */}
      <div className="flex items-center gap-4 relative z-10 group cursor-default">
        <div className="font-koulen text-4xl font-normal tracking-tight text-[#EEEEF0] uppercase italic text-glow-mint leading-none">
          GAMERS
        </div>
      </div>

      {/* Bottom Section: Tagline */}
      <div className="flex flex-col gap-8 relative z-10">
        <div className="w-16 h-1.5 rounded-full bg-[#6EE7B7] shadow-[0_0_15px_rgba(110,231,183,0.6)]" />
        <div className="space-y-4">
          <h1 className="text-5xl xl:text-6xl leading-[1.1] uppercase font-barlow font-black text-[#EEEEF0] tracking-tight">
            {t('auth.hero.title_1')}<br />
            <span className="text-[#6EE7B7] text-glow-mint">{t('auth.hero.title_2')}</span><br />
            {t('auth.hero.title_3')}
          </h1>
          <p className="text-xl text-[#7A7A85] font-inter max-w-md leading-relaxed font-medium">
            {t('auth.hero.description')}
          </p>
        </div>
      </div>
    </div>
  );
}
