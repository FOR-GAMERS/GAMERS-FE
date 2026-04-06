'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';
import { 
  Trophy, 
  Users, 
  Calendar, 
  Globe, 
  Layout, 
  ChevronRight,
  Share2,
  Heart,
  Flag,
  Clock,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ContestCard } from './ContestCard';
import { useState, useEffect } from 'react';

// Temporary Mock Data for Demonstration
const MOCK_CONTEST_DETAIL = {
  id: 1,
  title: '발로란트 신인 오픈컵 시즌 3',
  game: 'Valorant',
  creator: 'GMS_Creator',
  date: '2026-04-05',
  introduction: 'contests.single.mock.intro',
  formatTags: [
    'contests.single.mock.format.single',
    'contests.single.mock.format.five_vs_five',
    'contests.single.mock.format.bo3'
  ],
  schedule: [
    { label: 'contests.single.mock.schedule.registration', date: '3/28 ~ 4/4', status: 'completed' },
    { label: 'contests.single.mock.schedule.contest', date: '4/5 ~ 4/6', status: 'active' },
    { label: 'contests.single.mock.schedule.result', date: '4/7', status: 'upcoming' },
  ],
  notes: [
    'contests.single.mock.notes.0',
    'contests.single.mock.notes.1',
    'contests.single.mock.notes.2',
  ],
  prizePool: [
    { rank: '1st', amount: '₩500,000', label: 'contests.single.mock.prize.first' },
    { rank: '2nd', amount: '₩200,000', label: 'contests.single.mock.prize.second' },
    { rank: '3rd', amount: '₩100,000', label: 'contests.single.mock.prize.third' },
  ],
  sponsors: [
    { name: 'GAMERS Official', logo: 'G' },
    { name: 'Logitech G', logo: 'L' },
  ],
  info: {
    platform: 'PC / Riot Games',
    region: 'contests.create.basic.preview.asia',
    format: 'contests.create.basic.preview.tournament',
  },
  status: 'RECRUITING',
  participants: 18,
  maxParticipants: 32,
  heroImage: 'https://images.unsplash.com/photo-1624138784614-87fd1b6528f2?q=80&w=2000&auto=format&fit=crop',
  recentTeams: [
    { name: 'Team Alpha', time: 2, type: 'hours_ago', initials: 'TA' },
    { name: 'NexusGG', time: 5, type: 'hours_ago', initials: 'NX' },
    { name: 'CyberRift', time: 1, type: 'days_ago', initials: 'CR' },
  ]
};

const RELATED_MOCK = [
  {
    id: 1,
    game: 'Valorant',
    status: 'OPEN' as const,
    title: 'contests.single.mock.title',
    creator: 'GMS_Creator',
    date: '2026-04-05',
    prize: '₩500,000',
    participants: 18,
    maxParticipants: 32,
    gameColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  },
  {
    id: 2,
    game: 'League of Legends',
    status: 'LIVE' as const,
    title: 'contests.single.mock.related.1',
    creator: 'LOL_Official',
    date: '2026-03-27',
    prize: '₩200,000',
    participants: 16,
    maxParticipants: 16,
    gameColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  },
  {
    id: 3,
    game: 'CS2',
    status: 'UPCOMING' as const,
    title: 'contests.single.mock.related.2',
    creator: 'KR_Gaming',
    date: '2026-04-12',
    prize: '₩1,000,000',
    participants: 4,
    maxParticipants: 64,
    gameColor: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  }
];

export function ContestDetailContent() {
  const { t } = useTranslation();
  const params = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const data = MOCK_CONTEST_DETAIL;

  const tabs = [
    { id: 'overview', label: t('contests.detail.overview') },
    { id: 'brackets', label: t('contests.detail.brackets') },
    { id: 'participants', label: t('contests.detail.participants') },
    { id: 'rules', label: t('contests.detail.rules') },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#0C0C0F] selection:bg-neon-mint selection:text-deep-black">
      {/* Cinematic Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[550px] overflow-hidden">
        {/* Background Overlay Layer */}
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src={data.heroImage} 
            alt={data.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0F] via-[#0C0C0F]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0C0C0F]/80 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(110,231,183,0.05),transparent_70%)]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex h-full items-end pb-20 px-6 md:px-16 container mx-auto">
          <div className="flex flex-col gap-8 w-full">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4"
            >
               <span className="text-sm font-black text-[#7A7A85] tracking-[0.2em] uppercase">{t('contests.single.hero.breadcrumb')}</span>
               <ChevronRight className="w-4 h-4 text-[#3A3A45]" />
               <span className="text-sm font-black text-[#EEEEF0] tracking-tight">{t(data.title)}</span>
            </motion.div>

            <div className="flex flex-col gap-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3"
              >
                <div className="flex items-center gap-2 rounded bg-neon-mint/10 px-3 py-1 border border-neon-mint/20">
                  <span className="text-[10px] font-black tracking-widest uppercase text-neon-mint">
                    {data.game}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-neon-mint/10 border border-neon-mint/20 backdrop-blur-md shadow-[0_0_15px_rgba(110,231,183,0.1)]">
                  <div className="h-1.5 w-1.5 rounded-full bg-neon-mint animate-pulse shadow-[0_0_8px_rgba(110,231,183,1)]" />
                  <span className="text-[10px] font-black tracking-widest uppercase text-neon-mint">
                    {t(`contests.status.${data.status}`)}
                  </span>
                </div>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.8 }}
                className="text-5xl md:text-7xl font-black text-[#EEEEF0] tracking-tight leading-tight max-w-4xl"
              >
                {t(data.title)}
              </motion.h1>

              <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.3 }}
                 className="flex items-center gap-4 mt-2"
              >
                 <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-[10px] font-bold text-[#7A7A85]">
                       {data.creator[0]}
                    </div>
                    <span className="text-sm font-bold text-[#7A7A85]">{data.creator}</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-5 h-5 flex items-center justify-center">
                       <Share2 className="w-4 h-4 text-[#3A3A45]" />
                    </div>
                    <span className="text-sm font-bold text-[#3A3A45]">{t('contests.single.hero.discord_link')}</span>
                 </div>
              </motion.div>
            </div>

            {/* Quick Stats Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 mt-6 max-w-5xl"
            >
              <div className="flex flex-col gap-1.5 group cursor-default">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#3A3A45] group-hover:text-neon-mint transition-colors">{t('contests.single.stats.prize')}</span>
                <span className="text-3xl md:text-4xl font-black text-[#EEEEF0] font-barlow italic tracking-tighter transition-transform group-hover:scale-105 origin-left">₩500,000</span>
              </div>
              <div className="flex flex-col gap-1.5 group cursor-default">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#3A3A45] group-hover:text-neon-mint transition-colors">{t('contests.single.stats.teams')}</span>
                <span className="text-3xl md:text-4xl font-black text-[#EEEEF0] font-barlow italic tracking-tighter transition-transform group-hover:scale-105 origin-left">18 / 32</span>
              </div>
              <div className="flex flex-col gap-1.5 group cursor-default">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#3A3A45] group-hover:text-neon-mint transition-colors">{t('contests.single.stats.start_date')}</span>
                <span className="text-3xl md:text-4xl font-black text-[#EEEEF0] font-barlow italic tracking-tighter transition-transform group-hover:scale-105 origin-left">{data.date}</span>
              </div>
              <div className="flex flex-col gap-1.5 group cursor-default">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#3A3A45] group-hover:text-neon-mint transition-colors">{t('contests.single.stats.format')}</span>
                <span className="text-3xl md:text-4xl font-black text-[#EEEEF0] font-barlow italic tracking-tighter transition-transform group-hover:scale-105 origin-left">{t('contests.single.hero.format', { format: t(data.info.format) })}</span>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="sticky top-[80px] z-[40] bg-[#0C0C0F] border-b border-white/5 overflow-x-auto">
        <div className="container mx-auto px-6 md:px-16 flex items-center gap-10 h-16">
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "h-full flex items-center text-sm font-bold tracking-tight transition-colors relative whitespace-nowrap",
                activeTab === tab.id ? "text-neon-mint" : "text-[#7A7A85] hover:text-[#EEEEF0]"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="tabUnderline" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-neon-mint" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Layout */}
      <main className="container mx-auto px-6 md:px-16 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Column */}
          <div className="lg:col-span-8 flex flex-col gap-16">
            {activeTab === 'overview' && (
              <>
                {/* Introduction */}
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-neon-mint rounded-full" />
                    <h2 className="text-2xl font-black text-[#EEEEF0] tracking-tight">{t('contests.detail.intro_title')}</h2>
                  </div>
                  <p className="text-[#7A7A85] leading-relaxed text-base font-medium max-w-3xl">
                    {t(data.introduction)}
                  </p>
                </div>

                {/* Format */}
                <div className="flex flex-col gap-6">
                   <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-neon-mint rounded-full" />
                    <h2 className="text-2xl font-black text-[#EEEEF0] tracking-tight">{t('contests.detail.format_title')}</h2>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {data.formatTags.map((tag, idx) => (
                      <div key={idx} className="bg-[#141418] px-5 py-3 rounded-xl border border-white/5 text-sm font-bold text-[#EEEEF0] hover:border-neon-mint/30 hover:bg-neon-mint/5 transition-all cursor-default">
                        {t(tag)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Schedule */}
                <div className="flex flex-col gap-10">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-neon-mint rounded-full" />
                    <h2 className="text-2xl font-black text-[#EEEEF0] tracking-tight">{t('contests.detail.schedule_title')}</h2>
                  </div>
                  <div className="relative flex justify-between items-center max-w-3xl px-4 py-8 bg-[#141418]/50 rounded-2xl border border-white/5">
                    {/* Progress Line Background */}
                    <div className="absolute left-10 right-10 top-[44px] h-[2px] bg-white/5" />
                    {/* Active Progress Line */}
                    <div className="absolute left-10 w-[35%] top-[44px] h-[2px] bg-neon-mint shadow-[0_0_10px_rgba(110,231,183,0.5)]" />
                    
                    {data.schedule.map((item, idx) => (
                      <div key={idx} className="relative flex flex-col items-center gap-6 z-10">
                        <div className="flex flex-col items-center gap-2">
                          <div className={cn(
                            "w-4 h-4 rounded-full border-4 border-[#141418] transition-all duration-500",
                            item.status === 'completed' ? "bg-neon-mint scale-110" : 
                            item.status === 'active' ? "bg-neon-mint scale-125 shadow-[0_0_15px_rgba(110,231,183,1)]" : 
                            "bg-[#2A2A35] border-[#141418]"
                          )} />
                        </div>
                        <div className="flex flex-col items-center text-center">
                           <span className={cn(
                             "text-xs font-black uppercase tracking-widest mb-1 transition-colors",
                             item.status === 'active' ? "text-neon-mint" : "text-[#7A7A85]"
                           )}>{t(item.label)}</span>
                           <span className="text-[10px] font-bold text-[#3A3A45] tracking-tight">{item.date}</span>
                        </div>
                        {item.status === 'active' && (
                          <motion.div 
                            layoutId="activePointer"
                            className="absolute -top-1 w-6 h-6 rounded-full bg-neon-mint/20 animate-ping"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-neon-mint rounded-full" />
                    <h2 className="text-2xl font-black text-[#EEEEF0] tracking-tight">{t('contests.detail.notes_title')}</h2>
                  </div>
                  <ul className="flex flex-col gap-5">
                    {data.notes.map((note, idx) => (
                      <li key={idx} className="flex items-start gap-4 p-5 rounded-2xl bg-[#141418]/30 border border-white/5 hover:border-white/10 transition-colors">
                        <div className="mt-1.5 h-2 w-2 rounded-sm bg-neon-mint rotate-45 flex-shrink-0 shadow-[0_0_8px_rgba(110,231,183,0.4)]" />
                        <span className="text-[15px] text-[#EEEEF0]/80 leading-relaxed font-semibold">{t(note)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {/* Other tabs placeholders */}
            {(activeTab === 'brackets' || activeTab === 'participants' || activeTab === 'rules') && (
               <div className="flex flex-col items-center justify-center py-32 border border-white/5 border-dashed rounded-3xl bg-[#141418]/30">
                   <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                     <Clock className="w-8 h-8 text-[#3A3A45]" />
                   </div>
                   <h3 className="text-2xl font-bold text-[#EEEEF0] mb-2">{t('contests.single.coming_soon.title')}</h3>
                   <p className="text-[#7A7A85] font-medium">{t('contests.single.coming_soon.desc')}</p>
                </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-10">
            
            {/* Bracket Preview */}
            <div className="flex flex-col gap-6">
              <h2 className="text-xs font-black text-[#7A7A85] uppercase tracking-[0.3em] font-barlow italic">{t('contests.single.sidebar.bracket')}</h2>
              <div className="group relative bg-[#141418]/40 p-8 rounded-3xl border border-white/5 border-dashed flex flex-col items-center text-center gap-6 overflow-hidden transition-all hover:bg-[#141418]/60 hover:border-neon-mint/30">
                <div className="absolute inset-0 bg-gradient-to-b from-neon-mint/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Layout className="w-8 h-8 text-[#3A3A45] group-hover:text-neon-mint transition-colors" />
                </div>
                <div className="flex flex-col gap-2 relative z-10">
                  <h3 className="text-base font-black text-[#EEEEF0] tracking-tight">{t('contests.detail.bracket_not_ready')}</h3>
                  <p className="text-xs text-[#7A7A85] font-medium px-4 leading-relaxed">{t('contests.detail.bracket_ai_desc')}</p>
                </div>
                <div className="flex items-center gap-3 bg-white/5 px-5 py-2 rounded-full border border-white/5 relative z-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-mint animate-pulse" />
                  <span className="text-[11px] font-black text-[#EEEEF0] uppercase tracking-wider">2026.04.05 {t('playground.today')}</span>
                </div>
              </div>
            </div>

            {/* Recent Teams */}
            <div className="flex flex-col gap-6">
               <div className="flex items-center justify-between">
                 <h2 className="text-xs font-black text-[#7A7A85] uppercase tracking-[0.3em] font-barlow italic">{t('contests.single.sidebar.teams')}</h2>
                 <span className="text-[10px] font-black text-neon-mint">18/32</span>
               </div>
               <div className="flex flex-col gap-3">
                 {data.recentTeams.map((team, idx) => (
                   <div key={idx} className="bg-[#141418]/60 p-4 rounded-2xl border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-[#1C1C21] hover:border-neon-mint/20 transition-all hover:translate-x-1">
                     <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-[#0C0C0F] border border-white/10 flex items-center justify-center text-sm font-black text-neon-mint group-hover:border-neon-mint/40 transition-colors shadow-inner">
                          {team.initials}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[15px] font-black text-[#EEEEF0] tracking-tight">{team.name}</span>
                          <span className="text-[10px] font-bold text-[#3A3A45] uppercase tracking-widest">{t('contests.single.verified_team')}</span>
                        </div>
                     </div>
                     <div className="flex flex-col items-end gap-1">
                        <span className="text-[11px] font-bold text-[#7A7A85]">{t(`contests.single.sidebar.${team.type}`, { count: team.time })}</span>
                       <ChevronRight className="w-3 h-3 text-[#3A3A45] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>

        {/* More Contests */}
        <section className="mt-40 mb-32 flex flex-col gap-12">
           <div className="flex items-center justify-between">
              <div className="flex flex-col gap-3">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-[2px] bg-neon-mint" />
                    <span className="text-xs font-black text-neon-mint uppercase tracking-[0.3em] font-barlow italic">{t('contests.single.sidebar.teams')}</span>
                 </div>
                 <h2 className="text-5xl font-black text-[#EEEEF0] tracking-tight italic uppercase font-barlow">{t('contests.detail.related_title')}</h2>
              </div>
              <Button variant="link" className="text-[#7A7A85] hover:text-neon-mint font-black uppercase tracking-widest text-[11px] flex items-center gap-3 group font-barlow italic">
                 {t('contests.detail.view_all')}
                 <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-all group-hover:border-neon-mint/30 group-hover:bg-neon-mint/5">
                   <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                 </div>
              </Button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {RELATED_MOCK.map((contest) => (
                <ContestCard key={contest.id} {...contest} title={t(contest.title)} />
             ))}
           </div>
        </section>
      </main>

      {/* Sticky Bottom Application Bar */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-10 left-0 right-0 z-50 px-6 pointer-events-none"
          >
            <div className="container mx-auto flex justify-center">
              <div className="w-full max-w-5xl bg-[#141418]/80 backdrop-blur-2xl border border-white/10 rounded-[32px] p-2 flex items-center justify-between shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] pointer-events-auto overflow-hidden relative group">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-neon-mint/5 via-transparent to-transparent opacity-50" />
                
                <div className="hidden md:flex items-center gap-12 pl-8 relative z-10">
                  <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-black text-[#7A7A85] uppercase tracking-[0.2em] font-barlow italic">{t('contests.single.sidebar.total_prize')}</span>
                      <span className="text-2xl font-black text-neon-mint font-barlow italic tracking-tight">₩500,000</span>
                   </div>
                   <div className="h-10 w-px bg-white/5" />
                   <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-black text-[#7A7A85] uppercase tracking-[0.2em] font-barlow italic">{t('contests.single.sidebar.participants')}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-[#EEEEF0] font-barlow italic">18 / 32</span>
                        <div className="px-2 py-0.5 rounded-full bg-neon-mint/10 border border-neon-mint/20 text-[9px] font-black text-neon-mint font-barlow italic">HOT</div>
                      </div>
                   </div>
                   <div className="h-10 w-px bg-white/5" />
                   <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-black text-[#7A7A85] uppercase tracking-[0.2em] font-barlow italic">{t('contests.single.sidebar.status')}</span>
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-neon-mint animate-pulse shadow-[0_0_8px_rgba(46,255,183,0.8)]" />
                         <span className="text-[13px] font-black text-[#EEEEF0] font-barlow italic uppercase tracking-wider">{t(`contests.status.${data.status}`)}</span>
                      </div>
                   </div>
                </div>

                <div className="p-1 relative z-10 w-full md:w-auto">
                  <Button size="lg" className="w-full md:w-64 h-16 bg-neon-mint hover:bg-white text-deep-black font-black text-base uppercase tracking-[0.1em] rounded-2xl shadow-[0_0_30px_rgba(46,255,183,0.3)] transition-all active:scale-95 flex items-center justify-center gap-3 group/btn">
                    {t('contests.detail.apply_sticky')}
                    <div className="w-6 h-6 rounded-full bg-deep-black/10 flex items-center justify-center transition-transform group-hover/btn:translate-x-1">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
