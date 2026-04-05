"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { UserPlus, Layout, Zap, Download, ChevronRight } from 'lucide-react';

export function AdminContestSidebar() {
  return (
    <div className="flex flex-col gap-8 sticky top-30">
      {/* Quick Actions */}
      <div className="bg-[#141418] border border-white/5 rounded-3xl p-8 glass-card">
        <h3 className="text-xl font-black text-white font-outfit tracking-tighter uppercase leading-none mb-8">빠른 액션</h3>
        
        <div className="flex flex-col gap-2">
          {[
            { id: '1', icon: <UserPlus className="w-4 h-4" />, label: '참가자 직접 추가' },
            { id: '2', icon: <Layout className="w-4 h-4" />, label: '팀 자동 배분' },
            { id: '3', icon: <Zap className="w-4 h-4" />, label: '경기 결과 입력' },
            { id: '4', icon: <Download className="w-4 h-4" />, label: '참가자 명단 내보내기' }
          ].map((action) => (
            <button
              key={action.id}
              className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-neon-purple/30 hover:bg-white/[0.04] transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#1E1E24] text-[#7A7A85] group-hover:text-neon-purple transition-all">
                  {action.icon}
                </div>
                <span className="text-sm font-bold text-[#7A7A85] group-hover:text-white transition-all tracking-tight">
                  {action.label}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-neon-purple transition-all" />
            </button>
          ))}
        </div>
      </div>

      {/* Participant Status */}
      <div className="bg-[#141418] border border-white/5 rounded-3xl p-8 glass-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-white font-outfit tracking-tighter uppercase leading-none">참가자 현황</h3>
          <span className="text-xs font-bold text-[#7A7A85]">48 / 50명</span>
        </div>

        <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-10 shadow-inner">
          <div className="h-full w-[96%] bg-neon-mint shadow-[0_0_15px_rgba(0,212,122,0.4)] rounded-full animate-pulse-slow" />
        </div>

        <div className="flex flex-col gap-4">
          {[
            { id: '1', name: '강민준', team: 'Team A', role: 'MID', avatar: '강', color: 'bg-indigo-600' },
            { id: '2', name: '박도현', team: 'Team A', role: 'TOP', avatar: '박', color: 'bg-emerald-600' },
            { id: '3', name: '최예린', team: 'Team B', role: 'JGL', avatar: '최', color: 'bg-blue-600' },
            { id: '4', name: '김지우', team: 'Team C', role: 'SUP', avatar: '김', color: 'bg-orange-600' },
            { id: '5', name: '이서연', team: 'Team D', role: 'ADC', avatar: '이', color: 'bg-slate-600' }
          ].map((user) => (
            <div key={user.id} className="flex items-center justify-between group cursor-pointer hover:bg-white/[0.01] transition-all">
              <div className="flex items-center gap-3">
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-[10px] shadow-lg", user.color)}>
                  {user.avatar}
                </div>
                <span className="text-xs font-bold text-white tracking-tight group-hover:text-neon-mint transition-colors">
                  {user.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#7A7A85] tracking-tight">{user.team} · </span>
                <span className={cn(
                  "text-[10px] font-black tracking-widest uppercase",
                  user.role === 'MID' ? 'text-neon-purple' : user.role === 'ADC' ? 'text-neon-red' : 'text-neon-mint'
                )}>{user.role}</span>
              </div>
            </div>
          ))}
          <button className="py-4 text-center text-xs font-bold text-[#7A7A85] hover:text-white transition-all border-t border-white/5 mt-4 hover:bg-white/[0.01]">
            + 43명 더 보기
          </button>
        </div>
      </div>
    </div>
  );
}
