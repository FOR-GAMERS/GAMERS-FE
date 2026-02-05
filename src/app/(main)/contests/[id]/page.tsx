"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ContestHero from "@/components/contests/detail/ContestHero";
import ContestBody from "@/components/contests/detail/ContestBody";
import ContestApplicationModal from "@/components/contests/detail/ContestApplicationModal";
import { contestService } from "@/services/contest-service";
import { Loader2, AlertCircle } from "lucide-react";
import { ContestStatus } from "@/types/api";
import { useMe } from "@/hooks/use-user";
import { useTranslation } from "react-i18next";
import TeamManagementSection from "@/components/contests/detail/TeamManagementSection";

export default function ContestDetailPage() {
  const { t } = useTranslation();
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

  // User Status (Member + Application)
  const { data: statusResponse, isLoading: isStatusLoading } = useQuery({
      queryKey: ['contest-status', contestId],
      queryFn: () => contestService.getMyContestStatus(contestId),
      enabled: isLoggedIn && !!contestId && !isNaN(contestId),
      retry: false
  });

  const contest = response?.data;
  const userStatus = statusResponse?.data;
  
  // Refined Logic:
  // If is_member is true, we consider them 'ACCEPTED' (Joined)
  // Else if application_status is 'PENDING', they are applying.
  const isMember = userStatus?.is_member || false;
  const applicationStatus = userStatus?.application_status || 'NONE'; 
  const hasJoined = isMember || applicationStatus === 'ACCEPTED'; 

  // Redirect removed as per user request for a manual "Routing Button"
  /*
  useEffect(() => {
    if (hasJoined) {
        router.push(`/contests/${contestId}/dashboard`);
    }
  }, [hasJoined, contestId, router]);
  */

  const getStatusLabel = (status: ContestStatus) => {
    return t(`contestDetail.status.${status}`, status);
  };

  // Mutations
  const applyMutation = useMutation({
      mutationFn: (data?: { point?: number; current_tier?: string; peak_tier?: string }) => contestService.applyContest(contestId, data),
      onSuccess: () => {
          alert(t('contestDetail.alerts.joinSuccess'));
          queryClient.invalidateQueries({ queryKey: ['contest-status', contestId] });
          queryClient.invalidateQueries({ queryKey: ['contest', contestId] });
      },
      onError: (error: any) => {
          alert(error.response?.data?.message || t('contestDetail.alerts.joinFail'));
      }
  });

  const cancelMutation = useMutation({
      mutationFn: () => contestService.cancelApplication(contestId),
      onSuccess: () => {
          alert(t('contestDetail.alerts.cancelSuccess'));
          queryClient.invalidateQueries({ queryKey: ['contest-status', contestId] });
          queryClient.invalidateQueries({ queryKey: ['contest', contestId] });
      },
      onError: (error: any) => {
           alert(error.response?.data?.message || t('contestDetail.alerts.cancelFail'));
      }
  });

  const isLoading = isContestLoading || (isLoggedIn && isStatusLoading);
  const isActionLoading = applyMutation.isPending || cancelMutation.isPending;

  // Modal State
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

  const handleJoin = () => {
    if (!isLoggedIn) {
        router.push('/login');
        return;
    }
    
    if (hasJoined) {
        // User requested Routing Button to Dashboard
        router.push(`/contests/${contestId}/dashboard`);
        return;
    }

    if (applicationStatus === 'PENDING') {
         if (confirm(t('contestDetail.alerts.confirmCancel'))) {
            cancelMutation.mutate();
         }
    } else {
         // NONE or REJECTED
         setIsApplicationModalOpen(true);
    }
  };

  // Determine Button Props
  let buttonLabel = t('contestCTA.button.join');
  let variant: 'primary' | 'destructive' | 'secondary' = 'primary';
  
  if (!isLoggedIn) {
      buttonLabel = t('contestCTA.button.login');
  } else if (hasJoined) {
     // Check if translation key exists, otherwise fallback to "Go to Dashboard"
     // Since I can't verify keys easily, I will use a safe string or reuse 'joined' but meaning 'dashboard' logic
     // Ideally: "Go to Dashboard"
      buttonLabel = t('contestCTA.button.dashboard', 'Go to Dashboard'); 
      variant = 'secondary';
  } else if (applicationStatus === 'PENDING') {
      // User is managing a team or just applied
      buttonLabel = t('contestCTA.button.cancelApplication', 'Cancel Application'); 
      variant = 'destructive';
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
               <p className="text-xl">{t('contestDetail.alerts.loadingFail')}</p>
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
        description={contest.description || t('contestDetail.noInfo')}
        ctaProps={{
            currentParticipants: contest.current_team_count || 0,
            maxParticipants: contest.max_team_count || 0,
            entryFee: 0, 
            prizePool: contest.total_point ? `${contest.total_point.toLocaleString()} PT` : "0 PT",
            labelType: contest.game_point_table_id ? 'pointLimit' : 'prize',
            deadline: contest.ended_at ? new Date(contest.ended_at).toLocaleDateString() : "TBD",
            onJoin: handleJoin,
            isLoggedIn: isLoggedIn,
            buttonLabel: buttonLabel,
            variant: variant,
            isLoading: isActionLoading
        }}
      />
      
      {/* Team Management Section (Only visible when Applied/Creating Team) */}
      {applicationStatus === 'PENDING' && (
          <div className="container mx-auto px-4 pb-12">
            <TeamManagementSection 
                contestId={contestId}
                maxTeamMember={contest.total_team_member}
                maxTotalPoint={contest.total_point} // Assuming total_point is also max_total_point logic or strictly prize? 
                // Wait, field `total_point` is Prize Pool usually. 
                // There is no `max_total_point_limit` in ContestResponse.
                // Re-checking schema: `total_point` is generally prize. 
                // Is there a restriction? The user said "Team 의 총 Point 를 계산해서 ... 최대 Point 이내의 Point 라면".
                // I will assume `total_point` is used as limit OR I need a new field.
                // Looking at `CreateContest` page, `total_point` is input as "Total Points".
                // It likely means "Max Team Point Limit" for participation, OR "Prize Pool".
                // Given the context of "Calculated Points" and "Tier", it sounds like a limit.
                // BUT `prizePool` in CTA uses it too.
                // Let's assume it IS the limit for now.
                // If it's 0, maybe no limit?
                // I will pass it as `maxTotalPoint` if > 0, else Infinity.
                // Actually, let's look at `createContest` page again. "Total Points" label.
                // Usually "Prize Pool".
                // But the user prompt says "Point 가 최대 Point 이내의 Point 라면". Use context.
                // I will just pass `contest.total_point` for now.
             />
          </div>
      )}
      
      <ContestApplicationModal 
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        onConfirm={(data) => {
            applyMutation.mutate(data);
            setIsApplicationModalOpen(false);
        }}
        contestId={contestId}
        scoreTableId={contest.game_point_table_id}
        isApplying={applyMutation.isPending}
      />
    </main>
  );
}
