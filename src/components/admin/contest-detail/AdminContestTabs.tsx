"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface AdminContestTabsProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

const tabs = [
  { id: 'overview' },
  { id: 'members' },
  { id: 'applications', badge: 7 },
  { id: 'teams' },
  { id: 'brackets' },
  { id: 'notices' },
  { id: 'settings' },
];

export function AdminContestTabs({ activeTab, onTabChange }: AdminContestTabsProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-1 border-b border-white/5 py-4 relative z-20">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "px-6 py-3 text-sm font-bold transition-all duration-300 relative group flex items-center gap-2",
            activeTab === tab.id 
              ? "text-neon-purple shadow-[0_4px_20px_rgba(192,132,252,0.1)]" 
              : "text-[#7A7A85] hover:text-white"
          )}
        >
          {t(`admin.contest_detail.tabs.${tab.id}`)}
          {tab.badge && (
            <span className={cn(
              "px-1.5 py-0.5 rounded-md text-[10px] font-black tracking-tighter opacity-100",
              activeTab === tab.id 
                ? "bg-neon-purple text-black" 
                : "bg-neon-amber/20 text-neon-amber group-hover:bg-neon-amber group-hover:text-black transition-all"
            )}>
              {tab.badge}
            </span>
          )}
          {activeTab === tab.id && (
            <div className="absolute -bottom-4 left-0 right-0 h-1 bg-neon-purple shadow-[0_0_15px_rgba(192,132,252,0.6)] rounded-t-full transition-all duration-500" />
          )}
        </button>
      ))}
    </div>
  );
}
