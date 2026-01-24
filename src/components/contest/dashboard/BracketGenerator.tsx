"use client";

import { useState } from "react";
import { Shuffle, Users, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface Participant {
    id: number;
    username: string;
    avatar?: string;
}

interface BracketGeneratorProps {
    participants: Participant[];
}

export function BracketGenerator({ participants }: BracketGeneratorProps) {
  const [shuffled, setShuffled] = useState(false);
  const [matches, setMatches] = useState<Array<[Participant, Participant]>>([]);

  const handleShuffle = () => {
    // Basic shuffle logic for visualization
    const shuffledList = [...participants].sort(() => Math.random() - 0.5);
    const newMatches: Array<[Participant, Participant]> = [];
    
    for (let i = 0; i < shuffledList.length; i += 2) {
        if (i + 1 < shuffledList.length) {
            newMatches.push([shuffledList[i], shuffledList[i + 1]]);
        } else {
             // Bye (handle odd number) - For now just ignore or show 'Bye'
             // Simulating 'Bye' by pairing with self or null if typed
        }
    }
    setMatches(newMatches);
    setShuffled(true);
  };

  return (
    <div className="bg-neutral-900 border border-white/10 rounded-xl overflow-hidden flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
            <h3 className="font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-neon-cyan" /> Tournament Bracket Preview
            </h3>
            <button 
                onClick={handleShuffle}
                className="flex items-center gap-2 px-4 py-2 bg-neon-cyan/10 hover:bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50 rounded-lg transition-all text-sm font-bold active:scale-95"
            >
                <Shuffle className="w-4 h-4" /> SHUFFLE TEAMS
            </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
            {!shuffled ? (
                <div className="h-full flex flex-col items-center justify-center text-neutral-500 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center">
                        <Users className="w-8 h-8 opacity-50" />
                    </div>
                    <p>Ready to generate bracket for {participants.length} participants.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    <div className="text-center mb-4">
                        <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-mono text-neutral-400">ROUND 1</span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        {matches.map((match, idx) => (
                            <div key={idx} className="bg-black/50 border border-white/10 rounded-lg p-3 relative group hover:border-neon-cyan/50 transition-colors">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-neutral-900 rounded-full border border-white/10 flex items-center justify-center text-xs font-bold text-neutral-500 z-10">VS</div>
                                
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between p-2 bg-neutral-800/50 rounded">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-neutral-700" /> {/* Avatar Mock */}
                                            <span className="font-bold text-sm text-white">{match[0].username}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-2 bg-neutral-800/50 rounded">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-neutral-700" /> {/* Avatar Mock */}
                                            <span className="font-bold text-sm text-white">{match[1].username}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {participants.length % 2 !== 0 && (
                        <div className="text-center text-xs text-amber-500 mt-2">
                            * One participant has a BYE (not shown in simple mock)
                        </div>
                    )}
                </div>
            )}
        </div>
        
        {shuffled && (
            <div className="p-4 border-t border-white/10 bg-white/[0.02]">
                <button className="w-full py-3 bg-neon-cyan hover:bg-neon-cyan/80 text-black font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(0,243,255,0.2)]">
                    CONFIRM & CREATE MATCHES
                </button>
            </div>
        )}
    </div>
  );
}
