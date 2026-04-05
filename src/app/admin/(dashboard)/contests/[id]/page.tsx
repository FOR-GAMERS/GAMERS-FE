"use client";

import React, { useState } from 'react';
import { AdminContestHeader } from '@/components/admin/contest-detail/AdminContestHeader';
import { AdminContestHero } from '@/components/admin/contest-detail/AdminContestHero';
import { AdminContestTabs } from '@/components/admin/contest-detail/AdminContestTabs';
import { AdminContestOverview } from '@/components/admin/contest-detail/AdminContestOverview';
import { AdminContestSidebar } from '@/components/admin/contest-detail/AdminContestSidebar';

export default function AdminContestDetailPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex flex-col min-h-screen bg-[#0C0C0F]">
      {/* Header */}
      <AdminContestHeader contestTitle="2025 봄 시즌 LoL 5:5 대회" />

      {/* Hero Section */}
      <div className="px-10 py-10 flex flex-col gap-8">
        <AdminContestHero title="2025 봄 시즌 LoL 5:5 대회" status="LIVE" />
        
        {/* Tabs & Content Selection */}
        <AdminContestTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Dynamic Content Grid */}
        <div className="grid grid-cols-12 gap-8 mt-4 items-start">
          <div className="col-span-12 lg:col-span-8">
            {activeTab === 'overview' && <AdminContestOverview />}
            {activeTab !== 'overview' && (
              <div className="flex flex-col items-center justify-center p-32 bg-[#141418] border border-white/5 rounded-3xl glass-card">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <div className="w-4 h-4 rounded-full bg-neon-purple animate-pulse shadow-[0_0_15px_rgba(192,132,252,0.4)]" />
                </div>
                <h3 className="text-xl font-black text-white font-outfit tracking-tighter uppercase leading-none mb-2">
                  {activeTab.replace('-', ' ')} 준비 중
                </h3>
                <p className="text-[#7A7A85] text-sm font-semibold tracking-tight">
                  해당 섹션의 기능을 구현하고 있습니다. 잠시만 기다려주세요.
                </p>
              </div>
            )}
          </div>
          
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-10">
            <AdminContestSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
