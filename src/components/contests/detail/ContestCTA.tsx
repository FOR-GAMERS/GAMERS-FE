"use client";

import { Users, Coins, Trophy, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContestCTAProps {
  currentParticipants: number;
  maxParticipants: number;
  entryFee: number;
  prizePool: string;
  deadline: string;
  onJoin: () => void;
  isLoggedIn: boolean;
  buttonLabel?: string;
  variant?: 'primary' | 'destructive' | 'secondary';
  isLoading?: boolean;
}

export default function ContestCTA({
  currentParticipants,
  maxParticipants,
  entryFee,
  prizePool,
  deadline,
  onJoin,
  isLoggedIn,
  buttonLabel = "참가 신청하기",
  variant = 'primary',
  isLoading = false
}: ContestCTAProps) {
  const isFull = currentParticipants >= maxParticipants;
  const progressPercent = Math.min((currentParticipants / maxParticipants) * 100, 100);

  return (
    <div className="sticky top-24 w-full bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6 animate-fade-in-up">
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Trophy className="text-neon-cyan" size={20} />
            참가 신청
        </h3>
        
        {/* Progress Bar */}
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>모집 현황</span>
            <span>{currentParticipants} / {maxParticipants} 팀</span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
                className={cn("h-full transition-all duration-500", isFull ? "bg-red-500" : "bg-neon-cyan")} 
                style={{ width: `${progressPercent}%` }} 
            />
        </div>
      </div>

      <div className="space-y-4 py-4 border-t border-white/10 border-b border-white/10">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Coins size={16} /> 참가비
            </div>
            <div className="font-bold text-lg text-white font-mono">
                {entryFee === 0 ? "무료" : `${entryFee.toLocaleString()} VP`}
            </div>
        </div>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Trophy size={16} /> 총 상금
            </div>
            <div className="font-bold text-lg text-neon-purple font-mono">
                {prizePool}
            </div>
        </div>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Clock size={16} /> 신청 마감
            </div>
            <div className="font-bold text-sm text-white">
                {deadline}
            </div>
        </div>
      </div>

      <button
        onClick={onJoin}
        disabled={(isFull && variant === 'primary') || isLoading}
        className={cn(
            "w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 group relative overflow-hidden",
            (isFull && variant === 'primary') || isLoading
                ? "bg-white/10 text-muted-foreground cursor-not-allowed" 
                : variant === 'destructive'
                    ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/30"
                    : variant === 'secondary'
                        ? "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                        : "bg-neon-cyan text-black hover:bg-[#00f3ff] hover:shadow-[0_0_30px_rgba(0,243,255,0.6)] hover:scale-[1.02]"
        )}
      >
        <span className="relative z-10 flex items-center gap-2">
            {isLoading ? (
                "処理中..."
            ) : (isFull && variant === 'primary') ? (
                "募集終了"
            ) : (
                <>
                    {buttonLabel} {variant === 'primary' && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                </>
            )}
        </span>
        {(!isFull || variant !== 'primary') && !isLoading && variant === 'primary' && (
            <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
        )}
      </button>

      {!isLoggedIn && (
        <p className="text-xs text-center text-muted-foreground">
            참가하려면 <span className="text-white underline cursor-pointer">로그인</span>이 필요합니다.
        </p>
      )}
    </div>
  );
}
