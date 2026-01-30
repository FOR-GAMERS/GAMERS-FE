"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ContestDashboard } from "@/components/contest/dashboard/ContestDashboard";
import { contestService } from "@/services/contest-service";
import { Loader2, ShieldAlert } from "lucide-react";

import { useTranslation } from "react-i18next";

export default function ContestDashboardPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const contestId = parseInt(params.id as string);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [isLeader, setIsLeader] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await contestService.getMyContestStatus(contestId);
        const { is_leader, member_type, is_member } = res.data;
        
        setIsLeader(!!is_leader); // safely cast to boolean

        if (is_leader || is_member || member_type === 'STAFF') {
            setAuthorized(true);
        } else {
            setAuthorized(false);
            // Optionally redirect immediately
            // router.push(`/contests/${contestId}`);
        }
      } catch (error) {
          console.error("Auth check failed", error);
          setAuthorized(false);
      }
    };
    checkAuth();
  }, [contestId]);

  if (authorized === null) {
      return (
          <div className="flex min-h-screen items-center justify-center bg-deep-black">
              <Loader2 className="w-10 h-10 text-neon-cyan animate-spin" />
          </div>
      );
  }

  if (!authorized) {
      return (
          <div className="flex min-h-screen flex-col items-center justify-center bg-deep-black text-white gap-4">
              <ShieldAlert className="w-16 h-16 text-red-500" />
              <h1 className="text-2xl font-bold">{t('contestDashboard.page.accessDenied')}</h1>
              <p className="text-neutral-400">{t('contestDashboard.page.permissionDenied')}</p>
              <button 
                onClick={() => router.push(`/contests/${contestId}`)}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-bold transition-colors"
              >
                  {t('contestDashboard.page.returnToContest')}
              </button>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-deep-black text-white p-4 md:p-8 pt-24 max-w-7xl mx-auto">
        <header className="mb-8 border-b border-white/10 pb-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-1.5 h-8 bg-neon-cyan rounded-full shadow-[0_0_10px_rgba(0,243,255,0.5)]" />
                <h1 className="text-3xl font-bold tracking-tight text-white">
                    {t('contestDashboard.page.title')} <span className="text-neon-cyan font-light">{t('contestDashboard.page.dashboard')}</span>
                </h1>
            </div>
            <p className="text-neutral-400 pl-5">{t('contestDashboard.page.subtitle')}</p>
        </header>

        <ContestDashboard contestId={contestId} isLeader={isLeader} />
    </div>
  );
}
