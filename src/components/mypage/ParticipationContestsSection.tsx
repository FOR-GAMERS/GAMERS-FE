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
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
            <span className="w-1.5 h-8 bg-neon-cyan rounded-full shadow-[0_0_15px_rgba(0,243,255,0.6)]"/> 
            {t("mypage.participation.title") || "Joined Tournaments"}
          </h3>
          <span className="text-xs font-black uppercase tracking-widest text-white/40 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            {contests.length} {t("mypage.participation.count") || "Contests"}
          </span>
      </div>

      {contests.length === 0 ? (
          <div className="glass-card border-dashed p-16 text-center space-y-6 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <Trophy className="text-white/10" size={40} />
              </div>
              <div className="space-y-2">
                  <p className="text-white font-black text-xl tracking-tight">{t("mypage.participation.empty") || "No joined tournaments yet"}</p>
                  <p className="text-sm text-white/40 font-medium max-w-xs leading-relaxed">{t("mypage.participation.emptyDesc") || "Join a tournament to start your competitive journey!"}</p>
              </div>
              <Link 
                href="/contests" 
                className="inline-block px-8 py-3 bg-neon-cyan/10 hover:bg-neon-cyan text-neon-cyan hover:text-black border border-neon-cyan/50 rounded-xl text-sm font-black uppercase tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(0,243,255,0.1)] hover:shadow-[0_0_40px_rgba(0,243,255,0.4)]"
              >
                  {t("mypage.participation.findContests") || "Find Tournaments"}
              </Link>
          </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contests.map((contest) => (
                  <Link 
                    key={contest.contest_id} 
                    href={`/contests/${contest.contest_id}`}
                    className="group relative glass-card p-5 hover:translate-y-[-4px] transition-all duration-500 overflow-hidden border border-white/5 hover:border-neon-cyan/40 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
                  >
                      {/* Hover Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/0 via-transparent to-neon-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="relative flex gap-5 z-10">
                          <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-black/40 border border-white/10 group-hover:border-neon-cyan/30 transition-colors">
                              {contest.thumbnail ? (
                                  <Image 
                                    src={contest.thumbnail} 
                                    alt={contest.title} 
                                    fill 
                                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                                  />
                              ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                      <Trophy className="text-white/10 group-hover:text-neon-cyan/30 transition-colors" size={40} />
                                  </div>
                              )}
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div className="space-y-1">
                                  <div className="flex items-start justify-between">
                                      <h4 className="text-white font-black text-lg truncate tracking-tight group-hover:text-neon-cyan transition-colors duration-300">
                                        {contest.title}
                                      </h4>
                                      <ChevronRight size={20} className="text-white/10 group-hover:text-neon-cyan group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                                  </div>
                                  <div className="space-y-1.5 pt-1">
                                      <div className="flex items-center gap-2 text-[11px] font-bold text-white/40 uppercase tracking-wider">
                                          <Calendar size={12} className="text-neon-cyan/60" />
                                          <span>{contest.started_at ? format(new Date(contest.started_at), 'PPP', { locale: currentLocale }) : 'TBD'}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-[11px] font-bold text-white/40 uppercase tracking-wider">
                                          <Users size={12} className="text-neon-cyan/60" />
                                          <span>{contest.current_team_count || 0} / {contest.max_team_count} Teams</span>
                                      </div>
                                  </div>
                              </div>
                              <div className="mt-3 flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "text-[10px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-lg border",
                                        contest.contest_status === 'ACTIVE' ? "bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]" :
                                        contest.contest_status === 'RECRUITING' ? "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20 shadow-[0_0_10px_rgba(0,243,255,0.2)]" :
                                        "bg-white/5 text-white/30 border-white/10"
                                    )}>
                                        {contest.contest_status}
                                    </span>
                                  </div>
                                  <button 
                                    onClick={(e) => handleWithdraw(e, contest.contest_id)}
                                    className="p-2.5 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all duration-300 border border-transparent hover:border-red-500/20"
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
