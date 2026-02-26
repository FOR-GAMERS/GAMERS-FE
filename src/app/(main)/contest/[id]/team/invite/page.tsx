'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { contestService } from '@/services/contest-service';
import { useToast } from '@/context/ToastContext';
import { Loader2, UserPlus, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

export default function TeamInvitePage() {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const router = useRouter();
  const params = useParams();
  const contestId = parseInt(params.id as string, 10);

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  // Fetch Team Info using API to know who is already in the team
  const { data: teamResponse, isLoading: isTeamLoading } = useQuery({
      queryKey: ['contest-team', contestId],
      queryFn: async () => {
          try {
              return await contestService.getTeam(contestId);
          } catch (error: any) {
              if (error.status === 404) return null; // No team found
              throw error;
          }
      },
      retry: false
  });

  const team = teamResponse?.data;
  const existingMemberIds = team?.members?.map(m => m.user_id) || [];

  // Fetch Contest Members to find people to invite
  const { data: membersResponse, isLoading: isMembersLoading } = useQuery({
      queryKey: ['contest-members-invite', contestId, page],
      queryFn: () => contestService.getContestMembers(contestId, { page, page_size: PAGE_SIZE })
  });

  const members = membersResponse?.data?.data || [];
  const totalPages = membersResponse?.data?.total_pages || 1;

  const handleInvite = async (userId: number, username: string) => {
      try {
          await contestService.inviteMember(contestId, userId);
          addToast(t('contestPlayground.memberList.inviteSuccess', { username, defaultValue: `Invited ${username}!` }), 'success');
      } catch (e: any) {
          addToast(e.message || t('contestPlayground.memberList.inviteFail', 'Failed to invite.'), 'error');
      }
  };

  if (isTeamLoading || isMembersLoading) {
      return <div className="min-h-screen flex justify-center items-center"><Loader2 className="animate-spin text-neon-cyan" size={48} /></div>;
  }

  return (
    <div className="min-h-screen bg-deep-black text-white selection:bg-neon-cyan selection:text-deep-black font-sans">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <button 
                onClick={() => router.push(`/contest/${contestId}`)}
                className="mb-8 flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
            >
                <ArrowLeft size={20} />
                {t('common.backToPlayground', 'Back to Playground')}
            </button>

            <div className="p-8 rounded-2xl bg-neutral-900/30 border border-neutral-800 animate-fade-in-up">
                <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3 border-b border-neutral-800 pb-4">
                    <UserPlus className="text-neon-cyan" size={32} />
                    {t('contestPlayground.myTeam.inviteMember', 'Invite Member')}
                </h2>

                <div className="space-y-4">
                    {members.map(member => {
                        const isAlreadyMember = existingMemberIds.includes(member.user_id);
                        const getAvatarSrc = () => {
                            if (member.avatar?.startsWith('http')) return member.avatar;
                            if (member.profile_key && member.avatar) {
                                return `https://cdn.discordapp.com/avatars/${member.profile_key}/${member.avatar}.png`;
                            }
                            return undefined;
                        };
                        const avatarSrc = getAvatarSrc();

                        return (
                            <div key={member.user_id} className="flex items-center justify-between p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-lg font-bold overflow-hidden shadow-lg border border-neutral-700/50">
                                        {avatarSrc ? <Image src={avatarSrc} alt={member.username} fill className="object-cover"/> : member.username.substring(0, 1).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-white mb-1">{member.username}</div>
                                        <div className="text-sm text-neutral-500 font-mono">#{member.tag}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-base font-mono text-neon-cyan">{member.point}{t('contestPlayground.memberList.pt', 'pt')}</div>
                                    <button
                                        onClick={() => handleInvite(member.user_id, member.username)}
                                        disabled={isAlreadyMember}
                                        className="px-6 py-2 text-sm font-bold uppercase tracking-wider rounded-lg bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 hover:bg-neon-cyan hover:text-black hover:shadow-[0_0_15px_rgba(0,243,255,0.4)] disabled:opacity-30 disabled:hover:bg-neon-cyan/10 disabled:hover:text-neon-cyan disabled:hover:shadow-none transition-all"
                                    >
                                        {isAlreadyMember ? t('contestPlayground.myTeam.alreadyJoined', 'Joined') : t('contestPlayground.memberList.invite', 'Invite')}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-6 mt-8 pt-6 border-t border-neutral-800">
                        <button 
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-2 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white disabled:opacity-30 transition-all hover:border-neutral-600"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <span className="text-sm text-neutral-400 font-mono">
                            {t('contestPlayground.memberList.page', 'Page ')} <span className="text-white font-bold">{page}</span> / {totalPages}
                        </span>
                        <button 
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="p-2 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white disabled:opacity-30 transition-all hover:border-neutral-600"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}
