"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contestService } from "@/services/contest-service";
import { Loader2, UserPlus, Users, Trash2, Trophy, AlertCircle, CheckCircle2, Search, X } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/utils";
import { useMe } from "@/hooks/use-user";
import { useEffect } from "react";

interface TeamManagementSectionProps {
    contestId: number;
    maxTeamMember: number;
    maxTotalPoint: number;
    onReadyChange?: (isReady: boolean) => void;
}


function MemberInvitationList({ contestId, existingMemberIds, maxTeamMember }: { contestId: number, existingMemberIds: number[], maxTeamMember: number }) {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 5;

    const { data: membersResponse, isLoading } = useQuery({
        queryKey: ['contest-members-invite', contestId, page],
        queryFn: () => contestService.getContestMembers(contestId, { page, page_size: PAGE_SIZE })
    });

    const members = membersResponse?.data?.data || [];
    const totalPages = membersResponse?.data?.total_pages || 1;

    const inviteMutation = useMutation({
        mutationFn: (userId: number) => contestService.inviteMember(contestId, userId),
        onSuccess: () => {
             addToast(t('teamManagement.toast.inviteSuccess'), "success");
        },
        onError: (err: any) => {
             addToast(err.response?.data?.message || t('teamManagement.toast.inviteFail'), "error");
        }
    });

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-neon-cyan" /></div>;
    }

    return (
        <div className="space-y-4 animate-fade-in-up">
            <h4 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <UserPlus className="text-neon-cyan" size={20} />
                {t('teamManagement.inviteTitle')}
            </h4>
            
            <div className="space-y-2">
                {members.length === 0 ? (
                    <div className="text-center text-muted-foreground py-4">No members found.</div>
                ) : (
                    members.map((member) => {
                        const isAlreadyMember = existingMemberIds.includes(member.user_id);
                        const isMe = false; // Could check if me, but usually I shouldn't invite myself if I am creating the team
                        
                        return (
                            <div key={member.user_id} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-colors">
                                <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-full bg-neutral-800 overflow-hidden relative flex items-center justify-center">
                                          {member.avatar ? (
                                              <Image src={member.avatar} alt={member.username} fill sizes="32px" className="object-cover" />
                                          ) : (
                                              <span className="text-xs font-bold text-white/50">{member.username.substring(0,1).toUpperCase()}</span>
                                          )}
                                     </div>
                                     <div>
                                         <div className="text-sm font-bold text-white">{member.username}</div>
                                         <div className="text-xs text-muted-foreground">#{member.tag}</div>
                                     </div>
                                </div>
                                <div className="flex items-center gap-4">
                                     <span className="text-xs font-mono text-neon-purple font-bold">{member.point} PT</span>
                                     <button
                                        onClick={() => inviteMutation.mutate(member.user_id)}
                                        disabled={isAlreadyMember || inviteMutation.isPending}
                                        className="px-3 py-1.5 text-xs bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 rounded-lg hover:bg-neon-cyan hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all font-bold"
                                     >
                                         {inviteMutation.isPending ? <Loader2 size={12} className="animate-spin" /> : (isAlreadyMember ? t('teamManagement.joined') : t('teamManagement.inviteAction'))}
                                     </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 pt-2">
                    <button 
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-1.5 rounded border border-white/10 text-white/50 hover:text-white disabled:opacity-30"
                    >
                        Prev
                    </button>
                     <span className="text-xs text-muted-foreground">Page {page} / {totalPages}</span>
                    <button 
                         onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                         disabled={page === totalPages}
                         className="p-1.5 rounded border border-white/10 text-white/50 hover:text-white disabled:opacity-30"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default function TeamManagementSection({ 
    contestId, 
    maxTeamMember, 
    maxTotalPoint,
    onReadyChange 
}: TeamManagementSectionProps) {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const queryClient = useQueryClient();

    // Get My User ID
    const { data: userResponse } = useMe();
    
    // --- Team Data Logic ---
    const { data: teamResponse, isLoading: isTeamLoading, refetch: refetchTeam } = useQuery({
        queryKey: ['contest-team', contestId],
        queryFn: async () => {
            try {
                return await contestService.getTeam(contestId);
            } catch (error: any) {
                if (error.status === 404) return null;
                throw error;
            }
        },
        retry: false
    });

    const team = teamResponse?.data;
    const members = team?.members || [];
    const isTeamCreated = !!team;
    const existingMemberIds = members.map((m: any) => m.user_id);

    // --- Mutations ---
    const createTeamMutation = useMutation({
        mutationFn: () => contestService.createTeam(contestId),
        onSuccess: () => {
            addToast(t('teamManagement.toast.createSuccess'), "success");
            refetchTeam();
        },
        onError: (err: any) => {
            addToast(err.response?.data?.message || t('teamManagement.toast.createFail'), "error");
        }
    });

    const deleteTeamMutation = useMutation({
        mutationFn: () => contestService.deleteTeam(contestId),
        onSuccess: () => {
            addToast(t('teamManagement.toast.deleteSuccess'), "success");
            refetchTeam(); 
        },
        onError: (err: any) => {
            addToast(err.response?.data?.message || t('teamManagement.toast.deleteFail'), "error");
        }
    });

    // --- Derived State ---
    const totalCurrentPoint = members.reduce((sum, m: any) => sum + (m.point || 0), 0); 
    
    const isTeamFull = members.length >= maxTeamMember;
    const isPointValid = totalCurrentPoint <= maxTotalPoint;
    const isReady = isTeamFull && isPointValid;
    
    // Notify parent about readiness (optional, if used)
    useEffect(() => {
        if (onReadyChange) {
            onReadyChange(isReady);
        }
    }, [isReady, onReadyChange]);

    return (
        <div className="space-y-8 pt-12 border-t border-white/10">
             <div className="flex items-center justify-between">
                 <h3 className="text-xl font-bold text-white flex items-center gap-2">
                     <Users className="text-neon-cyan" size={24} />
                     {t('teamManagement.title')}
                 </h3>
                 <div className="flex items-center gap-4 text-sm font-mono">
                     <div className={cn("px-3 py-1 rounded bg-white/5 border border-white/10", members.length >= maxTeamMember ? "text-green-500 border-green-500/50" : "text-white")}>
                         {members.length} / {maxTeamMember} {t('teamManagement.members')}
                     </div>
                     <div className={cn("px-3 py-1 rounded bg-white/5 border border-white/10", totalCurrentPoint > maxTotalPoint ? "text-red-500 border-red-500/50" : "text-neon-purple border-neon-purple/50")}>
                         {totalCurrentPoint} / {maxTotalPoint} {t('teamManagement.points')}
                     </div>
                 </div>
             </div>
             
             {/* Create Team State */}
             {!isTeamCreated && (
                 <div className="flex flex-col items-center justify-center py-12 bg-white/5 rounded-xl border border-dashed border-white/20">
                     <Users className="text-white/20 mb-4" size={48} />
                     <h4 className="text-lg font-bold text-white mb-2">{t('teamManagement.noTeamTitle')}</h4>
                     <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
                         {t('teamManagement.noTeamDescription')}
                     </p>
                     <button
                        onClick={() => createTeamMutation.mutate()}
                        disabled={createTeamMutation.isPending}
                        className="px-6 py-2 bg-neon-cyan text-black font-bold rounded-lg hover:bg-neon-cyan/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                     >
                         {createTeamMutation.isPending ? <Loader2 className="animate-spin" /> : <UserPlus size={18} />}
                         {t('teamManagement.createTeam')}
                     </button>
                 </div>
             )}

             {/* Member List & Invitation - Only show if team exists */}
             {isTeamCreated && (
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     {/* LEFT: Current Team Members */}
                     <div className="space-y-4">
                         <h4 className="text-lg font-bold text-white mb-4">Current Team</h4>
                         <div className="space-y-2">
                             {members.map((member: any) => (
                                 <div key={member.user_id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                                     <div className="flex items-center gap-3">
                                         <div className="w-10 h-10 rounded-full bg-neutral-800 overflow-hidden relative flex items-center justify-center">
                                              {member.avatar ? (
                                                  <Image src={member.avatar} alt={member.username} fill sizes="40px" className="object-cover" />
                                              ) : (
                                                  <span className="text-xs font-bold text-white/50">{member.username.substring(0,2).toUpperCase()}</span>
                                              )}
                                         </div>
                                         <div>
                                             <div className="font-bold text-white text-sm">{member.username}</div>
                                             <div className="text-xs text-muted-foreground">#{member.tag}</div>
                                         </div>
                                     </div>
                                     <div className="flex items-center gap-3">
                                         <span className="text-neon-purple font-mono font-bold text-sm">
                                             {member.point || '?'} PT
                                         </span>
                                     </div>
                                 </div>
                             ))}
                             
                             {/* Empty Slots Indicator */}
                             {Array.from({ length: Math.max(0, maxTeamMember - members.length) }).map((_, i) => (
                                <div key={i} className="p-4 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-white/20 text-sm font-bold">
                                    Empty Slot
                                </div>
                             ))}
                         </div>
                         
                         <div className="pt-4 flex justify-end">
                             <button 
                                onClick={() => {
                                    if (confirm(t('teamManagement.confirmDelete'))) {
                                        deleteTeamMutation.mutate();
                                    }
                                }}
                                className="text-xs text-red-500 hover:text-red-400 flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity"
                             >
                                 <Trash2 size={14} />
                                 {t('teamManagement.deleteTeam')}
                             </button>
                         </div>
                     </div>

                     {/* RIGHT: Invitation List */}
                     <div className="bg-neutral-900/30 rounded-xl border border-white/5 p-6 h-fit">
                        {members.length < maxTeamMember ? (
                            <MemberInvitationList 
                                contestId={contestId} 
                                existingMemberIds={existingMemberIds} 
                                maxTeamMember={maxTeamMember} 
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                                <CheckCircle2 size={48} className="text-green-500 mb-4" />
                                <p>Team is full!</p>
                            </div>
                        )}
                     </div>
                 </div>
             )}
        </div>
    );
}
