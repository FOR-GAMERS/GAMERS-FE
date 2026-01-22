"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ContestHero from "@/components/contests/detail/ContestHero";
import ContestBody from "@/components/contests/detail/ContestBody";
import ContestApplicationModal from "@/components/contests/detail/ContestApplicationModal";
import { contestService } from "@/services/contest-service";
import { Loader2, AlertCircle } from "lucide-react";
import { ContestStatus } from "@/types/api";
import { useMe } from "@/hooks/use-user";

const getStatusLabel = (status: ContestStatus) => {
    switch (status) {
        case 'PENDING': return '準備中';
        case 'RECRUITING': return '募集中';
        case 'ACTIVE': return '進行中';
        case 'FINISHED': return '終了';
        case 'CANCELLED': return '中止';
        case 'PREPARING': return '準備中';
        default: return status;
    }
};

export default function ContestDetailPage() {
  const router = useRouter();
  const params = useParams(); 
  const contestId = Number(params?.id);
  const queryClient = useQueryClient();
  
  // Auth & User
  const { data: userResponse, isLoading: isUserLoading } = useMe();
  const isLoggedIn = !!userResponse?.data;

  // Contest Data
  const { data: response, isLoading: isContestLoading, error } = useQuery({
      queryKey: ['contest', contestId],
      queryFn: () => contestService.getContest(contestId),
      enabled: !!contestId && !isNaN(contestId)
  });

  // Application Status
  const { data: appStatusResponse, isLoading: isAppStatusLoading } = useQuery({
      queryKey: ['contest-application', contestId],
      queryFn: () => contestService.getMyApplicationStatus(contestId),
      enabled: isLoggedIn && !!contestId && !isNaN(contestId),
      retry: false
  });

  const contest = response?.data;
  const applicationStatus = appStatusResponse?.data?.status || 'NONE'; 

  // Mutations
  const applyMutation = useMutation({
      mutationFn: () => contestService.applyContest(contestId),
      onSuccess: () => {
          alert('参加申請が完了しました。');
          queryClient.invalidateQueries({ queryKey: ['contest-application', contestId] });
          queryClient.invalidateQueries({ queryKey: ['contest', contestId] });
      },
      onError: (error: any) => {
          alert(error.response?.data?.message || '参加申請に失敗しました。');
      }
  });

  const cancelMutation = useMutation({
      mutationFn: () => contestService.cancelApplication(contestId),
      onSuccess: () => {
          alert('申請をキャンセルしました。');
          queryClient.invalidateQueries({ queryKey: ['contest-application', contestId] });
          queryClient.invalidateQueries({ queryKey: ['contest', contestId] });
      },
      onError: (error: any) => {
           alert(error.response?.data?.message || 'キャンセルに失敗しました。');
      }
  });

  const isLoading = isContestLoading || (isLoggedIn && isAppStatusLoading);
  const isActionLoading = applyMutation.isPending || cancelMutation.isPending;

  // Modal State
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

  const handleJoin = () => {
    if (!isLoggedIn) {
        if (confirm("ログインが必要です。ログインページへ移動しますか？")) {
             router.push('/login');
        }
        return;
    }
    
    if (applicationStatus === 'NONE' || applicationStatus === 'REJECTED') {
         setIsApplicationModalOpen(true);
    } else if (applicationStatus === 'PENDING') {
         if (confirm("参加申請をキャンセルしますか？")) {
            cancelMutation.mutate();
         }
    } else if (applicationStatus === 'ACCEPTED') {
         alert("既に参加が確定しています。");
    }
  };

  // Determine Button Props
  let buttonLabel = "参加申請する";
  let variant: 'primary' | 'destructive' | 'secondary' = 'primary';
  
  if (applicationStatus === 'PENDING') {
      buttonLabel = "申請キャンセル";
      variant = 'destructive';
  } else if (applicationStatus === 'ACCEPTED') {
      buttonLabel = "参加確定済み";
      variant = 'secondary';
  }

  if (isLoading) {
      return (
          <div className="min-h-screen bg-deep-black flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-neon-cyan animate-spin" />
          </div>
      );
  }

  if (error || !contest) {
      return (
          <div className="min-h-screen bg-deep-black flex flex-col items-center justify-center text-white gap-4">
               <AlertCircle className="w-12 h-12 text-red-500" />
               <p className="text-xl">大会情報の読み込みに失敗しました。</p>
          </div>
      );
  }

  return (
    <main className="min-h-screen bg-deep-black text-white pb-32">
      <ContestHero 
        title={contest.title}
        thumbnailUrl={contest.thumbnail || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2940&auto=format&fit=crop"} 
        status={getStatusLabel(contest.contest_status)}
        gameType={contest.game_type || "GAME"}
      />

      <ContestBody 
        description={contest.description || "詳細情報はありません。"}
        ctaProps={{
            currentParticipants: contest.current_team_count || 0,
            maxParticipants: contest.max_team_count || 0,
            entryFee: 0, 
            prizePool: contest.total_point ? `${contest.total_point.toLocaleString()} PT` : "0 PT",
            deadline: contest.ended_at ? new Date(contest.ended_at).toLocaleDateString() : "TBD",
            onJoin: handleJoin,
            isLoggedIn: isLoggedIn,
            buttonLabel: buttonLabel,
            variant: variant,
            isLoading: isActionLoading
        }}
      />
      
      <ContestApplicationModal 
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        onConfirm={() => {
            applyMutation.mutate();
            setIsApplicationModalOpen(false);
        }}
        contestId={contestId}
        scoreTableId={contest.game_point_table_id}
        isApplying={applyMutation.isPending}
      />
    </main>
  );
}
