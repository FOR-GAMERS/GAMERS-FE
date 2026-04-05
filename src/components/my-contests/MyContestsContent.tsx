'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { ContestCardParticipating } from './ContestCardParticipating';
import { ContestCardCompleted } from './ContestCardCompleted';
import { ChevronRight } from 'lucide-react';

export function MyContestsContent() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'participating' | 'completed'>('participating');

  // Mock data for Participating Contests
  const participatingContests = [
    {
      id: '1',
      game: 'Valorant',
      title: t('my_contests.mock.contest1'),
      host: 'GMS_Creator',
      date: '2026-04-05',
      statusText: t('my_contests.mock.contest1_status'),
      formatText: t('my_contests.mock.contest1_format'),
      myTeam: { name: 'Team Alpha', membersCount: 5 },
      nextMatch: { opponent: 'NexusGG', time: t('my_contests.card.hours_after', { count: 3 }) },
      record: { wins: 2, losses: 0, isUnbeatable: true },
      prize: '₩500,000',
      isLive: true,
      actionType: 'stadium' as const
    },
    {
      id: '2',
      game: 'League of Legends',
      title: t('my_contests.mock.contest2'),
      host: 'LOL_Official',
      date: '2026-03-27',
      statusText: t('my_contests.mock.contest2_status'),
      formatText: t('my_contests.mock.contest2_format'),
      myTeam: { name: 'DragonRift', membersCount: 5 },
      record: { wins: 16, losses: 16 },
      prize: '₩200,000',
      isLive: false,
      actionType: 'distribution' as const
    }
  ];

  // Mock data for Completed Contests
  const completedContests = [
    {
      id: '3',
      game: 'Valorant',
      title: t('my_contests.mock.contest3'),
      date: '2026-02-15',
      rank: 1,
      totalTeams: 32,
      prize: '₩300K',
      record: { wins: 5, losses: 0 },
      resultLabel: `🏆 ${t('common.winning')}`
    },
    {
      id: '4',
      game: 'League of Legends',
      title: t('my_contests.mock.contest4'),
      date: '2026-01-20',
      rank: 2,
      totalTeams: 16,
      prize: '₩100K',
      record: { wins: 4, losses: 1 },
      resultLabel: `🥈 ${t('common.runner_up')}`
    },
    {
      id: '5',
      game: 'CS2',
      title: t('my_contests.mock.contest5'),
      date: '2025-12-10',
      rank: 16,
      totalTeams: 64,
      prize: '—',
      record: { wins: 1, losses: 1 },
      resultLabel: t('common.eliminated')
    }
  ];


  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      {/* Tab Indicators / Filters */}
      <div className="mb-14 flex items-center gap-12 border-b border-white/5">
        <button
          onClick={() => setActiveTab('participating')}
          className={cn(
            "relative pb-6 text-[15px] font-black tracking-tight transition-all",
            activeTab === 'participating' ? "text-[#EEEEF0]" : "text-[#4A4A55] hover:text-[#7A7A85]"
          )}
        >
          {t('my_contests.tabs.participating')}
          <span className="ml-3 text-[14px] font-bold opacity-40">{participatingContests.length}</span>
          {activeTab === 'participating' && (
            <motion.div 
              layoutId="activeTabUnderline" 
              className="absolute bottom-[-1px] left-0 right-0 h-1 rounded-full bg-neon-mint shadow-[0_0_8px_rgba(110,231,183,0.4)]" 
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={cn(
            "relative pb-6 text-[15px] font-black tracking-tight transition-all",
            activeTab === 'completed' ? "text-[#EEEEF0]" : "text-[#4A4A55] hover:text-[#7A7A85]"
          )}
        >
          {t('my_contests.tabs.completed')}
          <span className="ml-3 text-[14px] font-bold opacity-40">{completedContests.length}</span>
          {activeTab === 'completed' && (
            <motion.div 
              layoutId="activeTabUnderline" 
              className="absolute bottom-[-1px] left-0 right-0 h-1 rounded-full bg-neon-mint shadow-[0_0_8px_rgba(110,231,183,0.4)]" 
            />
          )}
        </button>
      </div>

      <div className="flex flex-col gap-20">
        {/* Participating Section */}
        {(activeTab === 'participating' || activeTab === 'completed') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6"
          >
            {participatingContests.map(contest => (
              <ContestCardParticipating key={contest.id} {...contest} />
            ))}
          </motion.div>
        )}

        {/* Completed Section (History) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-8 mt-12"
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-[14px] font-black text-[#8A8A95] uppercase tracking-[0.2em]">
                {t('my_contests.tabs.completed')}
              </h3>
              <span className="text-[13px] font-bold text-[#4A4A55]">{completedContests.length}{t('common.count_suffix')}</span>
            </div>
            <button className="flex items-center gap-1 text-[13px] font-black text-neon-mint hover:underline group tracking-tight transition-all">
              {t('common.view_all')}
              <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedContests.map(contest => (
              <ContestCardCompleted key={contest.id} {...contest} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
