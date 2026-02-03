"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Play, Square, Settings, Users, Trophy, CheckCircle2, AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { ContestResponse } from "@/types/api";
import { contestService } from "@/services/contest-service";
import { useToast } from "@/context/ToastContext";
import { BracketGenerator } from "./BracketGenerator";
import { cn } from "@/lib/utils";
import ReceivedApplicationsSection from "@/components/mypage/ReceivedApplicationsSection";
import ContestParticipantsPanel from "./ContestParticipantsPanel"; // 

interface ContestDashboardProps {
    contestId: number;
    isLeader: boolean;
}

import { useTranslation } from "react-i18next";

export function ContestDashboard({ contestId, isLeader }: ContestDashboardProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { addToast } = useToast();
  const [contest, setContest] = useState<ContestResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'bracket' | 'settings' | 'applications' | 'participants'>('overview');
  const [participants, setParticipants] = useState<any[]>([]); 

  const fetchContest = async () => {
    try {
      setLoading(true);
      const res = await contestService.getContest(contestId);
      setContest(res.data);
      
      // Also fetch participants for stats
      const membersRes = await contestService.getContestMembers(contestId, { page: 1, page_size: 1000 });
      setParticipants(membersRes.data.data);
      
    } catch (error) {
      console.error("Failed to fetch contest", error);
      addToast(t('contestDashboard.toast.loadDataFail'), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      if (contestId) {
          fetchContest();
      }
  }, [contestId]);

  const handleStartContest = async () => {
    try {
        await contestService.startContest(contestId);
        addToast(t('contestDashboard.toast.startSuccess'), "success");
        fetchContest();
    } catch (error: any) {
        addToast(error.response?.data?.message || t('contestDashboard.toast.startFail'), "error");
    }
  };

  const handleStopContest = async () => {
       try {
        await contestService.stopContest(contestId);
        addToast(t('contestDashboard.toast.stopSuccess'), "success");
        fetchContest();
    } catch (error: any) {
        addToast(error.response?.data?.message || t('contestDashboard.toast.stopFail'), "error");
    }
  };

  const handleDeleteContest = async () => {
      if (!confirm(t('contestDashboard.confirmDelete'))) return;
       try {
        await contestService.deleteContest(contestId);
        addToast(t('contestDashboard.toast.deleteSuccess'), "success");
        router.push('/contests');
    } catch (error: any) {
        addToast(error.response?.data?.message || t('contestDashboard.toast.deleteFail'), "error");
    }
  };

  if (loading) {
       return (
        <div className="flex h-64 items-center justify-center">
            <Loader2 className="w-8 h-8 text-neon-cyan animate-spin" />
        </div>
      );
  }

  if (!contest) return <div>{t('contestDashboard.notFound')}</div>;

  const isActive = contest.contest_status !== 'FINISHED' && contest.contest_status !== 'CANCELLED'; 

  return (
    <div className="space-y-6">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             <div className="bg-neutral-900/50 border border-white/10 rounded-xl p-4 flex items-center gap-4">
                 <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                     <Users size={24} />
                 </div>
                 <div>
                     <div className="text-2xl font-bold text-white">{participants.length}</div>
                     <div className="text-xs text-neutral-400 uppercase tracking-wide">{t('contestDashboard.stats.participants')}</div>
                 </div>
             </div>
             
             <div className="bg-neutral-900/50 border border-white/10 rounded-xl p-4 flex items-center gap-4">
                 <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                     <CheckCircle2 size={24} />
                 </div>
                 <div>
                     <div className="text-lg font-bold text-white font-mono">{contest.contest_status}</div>
                     <div className="text-xs text-neutral-400 uppercase tracking-wide">{t('contestDashboard.stats.status')}</div>
                 </div>
             </div>

             {/* Actions */}
             <div className="md:col-span-2 flex gap-3">
                 {contest.contest_status === 'RECRUITING' || contest.contest_status === 'PREPARING' ? (
                     <button 
                        onClick={handleStartContest}
                        className="flex-1 bg-neon-cyan hover:bg-neon-cyan/80 text-black font-bold rounded-xl flex flex-col items-center justify-center gap-1 transition-all shadow-[0_0_15px_rgba(0,243,255,0.2)]"
                     >
                         <Play size={20} />
                         <span>{t('contestDashboard.actions.start')}</span>
                     </button>
                 ) : (
                    <button disabled className="flex-1 bg-neutral-800 text-neutral-500 font-bold rounded-xl flex flex-col items-center justify-center gap-1 cursor-not-allowed border border-white/5">
                        <Play size={20} />
                         <span>{t('contestDashboard.actions.started')}</span>
                    </button>
                 )}

                <button 
                    onClick={handleStopContest}
                    disabled={!isActive}
                    className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 font-bold rounded-xl flex flex-col items-center justify-center gap-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Square size={20} fill="currentColor" />
                    <span>{t('contestDashboard.actions.stop')}</span>
                </button>

                <button 
                    onClick={handleDeleteContest}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl flex flex-col items-center justify-center gap-1 transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                >
                     <Trash2 size={20} />
                    <span>{t('contestDashboard.actions.delete')}</span>
                </button>
             </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-white/10 flex gap-6 overflow-x-auto pb-1">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label={t('contestDashboard.tabs.overview')} icon={Trophy} />
            <TabButton active={activeTab === 'applications'} onClick={() => setActiveTab('applications')} label={t('contestDashboard.tabs.applications')} icon={Users} />
            <TabButton active={activeTab === 'participants'} onClick={() => setActiveTab('participants')} label={t('contestDashboard.tabs.participants')} icon={Users} />
            <TabButton active={activeTab === 'bracket'} onClick={() => setActiveTab('bracket')} label={t('contestDashboard.tabs.bracket')} icon={Users} />
            <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} label={t('contestDashboard.tabs.settings')} icon={Settings} />
        </div>

        {/* Content */}
        <div className="min-h-[400px]">
            {activeTab === 'overview' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                     <div className="bg-neutral-900/30 border border-white/5 p-6 rounded-xl">
                         <h3 className="text-xl font-bold text-white mb-4">{t('contestDashboard.overview.title')}</h3>
                         <div className="grid grid-cols-2 gap-y-4 text-sm">
                             <div>
                                 <div className="text-neutral-500">{t('contestDashboard.overview.contestTitle')}</div>
                                 <div className="text-white font-bold">{contest.title}</div>
                             </div>
                             <div>
                                 <div className="text-neutral-500">{t('contestDashboard.overview.maxTeams')}</div>
                                 <div className="text-white font-bold">{contest.max_team_count || t('contestDashboard.overview.unlimited')}</div>
                             </div>
                             <div>
                                 <div className="text-neutral-500">{t('contestDashboard.overview.startDate')}</div>
                                 <div className="text-white font-bold">{contest.started_at ? new Date(contest.started_at).toLocaleDateString() : t('contestDashboard.overview.notSet')}</div>
                             </div>
                             <div>
                                 <div className="text-neutral-500">{t('contestDashboard.overview.endDate')}</div>
                                 <div className="text-white font-bold">{contest.ended_at ? new Date(contest.ended_at).toLocaleDateString() : t('contestDashboard.overview.notSet')}</div>
                             </div>
                         </div>
                     </div>
                     
                     <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl flex gap-3 text-amber-500 text-sm">
                         <AlertTriangle className="shrink-0" />
                         <p>{t('contestDashboard.overview.warning')}</p>
                     </div>
                </div>
            )}

            {activeTab === 'applications' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <ReceivedApplicationsSection contestId={contestId} />
                </div>
            )}

            {activeTab === 'participants' && (
                <ContestParticipantsPanel contestId={contestId} isLeader={isLeader} />
            )}

            {activeTab === 'bracket' && (
                <div className="h-[600px] animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <BracketGenerator contestId={contestId} participants={participants} />
                </div>
            )}

            {activeTab === 'settings' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="p-10 text-center text-neutral-500 border border-dashed border-white/10 rounded-xl">
                        {t('contestDashboard.settings.underConstruction')}
                    </div>
                </div>
            )}
        </div>
    </div>
  );
}

function TabButton({ active, onClick, label, icon: Icon }: any) {
    return (
        <button 
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative",
                active ? "text-neon-cyan" : "text-neutral-500 hover:text-white"
            )}
        >
            <Icon size={16} />
            {label}
            {active && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-neon-cyan shadow-[0_0_10px_rgba(0,243,255,0.5)]" />
            )}
        </button>
    );
}
