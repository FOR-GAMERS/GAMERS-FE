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
    <div className="space-y-6">
        <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-neon-cyan rounded-full"/> 
                {t('mypage.managed.title')}
            </h3>
            <p className="text-muted-foreground text-sm mt-1 ml-3">
                {t('mypage.managed.description')}
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contests.map((contest) => {
                const contestId = contest.contest_id || (contest as any).id;
                return (
                <div key={contestId} className="bg-neutral-900/50 border border-white/10 rounded-xl overflow-hidden hover:border-neon-cyan/50 transition-all group flex flex-col">
                    <div className="p-5 flex-1">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center text-neon-cyan">
                                <Trophy size={20} />
                            </div>
                            <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono text-neutral-400">
                                {contest.contest_status}
                            </span>
                        </div>
                        <Link href={`/contests/${contestId}`} className="hover:underline">
                            <h4 className="font-bold text-white text-lg mb-1 line-clamp-1">{contest.title}</h4>
                        </Link>
                        <div className="text-xs text-neutral-500 mb-4">
                            Created {new Date(contest.created_at).toLocaleDateString()}
                        </div>
                    </div>
                    
                    <div className="p-4 border-t border-white/5 bg-white/[0.02]">
                        <Link 
                            href={`/contests/${contestId}/dashboard`}
                            className="flex items-center justify-center gap-2 w-full py-2 bg-white/5 hover:bg-neon-cyan hover:text-black rounded-lg text-sm font-bold transition-all text-white"
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
