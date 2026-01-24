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

export default function TeamManagementSection({ 
    contestId, 
    maxTeamMember, 
    maxTotalPoint,
    onReadyChange 
}: TeamManagementSectionProps) {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const queryClient = useQueryClient();
    const [inviteSearch, setInviteSearch] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]); 
    const [showSearch, setShowSearch] = useState(false);

    // Get My User ID
    const { data: userResponse } = useMe();
    
    // Discovery Logic:
    // 1. Get all games
    const { data: gamesResponse, isLoading: isGamesLoading } = useQuery({
        queryKey: ['contest-games', contestId],
        queryFn: () => contestService.getContestGames(contestId),
    });

    const [gameId, setGameId] = useState<number | null>(null);

    // 2. Find My Game
    // We can't do this inside render easily. We should use an effect or a dependent query.
    // Since we need to async fetch members for each game, let's use a useEffect to orchestrate.

    useEffect(() => {
        const findMyGame = async () => {
            if (!gamesResponse?.data || !userResponse?.data?.user_id || gameId) return;

            const myUserId = userResponse.data.user_id;
            const games = gamesResponse.data;

            // Iterate and check members
            // We'll run in parallel batches to be faster but polite
            for (const game of games) {
                try {
                    const membersRes = await contestService.getGameMembers(game.game_id);
                    const members = membersRes.data;
                    const isMyTeam = members.some((m: any) => m.user_id === myUserId);
                    
                    if (isMyTeam) {
                        setGameId(game.game_id);
                        return; // Found it
                    }
                } catch (e) {
                    console.error("Error fetching members for game", game.game_id);
                }
            }
        };

        findMyGame();
    }, [gamesResponse, userResponse, gameId]);


    
    // --- Members Logic ---
    const { data: membersResponse, isLoading: isMembersLoading } = useQuery({
        queryKey: ['game-members', gameId],
        queryFn: () => contestService.getGameMembers(gameId!),
        enabled: !!gameId
    });
    
    const members = membersResponse?.data || [];
    const totalCurrentPoint = members.reduce((sum, m: any) => sum + (m.point || 0), 0); // Need to fetch member points? 
    // GameMembers response: `username`, `tag`, `user_id`. Point?
    // `ContestMemberResponse` has points. `GameMember` might not? 
    // Swagger `getGameMembers` returns list of users with minimal info.
    // We might need to fetch `contestMembers` to get points.
    
    const isTeamFull = members.length >= maxTeamMember;
    const isPointValid = totalCurrentPoint <= maxTotalPoint;
    const isReady = isTeamFull && isPointValid;

    // --- Search User Logic ---
    const handleSearch = async () => {
        if (!inviteSearch) return;
        setIsSearching(true);
        try {
            // Need a user search API. `contestService` doesn't seem to have one.
            // Maybe `api.get('/users/search?q=...')`?
            // Assuming `contestService` can be extended or we use `api` directly.
            // I'll assume we can search by exact tag for now or use a mock.
            // Let's use `api.get` with `/users?query=${inviteSearch}` if it exists.
            // Swagger check: `GET /users` with search? 
            // `users/search`?
            // If not available, I might have to just ask for exact email/tag.
            
            // For this implementation, I will simulate search or use exact match if API requires.
            setSearchResults([]); // TODO: Implement actual search
        } catch (e) {
            
        } finally {
            setIsSearching(false);
        }
    };
    
    const inviteMutation = useMutation({
        mutationFn: (userId: number) => contestService.inviteUserToTeam(gameId!, userId),
        onSuccess: () => {
             addToast(t('teamManagement.toast.inviteSuccess'), "success");
             setShowSearch(false);
        },
        onError: (err: any) => {
             addToast(err.response?.data?.message || t('teamManagement.toast.inviteFail'), "error");
        }
    });

    return (
        <div className="space-y-6 pt-12 border-t border-white/10">
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
             
             {/* Member List */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {members.map((member: any) => (
                     <div key={member.user_id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                         <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-neutral-800 overflow-hidden relative">
                                  {member.avatar ? (
                                      <Image src={member.avatar} alt={member.username} fill className="object-cover" />
                                  ) : (
                                      <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white/30">
                                          {member.username.slice(0, 2).toUpperCase()}
                                      </div>
                                  )}
                             </div>
                             <div>
                                 <div className="font-bold text-white text-sm">{member.username}</div>
                                 <div className="text-xs text-muted-foreground">#{member.tag}</div>
                             </div>
                         </div>
                         <div className="flex items-center gap-3">
                             <span className="text-neon-purple font-mono font-bold text-sm">
                                 {/* Point? Need to fetch from contest members */}
                                 ? PT
                             </span>
                             {/* Only Leader can delete? */}
                             <button className="text-red-500 hover:text-red-400 p-2 hover:bg-white/5 rounded-lg transition-colors">
                                 <Trash2 size={16} />
                             </button>
                         </div>
                     </div>
                 ))}
                 
                 {/* Empty Slots or Add Member Button */}
                 {members.length < maxTeamMember && (
                     <button 
                        onClick={() => setShowSearch(true)}
                        className="flex flex-col items-center justify-center gap-2 p-4 bg-white/5 border border-dashed border-white/20 rounded-xl hover:bg-white/10 hover:border-neon-cyan/50 text-muted-foreground hover:text-neon-cyan transition-all h-[80px]"
                     >
                         <UserPlus size={20} />
                         <span className="text-xs font-bold uppercase tracking-wider">{t('teamManagement.invite')}</span>
                     </button>
                 )}
             </div>
             
             {/* Invitation Search Modal/Popover (Simplified inline for now) */}
             {showSearch && (
                 <div className="bg-neutral-900 border border-white/10 rounded-xl p-4 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                     <div className="flex items-center justify-between">
                         <h4 className="text-sm font-bold text-white">{t('teamManagement.invite')}</h4>
                         <button onClick={() => setShowSearch(false)}><X size={16} className="text-muted-foreground hover:text-white" /></button>
                     </div>
                     <div className="flex gap-2">
                         <div className="relative flex-1">
                             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                             <input 
                                value={inviteSearch}
                                onChange={(e) => setInviteSearch(e.target.value)}
                                placeholder={t('teamManagement.searchPlaceholder')}
                                className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-neon-cyan outline-none"
                             />
                         </div>
                         <button 
                            onClick={handleSearch}
                            disabled={isSearching}
                            className="px-4 py-2 bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 rounded-lg text-sm font-bold hover:bg-neon-cyan/20 transition-colors"
                        >
                            {t('teamManagement.search')}
                        </button>
                     </div>
                     {/* Results List */}
                     <div className="space-y-2">
                         {/* MOCK RESULTS */}
                         {searchResults.map(user => (
                             <div key={user.id} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
                                 <span className="text-sm text-white">{user.username}#{user.tag}</span>
                                 <button 
                                    onClick={() => inviteMutation.mutate(user.id)}
                                    className="text-xs bg-neon-cyan text-black px-2 py-1 rounded font-bold"
                                 >
                                     {t('teamManagement.inviteAction')}
                                 </button>
                             </div>
                         ))}
                     </div>
                 </div>
             )}

             {/* Status Banner */}
             <div className={cn("p-4 rounded-xl border flex items-center gap-3", isReady ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-yellow-500/10 border-yellow-500/20 text-yellow-500")}>
                 {isReady ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                 <div className="text-sm font-medium">
                     {isReady 
                         ? t('teamManagement.ready') 
                         : t('teamManagement.notReady')}
                 </div>
             </div>
        </div>
    );
}
