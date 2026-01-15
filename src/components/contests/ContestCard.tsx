import { ContestResponse } from "@/types/contest";
import { Timer, Users, Trophy, Calendar } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ContestCardProps {
  contest: ContestResponse;
}

export default function ContestCard({ contest }: ContestCardProps) {
  const isRecruiting = contest.contest_status === 'RECRUITING';
  
  return (
    <Link href={`/contests/${contest.contest_id}`} className="block group">
      <div className="relative bg-[#0f172a] rounded-2xl overflow-hidden border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:border-purple-500/50 will-change-transform">
        
        {/* Card Header (Placeholder Gradient) */}
        <div className="h-40 bg-gradient-to-br from-slate-800 to-slate-900 relative p-4 flex flex-col justify-between">
            <div className="flex justify-between items-start">
               <span className={cn(
                   "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                   isRecruiting ? "bg-green-500/20 text-green-400 border border-green-500/50" : "bg-white/10 text-muted-foreground"
               )}>
                   {contest.contest_status}
               </span>
               <span className="flex items-center gap-1 text-xs font-bold text-white bg-black/40 px-2 py-1 rounded-full backdrop-blur">
                   <Users size={12} /> {contest.max_team_count ? `${contest.max_team_count} Teams` : 'Unlimited'}
               </span>
            </div>
            
            <div className="flex justify-between items-end">
                <span className="text-xs font-mono text-white/70 bg-black/20 px-2 py-1 rounded">
                    {contest.contest_type}
                </span>
            </div>
        </div>

        {/* Card Body */}
        <div className="p-5">
           <h3 className="text-lg font-bold mb-2 text-white group-hover:text-purple-400 transition-colors line-clamp-1">
               {contest.title}
           </h3>
           <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
               {contest.description || "No description provided."}
           </p>
           
           <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-white/5 pt-4">
              <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  <span>{new Date(contest.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1.5 text-yellow-500 font-bold">
                  <Trophy size={14} />
                  <span>{contest.total_point} Pts</span>
              </div>
           </div>
        </div>

      </div>
    </Link>
  );
}
