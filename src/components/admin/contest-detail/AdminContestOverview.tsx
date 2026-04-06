"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Check, X, FileText } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';

export function AdminContestOverview() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-8">
      {/* Round Management */}
      <div className="bg-[#141418] border border-white/5 rounded-3xl p-8 glass-card">
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-black text-white font-outfit tracking-tighter uppercase leading-none">{t('admin.contest_detail.overview.round_management')}</h3>
            <p className="text-[#7A7A85] text-xs font-semibold tracking-tight">{t('admin.contest_detail.overview.round_desc')}</p>
          </div>
          <div className="px-4 py-1.5 rounded-xl bg-neon-purple/5 border border-neon-purple/20">
            <span className="text-xs font-bold text-neon-purple tracking-tight">{t('admin.contest_detail.overview.round_status', { round: 3 })}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-10 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-1 flex flex-col gap-4">
              <div className={cn(
                "h-2 rounded-full transition-all duration-700",
                i <= 3 ? (i === 3 ? "bg-neon-purple shadow-[0_0_15px_rgba(192,132,252,0.4)]" : "bg-neon-purple shadow-[0_0_15px_rgba(192,132,252,0.2)]") : "bg-white/5"
              )} />
              <div className="flex items-center justify-between px-1">
                <span className={cn(
                  "text-[10px] font-black tracking-widest uppercase",
                  i <= 3 ? "text-neon-purple" : "text-[#7A7A85]"
                )}>{i}R</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
          <p className="text-sm font-semibold text-[#7A7A85] tracking-tight">
            <Trans i18nKey="admin.contest_detail.overview.round_confirm" components={{ 1: <span className="text-white italic tracking-tighter" /> }} />
          </p>
          <Button className="bg-neon-purple text-black hover:bg-neon-purple/90 font-black rounded-xl h-11 px-8 transition-all hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(192,132,252,0.2)] font-outfit uppercase tracking-tighter">
            {t('admin.contest_detail.overview.next_round')}
          </Button>
        </div>
      </div>

      {/* Pending Applications */}
      <div className="bg-[#141418] border border-white/5 rounded-3xl p-8 glass-card">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black text-white font-outfit tracking-tighter uppercase leading-none">{t('admin.contest_detail.overview.pending_applications')}</h3>
          <div className="px-3 py-1 rounded-lg bg-neon-amber/10 border border-neon-amber/20">
            <span className="text-[10px] font-black text-neon-amber tracking-tighter">{t('admin.contest_detail.overview.pending_count', { count: 7 })}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {[
            { id: '1', name: '한승우', avatar: '한', rank: 'platinum', level: 'II', lane: 'MID', color: 'bg-indigo-600' },
            { id: '2', name: '오지훈', avatar: '오', rank: 'diamond', level: 'IV', lane: 'ADC', color: 'bg-emerald-600' }
          ].map((app) => (
            <div key={app.id} className="group flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-xl", app.color)}>
                  {app.avatar}
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-white tracking-tight">{app.name}</span>
                  <span className="text-[11px] font-bold text-[#7A7A85] tracking-tight">
                    {app.lane} · {t(`playground.ranks.${app.rank}`, { level: app.level })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon-mint/10 text-neon-mint border border-neon-mint/20 text-[11px] font-black tracking-tighter uppercase hover:bg-neon-mint hover:text-black transition-all">
                  <Check className="w-3.5 h-3.5" />
                  <span>{t('admin.contest_detail.overview.accept')}</span>
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon-red/10 text-neon-red border border-neon-red/20 text-[11px] font-black tracking-tighter uppercase hover:bg-neon-red hover:text-white transition-all">
                  <X className="w-3.5 h-3.5" />
                  <span>{t('admin.contest_detail.overview.reject')}</span>
                </button>
              </div>
            </div>
          ))}
          <button className="py-4 text-center text-xs font-bold text-[#7A7A85] hover:text-white transition-all border-t border-white/5 mt-2 hover:bg-white/[0.01]">
            {t('admin.contest_detail.sidebar.view_more', { count: 5 })}
          </button>
        </div>
      </div>

      {/* Notices */}
      <div className="bg-[#141418] border border-white/5 rounded-3xl p-8 glass-card">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black text-white font-outfit tracking-tighter uppercase leading-none">{t('admin.contest_detail.overview.notices')}</h3>
          <Button variant="outline" className="h-9 px-4 border-white/10 text-[#7A7A85] hover:border-neon-purple hover:text-neon-purple transition-all font-bold text-xs rounded-xl gap-2">
            <FileText className="w-4 h-4" />
            <span>{t('admin.contest_detail.overview.create_notice')}</span>
          </Button>
        </div>

        <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.04] transition-all group cursor-pointer relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-neon-purple/30 group-hover:bg-neon-purple transition-all" />
          <div className="flex flex-col gap-2 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-white tracking-tight group-hover:text-neon-purple transition-all">{t('admin.contest_detail.overview.mock_notice_title')}</span>
              <span className="text-xs font-bold text-[#7A7A85]">2025.03.28</span>
            </div>
            <p className="text-xs font-semibold text-[#7A7A85] tracking-tight line-clamp-1 leading-relaxed">
              {t('admin.contest_detail.overview.mock_notice_content')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
