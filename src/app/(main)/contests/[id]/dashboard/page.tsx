"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ContestDashboard } from "@/components/contest/dashboard/ContestDashboard";
import { contestService } from "@/services/contest-service";
import { Loader2, ShieldAlert } from "lucide-react";

export default function ContestDashboardPage() {
  const router = useRouter();
  const params = useParams();
  const contestId = parseInt(params.id as string);
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await contestService.getMyContestStatus(contestId);
        const { is_leader, member_type, is_member } = res.data;
        
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
              <h1 className="text-2xl font-bold">Access Denied</h1>
              <p className="text-neutral-400">You do not have permission to manage this contest.</p>
              <button 
                onClick={() => router.push(`/contests/${contestId}`)}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-bold transition-colors"
              >
                  Return to Contest
              </button>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-deep-black text-white p-4 md:p-8 pt-24 max-w-7xl mx-auto">
        <header className="mb-8">
            <h1 className="text-3xl font-black italic tracking-tighter text-white mb-2">
                CONTEST <span className="text-neon-cyan">DASHBOARD</span>
            </h1>
            <p className="text-neutral-400">Manage participants, bracket, and contest status.</p>
        </header>

        <ContestDashboard contestId={contestId} />
    </div>
  );
}
