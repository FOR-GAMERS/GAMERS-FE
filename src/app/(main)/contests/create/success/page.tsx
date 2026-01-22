"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Trophy, ArrowRight } from "lucide-react";

export default function ContestCreateSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#050505] text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-neon-cyan/10 rounded-full blur-[100px] opacity-40 animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-neon-purple/20 rounded-full blur-[100px] opacity-30 animate-pulse-slow delay-1000"></div>
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('/images/bg-grid.png')] opacity-10"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center p-8 max-w-lg w-full">
        <motion.div
           initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
           animate={{ opacity: 1, scale: 1, rotate: 0 }}
           transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
           className="mb-8"
        >
            <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border-2 border-neon-cyan/50 shadow-[0_0_50px_rgba(0,243,255,0.3)] backdrop-blur-md">
                <Trophy className="w-12 h-12 text-neon-cyan drop-shadow-[0_0_10px_rgba(0,243,255,0.8)]" />
            </div>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
        >
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-neon-cyan to-white">
                CONTEST CREATED
            </h1>
            <p className="text-gray-400 text-lg font-medium">
                대회가 성공적으로 생성되었습니다.<br/>
                참가자 모집이 시작됩니다!
            </p>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex flex-col md:flex-row gap-4 w-full"
        >
            <button 
                onClick={() => router.push("/contests")}
                className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95"
            >
                목록으로 돌아가기
            </button>
            <button 
                onClick={() => router.push("/contests")} // TODO: Ideally go to the detail page of the created contest we might need to store id in query param
                className="flex-1 py-4 bg-neon-cyan text-black font-bold rounded-xl transition-all hover:bg-cyan-300 hover:shadow-[0_0_20px_rgba(0,243,255,0.5)] hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
                대회 확인하기 <ArrowRight size={18} />
            </button>
        </motion.div>

        {/* Decorative elements */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16 pt-8 border-t border-white/10 w-full"
        >
            <div className="flex justify-between text-xs text-white/30 font-mono">
                <span>SYSTEM.STATUS.READY</span>
                <span>GAMERS PLATFORM</span>
            </div>
        </motion.div>
      </div>
    </div>
  );
}
