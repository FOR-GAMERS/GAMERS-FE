"use client";

import { useState, useEffect } from "react";
import { Users, Trophy, CalendarClock, Loader2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { contestService } from "@/services/contest-service";
import { GameResponse } from "@/types/api";
import { useToast } from "@/context/ToastContext";

interface Participant {
    id: number;
    username: string;
    avatar?: string;
}

interface GameMember {
    user_id: number;
    username: string;
    avatar?: string;
    team_id: number;
    // Add other fields from getGameMembers if needed
}

interface BracketGeneratorProps {
    contestId: number;
}

export function BracketGenerator({ contestId }: BracketGeneratorProps) {
  const { addToast } = useToast();
  const [games, setGames] = useState<(GameResponse & { members?: GameMember[] })[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGames = async () => {
    try {
        setLoading(true);
        const res = await contestService.getContestGames(contestId);
        const sortedGames = res.data.sort((a, b) => a.game_id - b.game_id);
        
        // Fetch members for each game (avoiding waterfall if possible, but limited connection limit might apply)
        // For better performance, we'd want a bulk endpoint.
        const gamesWithMembers = await Promise.all(sortedGames.map(async (game) => {
            try {
                const membersRes = await contestService.getGameMembers(game.game_id);
                return { ...game, members: membersRes.data };
            } catch (e) {
                return { ...game, members: [] };
            }
        }));
        setGames(gamesWithMembers);

    } catch (error) {
        console.error("Failed to fetch games", error);
        addToast("Failed to load tournament bracket", "error");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    if (contestId) {
        fetchGames();
    }
  }, [contestId]);

  return (
    <div className="bg-neutral-900 border border-white/10 rounded-xl overflow-hidden flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
            <h3 className="font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-neon-cyan" /> Tournament Bracket
            </h3>
            <button 
                onClick={fetchGames}
                className="flex items-center gap-2 px-4 py-2 bg-neon-cyan/5 hover:bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 rounded-lg transition-all text-sm font-bold active:scale-95"
            >
                REFRESH
            </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
            {loading ? (
                <div className="h-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-neon-cyan animate-spin" />
                </div>
            ) : games.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-neutral-500 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center">
                        <Users className="w-8 h-8 opacity-50" />
                    </div>
                    <p>No matches generated yet.</p>
                    <p className="text-xs text-neutral-600">Matches will appear here once the contest is started.</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {games.map((game) => (
                        <MatchCard key={game.game_id} game={game} />
                    ))}
                </div>
            )}
        </div>
    </div>
  );
}

function MatchCard({ game }: { game: GameResponse & { members?: GameMember[] } }) {
    // Group members by team_id
    const teams = game.members?.reduce((acc: Record<string, GameMember[]>, member) => {
        const teamId = member.team_id ? String(member.team_id) : 'no-team';
        if (!acc[teamId]) acc[teamId] = [];
        acc[teamId].push(member);
        return acc;
    }, {}) || {};

    const teamKeys = Object.keys(teams);
    const team1 = teamKeys[0] ? teams[teamKeys[0]] : [];
    const team2 = teamKeys[1] ? teams[teamKeys[1]] : [];

    return (
        <div className="bg-black/50 border border-white/10 rounded-lg p-4 relative group hover:border-neon-cyan/50 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-mono text-neutral-500">MATCH #{game.game_id}</span>
                <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                    game.game_status === 'ACTIVE' ? "bg-green-500/20 text-green-500" :
                    game.game_status === 'FINISHED' ? "bg-neutral-700 text-neutral-400" :
                    "bg-blue-500/20 text-blue-500"
                )}>
                    {game.game_status}
                </span>
            </div>
            
            <div className="space-y-3">
                {/* Team 1 */}
                <div className="flex items-center justify-between p-2 bg-neutral-800/50 rounded border-l-2 border-transparent hover:border-neon-cyan/50 transition-colors">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-neutral-700 overflow-hidden relative">
                             {team1[0]?.avatar && <Image src={team1[0].avatar} alt={team1[0].username} fill sizes="24px" className="object-cover" />}
                        </div>
                        <span className="font-bold text-sm text-white">
                            {team1.length > 0 ? (team1.length > 1 ? `Team ${team1[0].team_id}` : team1[0].username) : 'TBD'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-center">
                    <span className="text-xs font-bold text-neutral-600">VS</span>
                </div>

                {/* Team 2 */}
                <div className="flex items-center justify-between p-2 bg-neutral-800/50 rounded border-l-2 border-transparent hover:border-red-500/50 transition-colors">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-neutral-700 overflow-hidden relative">
                             {team2[0]?.avatar && <Image src={team2[0].avatar} alt={team2[0].username} fill sizes="24px" className="object-cover" />}
                        </div>
                        <span className="font-bold text-sm text-white">
                            {team2.length > 0 ? (team2.length > 1 ? `Team ${team2[0].team_id}` : team2[0].username) : 'TBD'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                <div className="text-xs text-neutral-500 flex items-center gap-1">
                     <CalendarClock className="w-3 h-3" />
                     {game.started_at ? new Date(game.started_at).toLocaleDateString() : 'TBD'}
                </div>
            </div>
        </div>
    );
}
