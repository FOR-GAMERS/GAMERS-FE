'use client';

import { useMyContests, useContestMutations } from '@/hooks/use-contests';
import { Loader2, Calendar, Users, Trophy, ChevronRight, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { ko, enUS, ja } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';

export default function ParticipationContestsSection() {
  const { t, i18n } = useTranslation();
  const { data: contestsResponse, isLoading } = useMyContests({ page_size: 10 });
  const { withdrawContest } = useContestMutations();
  const { addToast } = useToast();

  const locales: Record<string, any> = { ko, en: enUS, ja };
  const currentLocale = locales[i18n.language] || ko;

  const contests = contestsResponse?.data?.data || [];

  const handleWithdraw = async (e: React.MouseEvent, contestId: number) => {
    e.preventDefault();
    if (!confirm(t("mypage.participation.confirmWithdraw") || "Are you sure you want to withdraw from this tournament?")) return;
    
    try {
      await withdrawContest.mutateAsync(contestId);
      addToast(t("mypage.participation.toast.withdrawn") || "Withdrawn from tournament", 'success');
    } catch (error: any) {
      addToast(error.message || t("mypage.participation.toast.failed") || "Failed to withdraw", 'error');
    }
  };

  if (isLoading) {
    return (
        <div className="p-12 flex justify-center bg-deep-black/50 border border-white/10 rounded-2xl">
            <Loader2 className="animate-spin text-neon-cyan" />
        </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-neon-cyan rounded-full"/> 
            {t("mypage.participation.title") || "Joined Tournaments"}
          </h3>
          <span className="text-sm text-muted-foreground">{contests.length} {t("mypage.participation.count") || "Contests"}</span>
      </div>

      {contests.length === 0 ? (
          <div className="bg-deep-black/50 border border-white/10 border-dashed rounded-2xl p-12 text-center space-y-4">
              <Trophy className="mx-auto text-white/10" size={48} />
              <div className="space-y-1">
                  <p className="text-white font-medium">{t("mypage.participation.empty") || "No joined tournaments yet"}</p>
                  <p className="text-sm text-muted-foreground">{t("mypage.participation.emptyDesc") || "Join a tournament to start your competitive journey!"}</p>
              </div>
              <Link 
                href="/contests" 
                className="inline-block px-6 py-2 bg-neon-cyan/20 hover:bg-neon-cyan/30 border border-neon-cyan/50 rounded-xl text-neon-cyan text-sm font-bold transition-all"
              >
                  {t("mypage.participation.findContests") || "Find Tournaments"}
              </Link>
          </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contests.map((contest) => (
                  <Link 
                    key={contest.contest_id} 
                    href={`/contests/${contest.contest_id}`}
                    className="group bg-deep-black/50 border border-white/10 rounded-2xl p-4 hover:border-neon-cyan/50 hover:bg-neon-cyan/5 transition-all relative overflow-hidden"
                  >
                      <div className="flex gap-4">
                          <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-white/5 border border-white/10">
                              {contest.thumbnail ? (
                                  <Image 
                                    src={contest.thumbnail} 
                                    alt={contest.title} 
                                    fill 
                                    className="object-cover group-hover:scale-110 transition-transform duration-500" 
                                  />
                              ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                      <Trophy className="text-white/20" size={32} />
                                  </div>
                              )}
                          </div>
                          <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                  <h4 className="text-white font-bold truncate pr-8">{contest.title}</h4>
                                  <div className="absolute right-4 top-4">
                                      <ChevronRight size={18} className="text-white/20 group-hover:text-neon-cyan group-hover:translate-x-1 transition-all" />
                                  </div>
                              </div>
                              <div className="mt-2 space-y-1">
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <Calendar size={12} />
                                      <span>{contest.started_at ? format(new Date(contest.started_at), 'PPP', { locale: currentLocale }) : 'TBD'}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <Users size={12} />
                                      <span>{contest.current_team_count || 0} / {contest.max_team_count} Teams</span>
                                  </div>
                              </div>
                              <div className="mt-3 flex items-center justify-between">
                                  <span className={cn(
                                      "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded",
                                      contest.contest_status === 'ACTIVE' ? "bg-green-500/20 text-green-500" :
                                      contest.contest_status === 'RECRUITING' ? "bg-blue-500/20 text-blue-500" :
                                      "bg-white/10 text-white/50"
                                  )}>
                                      {contest.contest_status}
                                  </span>
                                  <button 
                                    onClick={(e) => handleWithdraw(e, contest.contest_id)}
                                    className="p-2 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                    title={t("mypage.participation.withdraw") || "Withdraw"}
                                  >
                                      <LogOut size={16} />
                                  </button>
                              </div>
                          </div>
                      </div>
                  </Link>
              ))}
          </div>
      )}
    </div>
  );
}
