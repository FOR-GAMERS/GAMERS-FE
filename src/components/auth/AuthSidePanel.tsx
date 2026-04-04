'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function AuthSidePanel() {
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
        <div className="flex items-center justify-center rounded-xl bg-[#6EE7B7] w-12 h-12 shadow-[0_0_20px_rgba(110,231,183,0.4)] group-hover:shadow-[0_0_30px_rgba(110,231,183,0.6)] transition-all duration-500">
          <svg width="24" height="24" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.5 4.5h11M3.5 9h8M3.5 13.5h6" stroke="#0C0C0F" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="tracking-[0.1em] text-[#EEEEF0] font-barlow font-black text-3xl uppercase">
          GAMERS
        </div>
      </div>

      {/* Bottom Section: Tagline */}
      <div className="flex flex-col gap-8 relative z-10">
        <div className="w-16 h-1.5 rounded-full bg-[#6EE7B7] shadow-[0_0_15px_rgba(110,231,183,0.6)]" />
        <div className="space-y-4">
          <h1 className="text-5xl xl:text-6xl leading-[1.1] uppercase font-barlow font-black text-[#EEEEF0] tracking-tight">
            모든 게이머의 경쟁이<br />
            <span className="text-[#6EE7B7] text-glow-mint">기억이 되는</span><br />
            플랫폼
          </h1>
          <p className="text-xl text-[#7A7A85] font-inter max-w-md leading-relaxed font-medium">
            대회를 만들고, 팀을 꾸리고, 기록을 남기세요.<br />
            GAMERS에서 모든 게 시작됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
