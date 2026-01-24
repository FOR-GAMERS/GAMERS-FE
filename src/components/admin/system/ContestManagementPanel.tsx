"use client";

import { Trophy, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export function ContestManagementPanel() {
  return (
    <Link 
        href="/admin/contests-manage"
        className="block bg-neutral-900/30 border border-white/5 hover:border-neon-cyan/50 hover:bg-neutral-900/50 rounded-xl p-6 h-full flex flex-col justify-between group transition-all relative overflow-hidden"
    >
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Trophy className="w-24 h-24" />
        </div>
        
        <div className="relative z-10">
            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-neon-cyan transition-colors flex items-center gap-2">
                <Trophy className="w-4 h-4" /> Contests
            </h3>
            <p className="text-sm text-neutral-400">Manage tournaments and brackets.</p>
        </div>

        <div className="relative z-10 mt-4">
             <div className="text-3xl font-black text-white font-mono">
                12<span className="text-sm text-neutral-500 font-normal ml-1">Active</span>
             </div>
             <div className="text-xs text-emerald-500 mt-1">3 Starting Soon</div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-sm font-bold text-neon-cyan opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all mt-auto pt-4">
            MANAGE CONTESTS <ArrowRight className="w-4 h-4" />
        </div>
    </Link>
  );
}
