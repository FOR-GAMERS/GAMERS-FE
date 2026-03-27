"use client";

import { useQuery } from "@tanstack/react-query";
import { contestService } from "@/services/contest-service";
import { Loader2, Trophy, ArrowRight, Settings } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function ManagedContestsSection() {
  const { t } = useTranslation();

  const { data: contestsResponse, isLoading } = useQuery({
    queryKey: ["my-contests"],
    queryFn: () => contestService.getMyContests({ page: 1, page_size: 100, sort_by: "created_at", order: "desc" }),
  });

  const contests = contestsResponse?.data?.data || [];

  if (isLoading) {
    return (
        <div className="flex justify-center p-8">
            <Loader2 className="w-8 h-8 text-neon-cyan animate-spin" />
        </div>
    );
  }

  if (contests.length === 0) {
    return null; // Or show empty state, but ReceivedApplications might show empty too, so maybe just hide
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="px-2">
            <h3 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
                <span className="w-1.5 h-8 bg-neon-cyan rounded-full shadow-[0_0_15px_rgba(0,243,255,0.6)]"/> 
                {t('mypage.managed.title')}
            </h3>
            <p className="text-white/40 text-xs font-black uppercase tracking-widest mt-2 ml-4">
                {t('mypage.managed.description')}
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contests.map((contest) => {
                const contestId = contest.contest_id || (contest as any).id;
                return (
                <div key={contestId} className="group relative glass-card p-0 overflow-hidden hover:translate-y-[-4px] transition-all duration-500 border border-white/5 hover:border-neon-cyan/40 flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/0 via-transparent to-neon-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="p-6 flex-1 relative z-10">
                        <div className="flex items-start justify-between mb-6">
                            <div className="w-12 h-12 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan group-hover:scale-110 transition-transform duration-300">
                                <Trophy size={24} />
                            </div>
                            <span className="px-3 py-1 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 text-[10px] font-black uppercase tracking-widest text-neon-cyan shadow-[0_0_10px_rgba(0,243,255,0.2)]">
                                {contest.contest_status}
                            </span>
                        </div>
                        <Link href={`/contests/${contestId}`} className="block group/title">
                            <h4 className="font-black text-white text-xl mb-1 line-clamp-1 group-hover/title:text-neon-cyan transition-colors tracking-tight">
                                {contest.title}
                            </h4>
                        </Link>
                        <div className="text-[10px] font-black uppercase tracking-widest text-white/20 mt-2 flex items-center gap-2">
                            <span className="w-1 h-1 bg-white/20 rounded-full" />
                            Created {new Date(contest.created_at).toLocaleDateString()}
                        </div>
                    </div>
                    
                    <div className="p-5 border-t border-white/5 bg-white/[0.02] relative z-10">
                        <Link 
                            href={`/contests/${contestId}/dashboard`}
                            className="flex items-center justify-center gap-2 w-full py-3 bg-neon-cyan/10 hover:bg-neon-cyan text-neon-cyan hover:text-black rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_0_20px_rgba(0,243,255,0.1)] hover:shadow-[0_0_40px_rgba(0,243,255,0.4)] border border-neon-cyan/20 hover:border-neon-cyan"
                        >
                            <Settings size={16} />
                            {t('mypage.managed.button')}
                        </Link>
                    </div>
                </div>
                );
            })}
        </div>
    </div>
  );
}
