'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  Trophy, 
  Users, 
  Calendar, 
  Globe, 
  Layout, 
  ChevronRight,
  Share2,
  Clock,
  MessageCircle,
  Send,
  ShieldCheck,
  Check,
  X,
  UserPlus,
  Trash2,
  Play,
  Square,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ContestCard } from './ContestCard';
import { 
  useContest, 
  useMyContestStatus, 
  useApplyToContest, 
  useCancelApplication, 
  useWithdrawFromContest,
  useContestMembers,
  useContestResult,
  useContestComments,
  useCreateComment,
  useStartContest,
  useStopContest,
  useDeleteContest,
  useContestApplications,
  useAcceptApplication,
  useRejectApplication,
  useChangeMemberRole
} from '@/hooks/use-contests';
import { StatePlaceholder } from '@/components/shared/StatePlaceholder';
import { ContestStatus, GameType, MemberType, LeaderType } from '@/types/contest';

// Keep RELATED_MOCK for now as related contests API isn't ready
const RELATED_MOCK = [
  {
    id: 1,
    game: 'Valorant',
    status: ContestStatus.PENDING,
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
    status: ContestStatus.ACTIVE,
    title: 'contests.single.mock.related.1',
    creator: 'LOL_Official',
    date: '2026-03-27',
    prize: '₩200,000',
    participants: 16,
    maxParticipants: 16,
    gameColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  }
];

export function ContestDetailContent() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { data: contest, isLoading, isError } = useContest(id);
  const { data: myStatus } = useMyContestStatus(id);

  // Participant Mutations
  const applyMutation = useApplyToContest();
  const cancelMutation = useCancelApplication();
  const withdrawMutation = useWithdrawFromContest();
  const createCommentMutation = useCreateComment();

  // Leader Mutations
  const startContest = useStartContest();
  const stopContest = useStopContest();
  const deleteContest = useDeleteContest();
  const acceptApplication = useAcceptApplication();
  const rejectApplication = useRejectApplication();
  const changeRole = useChangeMemberRole();

  // API data for tabs
  const { data: membersData, isLoading: isMembersLoading } = useContestMembers(id);
  const { data: resultData, isLoading: isResultLoading } = useContestResult(id);
  const { data: commentsData, isLoading: isCommentsLoading } = useContestComments(id);
  const { data: applicationsData, isLoading: isAppsLoading } = useContestApplications(id);

  const [activeTab, setActiveTab] = useState('overview');
  const [commentContent, setCommentContent] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleApply = async () => {
    try {
      await applyMutation.mutateAsync({ contestId: id });
    } catch (error) {
      console.error('Failed to apply:', error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentContent.trim() || createCommentMutation.isPending) return;

    try {
      await createCommentMutation.mutateAsync({
        contestId: id,
        content: commentContent,
      });
      setCommentContent('');
    } catch (error) {
      console.error('Failed to post comment:', error);
    }
  };

  const handleCancel = async () => {
    if (!confirm(t('contests.single.cancel_confirm'))) return;
    try {
      await cancelMutation.mutateAsync(id);
    } catch (error) {
      console.error('Failed to cancel:', error);
    }
  };

  const handleStart = async () => {
    if (!confirm(t('contests.detail.confirm_start'))) return;
    try {
      await startContest.mutateAsync(id);
      alert(t('contests.single.start_success'));
    } catch (error) {
      console.error('Failed to start:', error);
    }
  };

  const handleStop = async () => {
    if (!confirm(t('contests.detail.confirm_stop'))) return;
    try {
      await stopContest.mutateAsync(id);
      alert(t('contests.single.stop_success'));
    } catch (error) {
      console.error('Failed to stop:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm(t('contests.detail.confirm_delete'))) return;
    try {
      await deleteContest.mutateAsync(id);
      alert(t('contests.single.delete_success'));
      router.push('/contests');
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const handleAccept = async (userId: number) => {
    try {
      await acceptApplication.mutateAsync({ contestId: id, userId });
      alert(t('contests.single.accept_success'));
    } catch (error) {
      console.error('Failed to accept:', error);
    }
  };

  const handleReject = async (userId: number) => {
    try {
      await rejectApplication.mutateAsync({ contestId: id, userId });
      alert(t('contests.single.reject_success'));
    } catch (error) {
      console.error('Failed to reject:', error);
    }
  };

  const handleChangeRole = async (userId: number, role: MemberType) => {
    try {
      await changeRole.mutateAsync({ contestId: id, userId, data: { member_type: role } });
      alert(t('contests.single.role_change_success'));
    } catch (error) {
      console.error('Failed to change role:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (isError || !contest) {
    return (
      <StatePlaceholder 
        type="error" 
        fullScreen 
        onRetry={() => window.location.reload()} 
      />
    );
  }

  // Role helpers
  const isLeader = myStatus?.is_leader;
  const isPending = contest.contest_status === ContestStatus.PENDING;
  const isActive = contest.contest_status === ContestStatus.ACTIVE;

  // Map API data to UI structure
  const gameInfo = {
    [GameType.VALORANT]: { color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
    [GameType.LOL]: { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  }[contest.game_type as GameType] || { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };

  const formatTags = [
    t(`contests.single.type.${contest.contest_type}`),
    `${contest.max_team_count} ${t('contests.create.preview.teams')}`,
    contest.auto_start ? t('contests.single.auto_start') : t('contests.single.manual_start')
  ];

  // Mock data for missing API fields (for layout preservation)
  const schedule = [
    { label: 'contests.single.mock.schedule.registration', date: '3/28 ~ 4/4', status: 'completed' },
    { label: 'contests.single.mock.schedule.contest', date: '4/5 ~ 4/6', status: 'active' },
    { label: 'contests.single.mock.schedule.result', date: '4/7', status: 'upcoming' },
  ];

  const prizePool = [
    { rank: '1st', amount: contest.total_point ? `₩${contest.total_point.toLocaleString()}` : 'TBD', label: 'contests.single.mock.prize.first' },
    { rank: '2nd', amount: 'TBD', label: 'contests.single.mock.prize.second' },
    { rank: '3rd', amount: 'TBD', label: 'contests.single.mock.prize.third' },
  ];

  const heroImage = contest.thumbnail || 'https://images.unsplash.com/photo-1624138784614-87fd1b6528f2?q=80&w=2000&auto=format&fit=crop';
  const participantCount = contest.total_team_member || 0;
  const maxParticipants = contest.max_team_count || 16;
  const creatorName = 'GAMERS Official';
  
  const baseTabs = [
    { id: 'overview', label: t('contests.detail.tabs.overview') },
    { id: 'brackets', label: t('contests.detail.brackets') },
    { id: 'participants', label: t('contests.detail.participants') },
    { id: 'rules', label: t('contests.detail.rules') },
    { id: 'comments', label: t('contests.detail.comments') },
  ];

  const tabs = isLeader 
    ? [...baseTabs, { id: 'applications', label: t('contests.detail.applications') }]
    : baseTabs;

  // Application status helper
  const isApplied = myStatus?.has_applied;

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
            src={heroImage} 
            alt={contest.title}
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
            <div className="flex items-center justify-between">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4"
              >
                 <span className="text-sm font-black text-[#7A7A85] tracking-[0.2em] uppercase">{t('contests.single.hero.breadcrumb')}</span>
                 <ChevronRight className="w-4 h-4 text-[#3A3A45]" />
                 <span className="text-sm font-black text-[#EEEEF0] tracking-tight">{contest.title}</span>
              </motion.div>

              {/* Leader Quick Actions */}
              {isLeader && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3"
                >
                  {isPending && (
                    <Button 
                      onClick={handleStart}
                      className="bg-neon-mint hover:bg-white text-deep-black font-black uppercase text-[11px] tracking-widest px-6 h-10 shadow-[0_0_20px_rgba(110,231,183,0.3)]"
                      disabled={startContest.isPending}
                    >
                      <Play className="w-3.5 h-3.5 mr-2 fill-current" />
                      {t('contests.detail.start_contest')}
                    </Button>
                  )}
                  {isActive && (
                    <Button 
                      onClick={handleStop}
                      className="bg-red-500 hover:bg-red-400 text-white font-black uppercase text-[11px] tracking-widest px-6 h-10 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                      disabled={stopContest.isPending}
                    >
                      <Square className="w-3.5 h-3.5 mr-2 fill-current" />
                      {t('contests.detail.stop_contest')}
                    </Button>
                  )}
                  <Button 
                    variant="outline"
                    onClick={handleDelete}
                    className="border-white/10 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 text-[#7A7A85] font-black uppercase text-[11px] tracking-widest h-10"
                    disabled={deleteContest.isPending}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </motion.div>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3"
              >
                <div className={cn("flex items-center gap-2 rounded px-3 py-1 border", gameInfo.bg, gameInfo.border)}>
                  <span className={cn("text-[10px] font-black tracking-widest uppercase", gameInfo.color)}>
                    {contest.game_type || 'GENERAL'}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-neon-mint/10 border border-neon-mint/20 backdrop-blur-md shadow-[0_0_15px_rgba(110,231,183,0.1)]">
                  <div className="h-1.5 w-1.5 rounded-full bg-neon-mint animate-pulse shadow-[0_0_8px_rgba(110,231,183,1)]" />
                  <span className="text-[10px] font-black tracking-widest uppercase text-neon-mint">
                    {t(`contests.detail.status.${contest.contest_status}`)}
                  </span>
                </div>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.8 }}
                className="text-5xl md:text-7xl font-black text-[#EEEEF0] tracking-tight leading-tight max-w-4xl"
              >
                {contest.title}
              </motion.h1>

              <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.3 }}
                 className="flex items-center gap-4 mt-2"
              >
                 <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-[10px] font-bold text-[#7A7A85]">
                       {creatorName[0]}
                    </div>
                    <span className="text-sm font-bold text-[#7A7A85]">{creatorName}</span>
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
                <span className="text-3xl md:text-4xl font-black text-[#EEEEF0] font-barlow italic tracking-tighter transition-transform group-hover:scale-105 origin-left">
                  {contest.total_point ? `₩${contest.total_point.toLocaleString()}` : 'TBD'}
                </span>
              </div>
              <div className="flex flex-col gap-1.5 group cursor-default">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#3A3A45] group-hover:text-neon-mint transition-colors">{t('contests.single.stats.teams')}</span>
                <span className="text-3xl md:text-4xl font-black text-[#EEEEF0] font-barlow italic tracking-tighter transition-transform group-hover:scale-105 origin-left">
                  {participantCount} / {maxParticipants}
                </span>
              </div>
              <div className="flex flex-col gap-1.5 group cursor-default">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#3A3A45] group-hover:text-neon-mint transition-colors">{t('contests.single.stats.start_date')}</span>
                <span className="text-3xl md:text-4xl font-black text-[#EEEEF0] font-barlow italic tracking-tighter transition-transform group-hover:scale-105 origin-left">
                  {contest.started_at ? new Date(contest.started_at).toLocaleDateString() : 'TBD'}
                </span>
              </div>
              <div className="flex flex-col gap-1.5 group cursor-default">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#3A3A45] group-hover:text-neon-mint transition-colors">{t('contests.single.stats.format')}</span>
                <span className="text-3xl md:text-4xl font-black text-[#EEEEF0] font-barlow italic tracking-tighter transition-transform group-hover:scale-105 origin-left">
                  {t(`contests.single.type.${contest.contest_type}`)}
                </span>
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
                  <div className="text-[#7A7A85] leading-relaxed text-base font-medium max-w-3xl whitespace-pre-wrap">
                    {contest.description || t('contests.single.no_description')}
                  </div>
                </div>

                {/* Format */}
                <div className="flex flex-col gap-6">
                   <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-neon-mint rounded-full" />
                    <h2 className="text-2xl font-black text-[#EEEEF0] tracking-tight">{t('contests.detail.format_title')}</h2>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {formatTags.map((tag, idx) => (
                      <div key={idx} className="bg-[#141418] px-5 py-3 rounded-xl border border-white/5 text-sm font-bold text-[#EEEEF0] hover:border-neon-mint/30 hover:bg-neon-mint/5 transition-all cursor-default">
                        {tag}
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
                    
                    {schedule.map((item, idx) => (
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

                {/* Prize Pool */}
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-neon-mint rounded-full" />
                    <h2 className="text-2xl font-black text-[#EEEEF0] tracking-tight">{t('contests.detail.prize_title')}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {prizePool.map((prize, idx) => (
                      <div key={idx} className="p-6 rounded-2xl bg-[#141418]/30 border border-white/5 flex flex-col gap-2">
                        <span className="text-xs font-black text-neon-mint uppercase tracking-widest">{prize.rank}</span>
                        <span className="text-2xl font-black text-[#EEEEF0] font-barlow italic">{prize.amount}</span>
                        <span className="text-[10px] font-bold text-[#7A7A85] uppercase tracking-widest">{t(prize.label)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'brackets' && (
               <div className="flex flex-col gap-8">
                 <div className="flex items-center gap-3">
                   <div className="w-1.5 h-6 bg-neon-mint rounded-full" />
                   <h2 className="text-2xl font-black text-[#EEEEF0] tracking-tight">{t('contests.detail.brackets')}</h2>
                 </div>
                 
                 {isResultLoading ? (
                   <div className="py-20 flex justify-center">
                     <div className="w-8 h-8 border-2 border-neon-mint border-t-transparent rounded-full animate-spin" />
                   </div>
                 ) : !resultData || resultData.rounds.length === 0 ? (
                   <div className="flex flex-col items-center justify-center py-32 border border-white/5 border-dashed rounded-3xl bg-[#141418]/30">
                     <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                       <Layout className="w-8 h-8 text-[#3A3A45]" />
                     </div>
                     <h3 className="text-2xl font-bold text-[#EEEEF0] mb-2">{t('contests.single.coming_soon.title')}</h3>
                     <p className="text-[#7A7A85] font-medium">{t('contests.single.coming_soon.desc')}</p>
                   </div>
                 ) : (
                   <div className="flex flex-col gap-12">
                     {resultData.rounds.map((round) => (
                       <div key={round.round} className="flex flex-col gap-6">
                         <h3 className="text-lg font-black text-neon-mint italic uppercase font-barlow tracking-widest px-4 py-2 bg-neon-mint/5 border-l-2 border-neon-mint max-w-fit">
                           {round.round_name || `Round ${round.round}`}
                         </h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {round.games.map((game: any, idx: number) => (
                             <div key={idx} className="p-6 rounded-2xl bg-[#141418]/50 border border-white/5 flex flex-col gap-4 hover:border-white/10 transition-colors">
                               <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#3A3A45]">
                                 <span>Game #{game.game_id || idx + 1}</span>
                                 <span>{game.game_status}</span>
                               </div>
                               <div className="flex flex-col gap-3">
                                 <div className="flex justify-between items-center">
                                   <span className="text-sm font-bold text-[#EEEEF0]">Team A</span>
                                   <span className="text-lg font-black font-barlow italic">0</span>
                                 </div>
                                 <div className="h-px bg-white/5" />
                                 <div className="flex justify-between items-center text-neon-mint">
                                   <span className="text-sm font-bold">Team B</span>
                                   <span className="text-lg font-black font-barlow italic">2</span>
                                 </div>
                               </div>
                             </div>
                           ))}
                         </div>
                       </div>
                     ))}
                   </div>
                 )}
               </div>
            )}

            {activeTab === 'participants' && (
              <div className="flex flex-col gap-8">
                 <div className="flex items-center gap-3">
                   <div className="w-1.5 h-6 bg-neon-mint rounded-full" />
                   <h2 className="text-2xl font-black text-[#EEEEF0] tracking-tight">{t('contests.detail.participants')}</h2>
                 </div>

                 {isMembersLoading ? (
                   <div className="py-20 flex justify-center">
                     <div className="w-8 h-8 border-2 border-neon-mint border-t-transparent rounded-full animate-spin" />
                   </div>
                 ) : !membersData || membersData.data.length === 0 ? (
                   <div className="flex flex-col items-center justify-center py-32 border border-white/5 border-dashed rounded-3xl bg-[#141418]/30">
                     <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                       <Users className="w-8 h-8 text-[#3A3A45]" />
                     </div>
                     <h3 className="text-lg font-bold text-[#EEEEF0]">{t('contests.single.no_participants')}</h3>
                   </div>
                 ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {membersData.data.map((member) => (
                       <div key={member.user_id} className="p-5 rounded-2xl bg-[#141418]/50 border border-white/5 flex items-center justify-between group hover:bg-[#141418] transition-colors relative">
                         <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/5 flex items-center justify-center overflow-hidden">
                             {member.avatar ? (
                               <img src={member.avatar} alt={member.username} className="w-full h-full object-cover" />
                             ) : (
                               <span className="text-sm font-bold text-[#7A7A85]">{member.username[0]}</span>
                             )}
                           </div>
                           <div className="flex flex-col">
                             <div className="flex items-center gap-2">
                               <span className="text-base font-black text-[#EEEEF0] tracking-tight">{member.username}</span>
                               {member.leader_type === LeaderType.LEADER && (
                                 <ShieldCheck className="w-4 h-4 text-neon-mint" />
                               )}
                               {member.member_type === MemberType.STAFF && (
                                 <div className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[9px] font-black text-blue-500 uppercase tracking-widest">STAFF</div>
                               )}
                             </div>
                             <span className="text-[10px] font-bold text-[#3A3A45] tracking-widest uppercase">{member.tag}</span>
                           </div>
                         </div>
                         
                         <div className="flex flex-col items-end gap-2">
                           <div className="flex flex-col items-end">
                             <span className="text-sm font-black text-neon-mint font-barlow italic tracking-tight">{member.point} PT</span>
                             <span className="text-[10px] font-bold text-[#3A3A45] uppercase tracking-widest">{t('contests.single.stats.points')}</span>
                           </div>

                           {/* Member Management Actions */}
                           {isLeader && member.leader_type !== LeaderType.LEADER && (
                             <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <Button 
                                 variant="ghost" 
                                 size="icon" 
                                 className="h-8 w-8 hover:bg-white/5 text-[#7A7A85] hover:text-white"
                                 onClick={() => {
                                   const newRole = member.member_type === MemberType.STAFF ? MemberType.NORMAL : MemberType.STAFF;
                                   handleChangeRole(member.user_id, newRole);
                                 }}
                               >
                                 {member.member_type === MemberType.STAFF ? <Users className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                               </Button>
                             </div>
                           )}
                         </div>
                       </div>
                     ))}
                   </div>
                 )}
              </div>
            )}

            {activeTab === 'applications' && isLeader && (
              <div className="flex flex-col gap-8">
                 <div className="flex items-center gap-3">
                   <div className="w-1.5 h-6 bg-neon-mint rounded-full" />
                   <h2 className="text-2xl font-black text-[#EEEEF0] tracking-tight">{t('contests.detail.applications')}</h2>
                 </div>

                 {isAppsLoading ? (
                   <div className="py-20 flex justify-center">
                     <div className="w-8 h-8 border-2 border-neon-mint border-t-transparent rounded-full animate-spin" />
                   </div>
                 ) : !applicationsData || applicationsData.length === 0 ? (
                   <div className="flex flex-col items-center justify-center py-32 border border-white/5 border-dashed rounded-3xl bg-[#141418]/30">
                     <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                       <UserPlus className="w-8 h-8 text-[#3A3A45]" />
                     </div>
                     <h3 className="text-lg font-bold text-[#EEEEF0]">{t('contests.single.no_participants')}</h3>
                   </div>
                 ) : (
                   <div className="flex flex-col gap-4">
                     {applicationsData.map((app: any) => (
                       <div key={app.user_id} className="p-6 rounded-3xl bg-[#141418]/50 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:bg-[#141418] transition-colors">
                         <div className="flex items-center gap-4">
                           <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/5 flex items-center justify-center overflow-hidden">
                             {app.sender?.avatar ? (
                               <img src={app.sender.avatar} alt={app.sender.username} className="w-full h-full object-cover" />
                             ) : (
                               <span className="text-lg font-black text-[#7A7A85]">{app.sender?.username?.[0] || 'U'}</span>
                             )}
                           </div>
                           <div className="flex flex-col">
                             <div className="flex items-center gap-2">
                               <span className="text-lg font-black text-[#EEEEF0] tracking-tight">{app.sender?.username}</span>
                               <span className="text-[11px] font-bold text-[#3A3A45] tracking-widest uppercase">{app.sender?.tag}</span>
                             </div>
                             <p className="text-sm text-[#7A7A85] font-medium line-clamp-1">{app.sender?.description || t('contests.single.no_description')}</p>
                           </div>
                         </div>
                         
                         <div className="flex items-center gap-3">
                           <Button 
                             onClick={() => handleAccept(app.user_id)}
                             className="flex-1 md:flex-none h-12 px-8 bg-neon-mint hover:bg-white text-deep-black font-black uppercase text-[11px] tracking-widest rounded-xl transition-all active:scale-95"
                           >
                             <Check className="w-4 h-4 mr-2" />
                             {t('contests.detail.accept')}
                           </Button>
                           <Button 
                             variant="outline"
                             onClick={() => handleReject(app.user_id)}
                             className="flex-1 md:flex-none h-12 px-8 border-white/10 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 text-[#7A7A85] font-black uppercase text-[11px] tracking-widest rounded-xl transition-all active:scale-95"
                           >
                             <X className="w-4 h-4 mr-2" />
                             {t('contests.detail.reject')}
                           </Button>
                         </div>
                       </div>
                     ))}
                   </div>
                 )}
              </div>
            )}

            {activeTab === 'rules' && (
               <div className="flex flex-col gap-10">
                   <div className="flex items-center gap-3">
                     <div className="w-1.5 h-6 bg-neon-mint rounded-full" />
                     <h2 className="text-2xl font-black text-[#EEEEF0] tracking-tight">{t('contests.detail.rules')}</h2>
                   </div>
                   <div className="prose prose-invert max-w-none text-[#7A7A85] leading-relaxed">
                     <p className="whitespace-pre-wrap">{contest.description || t('contests.single.no_rules')}</p>
                   </div>
                </div>
            )}
            
            {activeTab === 'comments' && (
              <div className="flex flex-col gap-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-neon-mint rounded-full" />
                    <h2 className="text-2xl font-black text-[#EEEEF0] tracking-tight">{t('contests.detail.comments')}</h2>
                  </div>
                </div>

                {/* Comment Input */}
                <div className="bg-[#141418]/50 p-6 rounded-3xl border border-white/5 flex flex-col gap-4">
                  <textarea 
                    className="w-full bg-transparent border-none focus:ring-0 text-[#EEEEF0] placeholder:text-[#3A3A45] font-medium resize-none min-h-[100px]"
                    placeholder={t('contests.single.comment_placeholder')}
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                  />
                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <span className="text-[10px] font-bold text-[#3A3A45] tracking-widest uppercase">{commentContent.length}/255</span>
                    <Button 
                      className="bg-neon-mint hover:bg-white text-deep-black font-black uppercase text-[11px] tracking-widest px-6 h-10 group"
                      onClick={handleCommentSubmit}
                      disabled={!commentContent.trim() || createCommentMutation.isPending}
                    >
                      {t('contests.single.post_comment')}
                      <Send className="w-3.5 h-3.5 ml-2 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  </div>
                </div>

                {/* Comments List */}
                <div className="flex flex-col gap-6">
                  {isCommentsLoading ? (
                    <div className="py-20 flex justify-center">
                      <div className="w-8 h-8 border-2 border-neon-mint border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : !commentsData || commentsData.data.length === 0 ? (
                    <div className="text-center py-12 text-[#3A3A45] font-bold italic uppercase tracking-widest">
                      {t('contests.single.no_comments')}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-8">
                      {commentsData.data.map((comment) => (
                        <div key={comment.comment_id} className="flex gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/5">
                            {comment.author.avatar ? (
                              <img src={comment.author.avatar} alt={comment.author.username} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xs font-bold text-[#7A7A85]">{comment.author.username[0]}</span>
                            )}
                          </div>
                          <div className="flex flex-col gap-1.5 flex-1">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-black text-[#EEEEF0]">{comment.author.username}</span>
                              <span className="text-[10px] font-bold text-[#3A3A45] uppercase tracking-widest">{new Date(comment.created_at).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm font-medium text-[#7A7A85] leading-relaxed">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
                  <span className="text-[11px] font-black text-[#EEEEF0] uppercase tracking-wider">{new Date().toLocaleDateString()} {t('playground.today')}</span>
                </div>
              </div>
            </div>

            {/* Application Requirements */}
            <div className="flex flex-col gap-6">
              <h2 className="text-xs font-black text-[#7A7A85] uppercase tracking-[0.3em] font-barlow italic">{t('contests.single.sidebar.requirements')}</h2>
              <div className="bg-[#141418]/60 p-6 rounded-3xl border border-white/5 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-[#7A7A85]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-[#3A3A45] uppercase tracking-widest">{t('contests.detail.hero.region')}</span>
                    <span className="text-xs font-bold text-[#EEEEF0]">{t('contests.detail.hero.asia_pacific')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <Users className="w-4 h-4 text-[#7A7A85]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-[#3A3A45] uppercase tracking-widest">{t('contests.detail.hero.slots')}</span>
                    <span className="text-xs font-bold text-[#EEEEF0]">{maxParticipants} {t('contests.create.team.team_suffix')}</span>
                  </div>
                </div>
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
             {RELATED_MOCK.map((related) => (
                <ContestCard key={related.id} {...related} title={t(related.title)} />
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
                <div className="absolute inset-0 bg-gradient-to-r from-neon-mint/5 via-transparent to-transparent opacity-50" />
                
                <div className="hidden md:flex items-center gap-12 pl-8 relative z-10">
                  <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-black text-[#7A7A85] uppercase tracking-[0.2em] font-barlow italic">{t('contests.detail.hero.prize_pool')}</span>
                      <span className="text-2xl font-black text-neon-mint font-barlow italic tracking-tight italic uppercase">
                        {contest.total_point ? `₩${contest.total_point.toLocaleString()}` : 'TBD'}
                      </span>
                   </div>
                   <div className="h-10 w-px bg-white/5" />
                   <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-black text-[#7A7A85] uppercase tracking-[0.2em] font-barlow italic">{t('contests.detail.hero.slots')}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-[#EEEEF0] font-barlow italic">
                          {participantCount} / {maxParticipants}
                        </span>
                        {participantCount >= maxParticipants * 0.8 && (
                          <div className="px-2 py-0.5 rounded-full bg-neon-mint/10 border border-neon-mint/20 text-[9px] font-black text-neon-mint font-barlow italic">HOT</div>
                        )}
                      </div>
                   </div>
                   <div className="h-10 w-px bg-white/5" />
                   <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-black text-[#7A7A85] uppercase tracking-[0.2em] font-barlow italic">{t('contests.single.sidebar.status')}</span>
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-neon-mint animate-pulse shadow-[0_0_8px_rgba(46,255,183,0.8)]" />
                         <span className="text-[13px] font-black text-[#EEEEF0] font-barlow italic uppercase tracking-wider">
                           {t(`contests.detail.status.${contest.contest_status}`)}
                         </span>
                      </div>
                   </div>
                </div>

                <div className="p-1 relative z-10 w-full md:w-auto">
                  <Button 
                    size="lg" 
                    className={cn(
                      "w-full md:w-64 h-16 transition-all active:scale-95 flex items-center justify-center gap-3 group/btn font-black text-base uppercase tracking-[0.1em] rounded-2xl shadow-[0_0_30px_rgba(46,255,183,0.3)]",
                      isApplied ? "bg-white/10 hover:bg-white/20 text-white border border-white/10" : "bg-neon-mint hover:bg-white text-deep-black"
                    )}
                    onClick={isApplied ? handleCancel : handleApply}
                    disabled={applyMutation.isPending || cancelMutation.isPending || (!isApplied && !isPending)}
                  >
                    {isApplied ? t('contests.single.cancel_application') : t('contests.detail.cta.apply')}
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center transition-transform group/btn:translate-x-1",
                      isApplied ? "bg-white/10" : "bg-deep-black/10"
                    )}>
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
