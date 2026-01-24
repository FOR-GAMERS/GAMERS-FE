import { RefreshCw, Trophy } from "lucide-react";

export function LiveMatchController() {
  const matches = [
    { id: 1, teamA: "T1", teamB: "GEN.G", scoreA: 1, scoreB: 0, status: "Live" },
    { id: 2, teamA: "DRX", teamB: "DK", scoreA: 0, scoreB: 0, status: "Live" },
    { id: 3, teamA: "HLE", teamB: "KT", scoreA: 2, scoreB: 1, status: "Finished" },
  ];

  return (
    <div className="bg-neutral-900 border border-white/10 rounded-xl overflow-hidden flex flex-col h-full">
         <div className="p-4 border-b border-white/10 flex items-center justify-between bg-neutral-900/50 backdrop-blur-sm">
            <h3 className="font-bold text-white flex items-center gap-2">
                Live Matches
            </h3>
            <button className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-white/5 transition-colors">
                <RefreshCw className="w-4 h-4" />
            </button>
         </div>

         <div className="flex-1 overflow-auto p-4 space-y-3">
            {matches.map(match => (
                <div key={match.id} className="bg-black/40 border border-white/5 rounded-lg p-3 hover:border-neon-cyan/30 transition-colors">
                     <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Match #{match.id}</span>
                        {match.status === "Live" ? (
                            <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded animate-pulse">LIVE</span>
                        ) : (
                            <span className="text-[10px] font-bold bg-neutral-700 text-neutral-400 px-1.5 py-0.5 rounded">FINISHED</span>
                        )}
                     </div>

                     <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 flex flex-col items-center">
                            <span className={`font-bold text-lg ${match.scoreA > match.scoreB ? 'text-neon-cyan' : 'text-white'}`}>{match.teamA}</span>
                        </div>
                        <div className="flex items-center gap-3 font-mono text-xl font-black">
                            <div className="bg-white/5 rounded px-2 py-0.5 min-w-[30px] text-center border border-white/10 focus-within:border-neon-cyan focus-within:ring-1 focus-within:ring-neon-cyan transition-all">
                                {match.scoreA}
                            </div>
                            <span className="text-neutral-600">:</span>
                            <div className="bg-white/5 rounded px-2 py-0.5 min-w-[30px] text-center border border-white/10 focus-within:border-neon-cyan focus-within:ring-1 focus-within:ring-neon-cyan transition-all">
                                {match.scoreB}
                            </div>
                        </div>
                         <div className="flex-1 flex flex-col items-center">
                            <span className={`font-bold text-lg ${match.scoreB > match.scoreA ? 'text-neon-cyan' : 'text-white'}`}>{match.teamB}</span>
                        </div>
                     </div>

                     <div className="mt-3 flex gap-2">
                        <button className="flex-1 bg-neon-cyan/5 hover:bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-xs font-bold py-1.5 rounded transition-colors">
                            Update
                        </button>
                        <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white px-2 rounded transition-colors" title="Force Win">
                            <Trophy className="w-3.5 h-3.5" />
                        </button>
                     </div>
                </div>
            ))}
         </div>
    </div>
  );
}
