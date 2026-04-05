"use client";

import React from 'react';

interface AdminContestHeroProps {
  title: string;
  status: 'LIVE' | 'UPCOMING' | 'COMPLETED';
}

export function AdminContestHero({ title, status }: AdminContestHeroProps) {
  return (
    <div className="bg-[#141418] border border-white/5 rounded-3xl p-8 flex items-center justify-between glass-card relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-neon-purple/5 blur-[100px] rounded-full group-hover:bg-neon-purple/10 transition-all duration-500" />
      
      {/* Left: Info */}
      <div className="flex items-center gap-6 relative z-10">
        <div className="w-20 h-20 bg-[#1E1E24] rounded-2xl flex items-center justify-center border border-white/10 shadow-xl group-hover:border-neon-purple/30 transition-all duration-500">
          <span className="text-[#4A90D9] font-black text-2xl tracking-tighter uppercase font-outfit">LoL</span>
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-black text-white font-outfit tracking-tighter uppercase leading-none">
              {title}
            </h2>
            <div className="px-3 py-1 rounded-full bg-neon-mint/10 border border-neon-mint/20 flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,212,122,0.1)] group-hover:shadow-[0_0_20px_rgba(0,212,122,0.2)] transition-all">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-mint animate-pulse" />
              <span className="text-[10px] font-black text-neon-mint tracking-widest uppercase">{status}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm font-semibold text-[#7A7A85] tracking-tight">
            <span>2025.03.10 — 2025.04.20</span>
            <span className="w-1 h-1 rounded-full bg-white/10" />
            <span>주최: <span className="text-[#EEEEF0]">박도현 (MANAGER)</span></span>
            <span className="w-1 h-1 rounded-full bg-white/10" />
            <span>스태프: <span className="text-[#EEEEF0]">3명</span></span>
          </div>
        </div>
      </div>

      {/* Right: Stats */}
      <div className="flex items-center gap-16 relative z-10 px-8 border-l border-white/5">
        <div className="flex flex-col items-center gap-1">
          <span className="text-4xl font-black text-white font-outfit tracking-tighter uppercase leading-none group-hover:text-neon-mint transition-colors">48</span>
          <span className="text-[11px] font-bold text-[#7A7A85] tracking-widest uppercase opacity-60">총 참가자</span>
        </div>
        
        <div className="flex flex-col items-center gap-1">
          <span className="text-4xl font-black text-white font-outfit tracking-tighter uppercase leading-none group-hover:text-neon-purple transition-colors">6</span>
          <span className="text-[11px] font-bold text-[#7A7A85] tracking-widest uppercase opacity-60">팀</span>
        </div>
        
        <div className="flex flex-col items-center gap-1">
          <span className="text-4xl font-black text-neon-purple font-outfit tracking-tighter uppercase leading-none drop-shadow-[0_0_15px_rgba(192,132,252,0.3)]">3R</span>
          <span className="text-[11px] font-bold text-neon-purple tracking-widest uppercase opacity-80">현재 라운드</span>
        </div>
      </div>
    </div>
  );
}
