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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
         <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-neon-cyan rounded-full"/> 
                {t("mypage.applications.title")}
            </h3>
            <p className="text-muted-foreground text-sm mt-1 ml-3">
                {t("mypage.applications.description")}
            </p>
         </div>
         
         
         {/* Contest Selector - Only show if not fixed contestId */}
         {!contestId && (
         <div className="relative w-full md:w-72">
             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                <Trophy size={16} />
             </div>
             <select 
                value={selectedContestId || ""}
                onChange={(e) => setSelectedContestId(Number(e.target.value))}
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm appearance-none outline-none focus:border-neon-cyan transition-colors text-white cursor-pointer"
             >
                {contests.map((contest) => (
                    <option key={contest.contest_id} value={contest.contest_id}>
                        {contest.title}
                    </option>
                ))}
             </select>
             <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
         </div>
         )}
      </div>

      {/* Selected Contest Info Summary (Optional) */}
      {selectedContest && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-wrap gap-6 text-sm items-center">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar size={14} />
                <span suppressHydrationWarning>{t("mypage.applications.created")}: {new Date(selectedContest.created_at).toLocaleDateString()}</span>
            </div>
             <div className="flex items-center gap-2 text-muted-foreground">
                <Users size={14} />
                <span>{t("mypage.applications.currentTeams")}: <span className="text-white font-bold">{selectedContest.current_team_count || 0}</span> / {selectedContest.max_team_count}</span>
            </div>
            <div className="ml-auto">
                <Link href={`/contests/${selectedContest.contest_id}`} className="text-neon-cyan hover:underline text-xs font-bold flex items-center gap-1">
                    {t('contestDetail.cta.goToDashboard')} <ArrowRight size={12} />
                </Link>
            </div>
        </div>
      )}

      {/* Applications Table */}
      <div className="w-full bg-deep-black/50 border border-white/10 rounded-2xl overflow-hidden">
         {isAppsLoading ? (
             <div className="flex justify-center p-12">
                 <Loader2 className="w-8 h-8 text-neon-cyan animate-spin" />
             </div>
         ) : applications.length === 0 ? (
             <div className="text-center py-16">
                 <Users className="w-10 h-10 text-white/20 mx-auto mb-4" />
                 <p className="text-muted-foreground">{t("mypage.applications.noApps")}</p>
             </div>
         ) : (
             <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                     <thead>
                         <tr className="border-b border-white/10 bg-white/5">
                             <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("mypage.applications.applicant")}</th>
                             <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("mypage.applications.tag")}</th>
                             <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("mypage.applications.appliedAt")}</th>
                             <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("mypage.applications.status")}</th>
                             <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">{t("mypage.applications.actions")}</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                         {applications.map((app) => (
                             <tr key={app.user_id} className="group hover:bg-white/5 transition-colors">
                                 <td className="p-4">
                                     <div className="flex items-center gap-3">
                                         <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center font-bold text-xs text-white overflow-hidden relative">
                                             {app.sender.avatar ? (
                                                 <Image src={app.sender.avatar} alt={app.sender.username} fill sizes="32px" className="object-cover" />
                                             ) : (
                                                 (app.sender.username || "?").substring(0, 2).toUpperCase()
                                             )}
                                         </div>
                                         <span className="font-medium text-white">{app.sender.username || t("mypage.applications.unknownUser")}</span>
                                     </div>
                                 </td>
                                 <td className="p-4 text-sm text-muted-foreground">#{app.sender.tag}</td>
                                 <td className="p-4 text-sm text-muted-foreground" suppressHydrationWarning>
                                     {new Date(app.requested_at).toLocaleDateString()}
                                 </td>
                                 <td className="p-4">
                                     <span className={cn(
                                         "px-2 py-1 rounded text-xs font-bold uppercase tracking-wider",
                                         app.status === 'ACCEPTED' ? "bg-green-500/10 text-green-500 border border-green-500/20" :
                                         app.status === 'REJECTED' ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                                         "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                                     )}>
                                         {app.status}
                                     </span>
                                 </td>
                                 <td className="p-4 text-right">
                                     {app.status === 'PENDING' && (
                                         <div className="flex items-center justify-end gap-2">
                                             <button 
                                                onClick={() => acceptMutation.mutate({ contestId: selectedContestId!, userId: app.user_id })}
                                                disabled={acceptMutation.isPending || rejectMutation.isPending}
                                                className="p-1.5 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-black rounded-lg transition-colors disabled:opacity-50"
                                                title="Accept"
                                             >
                                                 <Check size={16} />
                                             </button>
                                             <button 
                                                onClick={() => rejectMutation.mutate({ contestId: selectedContestId!, userId: app.user_id })}
                                                disabled={acceptMutation.isPending || rejectMutation.isPending}
                                                className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors disabled:opacity-50"
                                                title="Reject"
                                             >
                                                 <X size={16} />
                                             </button>
                                         </div>
                                     )}
                                     {app.status !== 'PENDING' && (
                                         <span className="text-xs text-muted-foreground italic">{t("mypage.applications.processed")}</span>
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
