import { Play, Pause, Square, Radio, Users, Activity, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export function GlobalControlBar() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        
        {/* Status Control */}
        <div className="bg-neutral-900 border border-white/10 rounded-xl p-4 flex items-center justify-between">
            <div className="flex flex-col gap-1">
                <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Contest Status</span>
                <span className="text-xl font-black text-white">LIVE <span className="text-neon-cyan animate-pulse">●</span></span>
            </div>
            
            <div className="flex bg-black/40 rounded-lg p-1 border border-white/5">
                <button className="p-2 rounded bg-neon-cyan/20 text-neon-cyan" title="Resume"><Play className="w-4 h-4 fill-current" /></button>
                <button className="p-2 rounded hover:bg-white/5 text-neutral-400 hover:text-white" title="Pause"><Pause className="w-4 h-4 fill-current" /></button>
                <button className="p-2 rounded hover:bg-white/5 text-neutral-400 hover:text-white" title="Stop"><Square className="w-4 h-4 fill-current" /></button>
            </div>
        </div>

        {/* Metrics */}
        <div className="bg-neutral-900 border border-white/10 rounded-xl p-4 flex items-center justify-around gap-4">
             <div className="text-center">
                <div className="text-xs text-neutral-500 font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1"><Users className="w-3 h-3"/> Players</div>
                <div className="text-2xl font-black text-white">128<span className="text-neutral-500 text-lg">/128</span></div>
             </div>
             <div className="w-px h-full bg-white/10" />
             <div className="text-center">
                <div className="text-xs text-neutral-500 font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1"><Activity className="w-3 h-3"/> Progress</div>
                <div className="text-2xl font-black text-white">45%</div>
             </div>
             <div className="w-px h-full bg-white/10" />
             <div className="text-center">
                <div className="text-xs text-neutral-500 font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1"><AlertTriangle className="w-3 h-3"/> Issues</div>
                <div className="text-2xl font-black text-yellow-500">2</div>
             </div>
        </div>

        {/* Actions */}
        <div className="bg-neutral-900 border border-white/10 rounded-xl p-4 flex items-center gap-3">
             <button className="flex-1 h-full bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/20 text-neon-cyan rounded-lg flex flex-col items-center justify-center gap-1 transition-all group">
                <Radio className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold uppercase">Broadcast</span>
             </button>
             <button className="flex-1 h-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 rounded-lg flex flex-col items-center justify-center gap-1 transition-all group">
                <AlertTriangle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold uppercase">Emergency Stop</span>
             </button>
        </div>

    </div>
  );
}
