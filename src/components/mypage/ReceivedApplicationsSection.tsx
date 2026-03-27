"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contestService } from "@/services/contest-service";
import { ContestResponse, ContestApplicationResponse } from "@/types/api";
import { Loader2, Check, X, Search, ChevronDown, Trophy, Users, Calendar, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import Link from "next/link";

interface ReceivedApplicationsSectionProps {
    contestId?: number;
}

export default function ReceivedApplicationsSection({ contestId }: ReceivedApplicationsSectionProps) {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const [selectedContestId, setSelectedContestId] = useState<number | null>(contestId || null);

  // 1. Fetch My Contests (Only if no contestId provided)
  const { data: contestsResponse, isLoading: isContestsLoading } = useQuery({
    queryKey: ["my-contests"],
    queryFn: () => contestService.getMyContests({ page: 1, page_size: 100, sort_by: "created_at", order: "desc" }),
    enabled: !contestId,
  });

  const contests = contestsResponse?.data?.data || [];

  // Auto-select first contest if available and none selected (and no contestId prop)
  useEffect(() => {
    if (!contestId && contests.length > 0 && selectedContestId === null) {
      setSelectedContestId(contests[0].contest_id);
    }
  }, [contests, selectedContestId, contestId]);

  // If contestId prop changes, update selection
  useEffect(() => {
      if (contestId) setSelectedContestId(contestId);
  }, [contestId]);

  // 2. Fetch Applications for Selected Contest
  const { data: applicationsResponse, isLoading: isAppsLoading } = useQuery({
    queryKey: ["contest-applications", selectedContestId],
    queryFn: () => contestService.getContestApplications(selectedContestId!),
    enabled: !!selectedContestId,
  });

  const applications = applicationsResponse?.data || [];

  // Mutations
  const acceptMutation = useMutation({
    mutationFn: ({ contestId, userId }: { contestId: number; userId: number }) =>
      contestService.acceptApplication(contestId, userId),
    onSuccess: () => {
      addToast(t("mypage.applications.toast.accepted"), "success");
      queryClient.invalidateQueries({ queryKey: ["contest-applications", selectedContestId] });
    },
    onError: (error: any) => {
      addToast(error.response?.data?.message || t("mypage.applications.toast.acceptFailed"), "error");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ contestId, userId }: { contestId: number; userId: number }) =>
      contestService.rejectApplication(contestId, userId),
    onSuccess: () => {
      addToast(t("mypage.applications.toast.rejected"), "success");
      queryClient.invalidateQueries({ queryKey: ["contest-applications", selectedContestId] });
    },
    onError: (error: any) => {
      addToast(error.response?.data?.message || t("mypage.applications.toast.rejectFailed"), "error");
    },
  });

  if (isContestsLoading) {
    // ...
  }

  if (!contestId && contests.length === 0) {
    return (
      <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
        <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-bold text-white mb-2">{t("mypage.applications.noContest")}</h3>
        <p className="text-muted-foreground">{t("mypage.applications.noContestDesc")}</p>
      </div>
    );
  }

  const selectedContest = contests.find(c => c.contest_id === selectedContestId);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-center px-2">
         <div className="space-y-2">
            <h3 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
                <span className="w-1.5 h-8 bg-neon-cyan rounded-full shadow-[0_0_15px_rgba(0,243,255,0.6)]"/> 
                {t("mypage.applications.title")}
            </h3>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] ml-4">
                {t("mypage.applications.description")}
            </p>
         </div>
         
         
         {/* Contest Selector - Only show if not fixed contestId */}
         {!contestId && (
         <div className="relative w-full md:w-80 group">
             <div className="absolute left-5 top-1/2 -translate-y-1/2 text-neon-cyan pointer-events-none group-hover:scale-110 transition-transform">
                <Trophy size={18} />
             </div>
             <select 
                value={selectedContestId || ""}
                onChange={(e) => setSelectedContestId(Number(e.target.value))}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-12 py-3.5 text-xs font-black uppercase tracking-widest appearance-none outline-none focus:border-neon-cyan/50 transition-all text-white cursor-pointer hover:bg-white/[0.06]"
             >
                {contests.map((contest) => (
                    <option key={contest.contest_id} value={contest.contest_id} className="bg-deep-black text-white uppercase tracking-widest">
                        {contest.title}
                    </option>
                ))}
             </select>
             <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none group-hover:text-neon-cyan transition-colors" size={18} />
         </div>
         )}
      </div>

      {/* Selected Contest Info Summary (Optional) */}
      {selectedContest && (
        <div className="glass-card p-5 flex flex-wrap gap-8 text-[10px] items-center border border-white/5">
            <div className="flex items-center gap-3 text-white/40 font-black uppercase tracking-widest">
                <Calendar size={14} className="text-neon-cyan/40" />
                <span suppressHydrationWarning>{t("mypage.applications.created")}: {new Date(selectedContest.created_at).toLocaleDateString()}</span>
            </div>
             <div className="flex items-center gap-3 text-white/40 font-black uppercase tracking-widest">
                <Users size={14} className="text-neon-cyan/40" />
                <span>{t("mypage.applications.currentTeams")}: <span className="text-neon-cyan">{selectedContest.current_team_count || 0}</span> / {selectedContest.max_team_count}</span>
            </div>
            <div className="ml-auto">
                <Link href={`/contests/${selectedContest.contest_id}`} className="group/link text-neon-cyan hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-cyan/5 border border-neon-cyan/20">
                    {t('contestDetail.cta.goToDashboard')} <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
      )}

      {/* Applications Table */}
      <div className="w-full glass-card p-0 border border-white/5 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
         {isAppsLoading ? (
             <div className="flex justify-center p-20">
                 <Loader2 className="w-12 h-12 text-neon-cyan animate-spin" />
             </div>
         ) : applications.length === 0 ? (
             <div className="text-center py-24 flex flex-col items-center">
                 <div className="p-5 bg-white/5 rounded-full border border-white/10 mb-6">
                    <Users className="w-12 h-12 text-white/10" />
                 </div>
                 <p className="text-white/40 font-black uppercase tracking-widest text-xs">{t("mypage.applications.noApps")}</p>
             </div>
         ) : (
             <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                     <thead>
                         <tr className="border-b border-white/5 bg-white/[0.02]">
                             <th className="p-6 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{t("mypage.applications.applicant")}</th>
                             <th className="p-6 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{t("mypage.applications.tag")}</th>
                             <th className="p-6 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{t("mypage.applications.appliedAt")}</th>
                             <th className="p-6 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{t("mypage.applications.status")}</th>
                             <th className="p-6 text-[10px] font-black text-white/20 uppercase tracking-[0.2em] text-right">{t("mypage.applications.actions")}</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                         {applications.map((app) => (
                             <tr key={app.user_id} className="group hover:bg-white/[0.04] transition-all duration-300">
                                 <td className="p-6">
                                     <div className="flex items-center gap-4">
                                         <div className="w-10 h-10 min-w-[2.5rem] min-h-[2.5rem] shrink-0 rounded-xl bg-gradient-to-br from-neutral-800 to-black border border-white/10 flex items-center justify-center font-black text-xs text-neon-cyan overflow-hidden relative shadow-lg group-hover:scale-110 transition-transform">
                                             {app.sender.avatar ? (
                                                 <Image src={app.sender.avatar} alt={app.sender.username} fill sizes="40px" className="object-cover rounded-xl" />
                                             ) : (
                                                 (app.sender.username || "?").substring(0, 2).toUpperCase()
                                             )}
                                         </div>
                                         <span className="font-black text-white tracking-tight group-hover:text-neon-cyan transition-colors">{app.sender.username || t("mypage.applications.unknownUser")}</span>
                                     </div>
                                 </td>
                                 <td className="p-6 text-xs font-bold text-white/30 uppercase tracking-widest">#{app.sender.tag}</td>
                                 <td className="p-6 text-xs font-bold text-white/30 uppercase tracking-widest" suppressHydrationWarning>
                                     {new Date(app.requested_at).toLocaleDateString()}
                                 </td>
                                 <td className="p-6">
                                     <span className={cn(
                                         "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] border transition-all shadow-lg",
                                         app.status === 'ACCEPTED' ? "bg-green-500/10 text-green-400 border-green-500/20 shadow-green-500/5" :
                                         app.status === 'REJECTED' ? "bg-red-500/10 text-red-500 border border-red-500/20 shadow-red-500/5" :
                                         "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 shadow-yellow-500/5"
                                     )}>
                                         {app.status}
                                     </span>
                                 </td>
                                 <td className="p-6 text-right">
                                     {app.status === 'PENDING' && (
                                         <div className="flex items-center justify-end gap-3">
                                             <button 
                                                onClick={() => acceptMutation.mutate({ contestId: selectedContestId!, userId: app.user_id })}
                                                disabled={acceptMutation.isPending || rejectMutation.isPending}
                                                className="p-2.5 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-black rounded-xl transition-all duration-300 disabled:opacity-50 border border-green-500/20 hover:border-green-500"
                                                title="Accept"
                                             >
                                                 <Check size={18} />
                                             </button>
                                             <button 
                                                onClick={() => rejectMutation.mutate({ contestId: selectedContestId!, userId: app.user_id })}
                                                disabled={acceptMutation.isPending || rejectMutation.isPending}
                                                className="p-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-300 disabled:opacity-50 border border-red-500/20 hover:border-red-500"
                                                title="Reject"
                                             >
                                                 <X size={18} />
                                             </button>
                                         </div>
                                     )}
                                     {app.status !== 'PENDING' && (
                                         <span className="text-[10px] font-black uppercase tracking-widest text-white/10 italic">{t("mypage.applications.processed")}</span>
                                     )}
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
         )}
      </div>
    </div>
  );
}
