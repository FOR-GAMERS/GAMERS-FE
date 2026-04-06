'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ContestCard } from './ContestCard';
import { Button } from '@/components/ui/button';
import { ChevronDown, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

const GAMES = ['All', 'Valorant', 'LoL', 'CS2', 'Apex'];

export function ContestsListContent() {
  const { t } = useTranslation();
  const [selectedGame, setSelectedGame] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const MOCK_CONTESTS = [
    {
      id: 1,
      game: 'Valorant',
      status: 'OPEN' as const,
      title: t('contests.list.mock.contest1'),
      creator: 'GMS_Creator',
      date: '2026-04-05',
      prize: '₩500,000',
      participants: 18,
      maxParticipants: 32,
      gameColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    },
    {
      id: 2,
      game: 'LoL',
      status: 'LIVE' as const,
      title: t('contests.list.mock.contest2'),
      creator: 'LOL_Official',
      date: '2026-03-27',
      prize: '₩200,000',
      participants: 16,
      maxParticipants: 16,
      gameColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    },
    {
      id: 3,
      game: 'CS2',
      status: 'UPCOMING' as const,
      title: t('contests.list.mock.contest3'),
      creator: 'KR_Gaming',
      date: '2026-04-12',
      prize: '₩1,000,000',
      participants: 4,
      maxParticipants: 64,
      gameColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    },
    {
      id: 4,
      game: 'Apex',
      status: 'OPEN' as const,
      title: t('contests.list.mock.contest4'),
      creator: 'ApexKR',
      date: '2026-04-10',
      prize: '₩150,000',
      participants: 22,
      maxParticipants: 40,
      gameColor: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    },
    {
      id: 5,
      game: 'Valorant',
      status: 'UPCOMING' as const,
      title: t('contests.list.mock.contest5'),
      creator: 'VCT_KR',
      date: '2026-04-20',
      prize: '₩3,000,000',
      participants: 8,
      maxParticipants: 128,
      gameColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    },
    {
      id: 6,
      game: t('contests.list.mock.multi_game'),
      status: 'OPEN' as const,
      title: t('contests.list.mock.contest6'),
      creator: 'GMS_Creator',
      date: '2026-04-08',
      prize: '₩750,000',
      participants: 31,
      maxParticipants: 50,
      gameColor: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    },
  ];

  const STATUSES = [
    { key: 'All', label: t('contests.list.filters.all') },
    { key: 'ONGOING', label: t('contests.list.filters.ongoing') },
    { key: 'UPCOMING', label: t('contests.list.filters.recruiting') },
    { key: 'COMPLETED', label: t('contests.list.filters.finished') },
  ];

  return (
    <div className="flex w-full flex-col gap-12 px-6 pb-20 md:px-16">
      {/* Filters Section */}
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap items-center gap-4">
          {/* Game Filter */}
          <div className="flex items-center rounded-xl bg-[#141418] p-1.5 border border-white/5 shadow-lg">
            {GAMES.map((game) => (
              <button
                key={game}
                onClick={() => setSelectedGame(game)}
                className={cn(
                  "px-6 py-2 text-sm font-bold transition-all rounded-lg",
                  selectedGame === game 
                    ? "bg-neon-mint text-deep-black shadow-[0_0_15px_rgba(110,231,183,0.3)]" 
                    : "text-[#7A7A85] hover:text-[#EEEEF0]"
                )}
              >
                {game === 'All' ? t('contests.list.filters.all') : game}
              </button>
            ))}
          </div>

          <div className="h-8 w-px bg-white/5 mx-2" />

          {/* Status Filter */}
          <div className="flex items-center rounded-xl bg-[#141418] p-1.5 border border-white/5 shadow-lg">
            {STATUSES.map((status) => (
              <button
                key={status.key}
                onClick={() => setSelectedStatus(status.key)}
                className={cn(
                  "px-6 py-2 text-sm font-bold transition-all rounded-lg",
                  selectedStatus === status.key
                    ? "bg-neon-mint text-deep-black shadow-[0_0_15px_rgba(110,231,183,0.3)]" 
                    : "text-[#7A7A85] hover:text-[#EEEEF0]"
                )}
              >
                {status.label}
              </button>
            ))}
          </div>

          <div className="h-8 w-px bg-white/5 mx-2" />

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 rounded-xl bg-[#141418] px-5 py-2.5 border border-white/5 cursor-pointer hover:bg-[#1C1C21] transition-all group shadow-lg">
            <span className="text-[13px] font-bold text-[#EEEEF0]">{t('contests.list.sort.recent')}</span>
            <ChevronDown className="h-4 w-4 text-[#7A7A85] group-hover:text-neon-mint transition-colors" />
          </div>

          {/* Result Count */}
          <div className="ml-auto flex items-center gap-2">
            <span className="text-[13px] font-medium text-[#7A7A85]">
              <span className="text-neon-mint font-bold">{MOCK_CONTESTS.length}</span>{t('common.count_suffix', {defaultValue: '건'})}
            </span>
          </div>
        </div>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {MOCK_CONTESTS.map((contest) => (
          <ContestCard key={contest.id} {...contest} />
        ))}
      </div>


      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 flex flex-col md:flex-row items-center justify-between rounded-2xl bg-gradient-to-r from-[#141418] to-[#1C1C21] p-12 border border-white/5 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-mint/5 rounded-full blur-[100px] -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-purple/5 rounded-full blur-[100px] -ml-32 -mb-32" />
        
        <div className="flex flex-col gap-2 relative z-10 mb-8 md:mb-0">
          <h2 className="font-barlow text-3xl font-black italic tracking-tight text-[#EEEEF0] md:text-4xl">
            {t('contests.list.cta.title')}
          </h2>
          <p className="text-[#7A7A85] font-medium">
            {t('contests.list.cta.subtitle')}
          </p>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="relative z-10">
          <Button
            variant="neon"
            size="xl"
            className="group flex items-center gap-3 bg-transparent border-2 border-neon-mint text-neon-mint hover:bg-neon-mint hover:text-black transition-all duration-300 shadow-none h-14"
          >
            {t('contests.list.cta.button')}
            <PlusCircle className="h-5 w-5 transition-transform group-hover:rotate-90" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
