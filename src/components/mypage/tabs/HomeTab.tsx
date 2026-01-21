'use client';

import { useRef } from 'react';
import { ContestHistoryItem } from '@/types/mypage';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Trophy, Calendar, Target } from 'lucide-react';
import Image from 'next/image';

interface HomeTabProps {
  history: ContestHistoryItem[];
}

export default function HomeTab({ history }: HomeTabProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from('.history-card', {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power3.out',
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="space-y-6">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
         <span className="w-1 h-6 bg-neon-cyan rounded-full" />
         最近の参加履歴
      </h2>

      <div className="grid gap-4">
        {history.map((item) => (
          <div 
            key={item.id} 
            className="history-card bg-white/5 border border-white/5 hover:border-neon-cyan/50 rounded-xl p-4 md:p-5 transition-all duration-300 hover:bg-white/10 group cursor-pointer"
          >
            <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
              {/* Server Icon */}
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/10 shrink-0">
                 <Image src={item.serverIconUrl} alt="Server" fill className="object-cover" />
              </div>
              
              {/* Info */}
              <div className="flex-1 w-full md:w-auto">
                 <h3 className="text-lg font-bold text-white group-hover:text-neon-cyan transition-colors truncate">{item.title}</h3>
                 <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-1 text-sm text-white/50">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {item.date}</span>
                    <span className="flex items-center gap-1"><Target size={14} /> {item.serverName}</span>
                 </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-around w-full md:w-auto gap-4 md:gap-6 shrink-0 mt-4 md:mt-0 pt-4 md:pt-0 border-t border-white/5 md:border-t-0">
                 <div className="text-center">
                    <p className="text-[10px] md:text-xs text-white/40 uppercase font-bold">Tier</p>
                    <p className="text-neon-purple font-bold font-mono text-sm md:text-base">{item.tier}</p>
                 </div>
                 <div className="text-center">
                    <p className="text-[10px] md:text-xs text-white/40 uppercase font-bold">Score</p>
                    <p className="text-white font-bold font-mono text-sm md:text-base">{item.score}</p>
                 </div>
                 <div className="text-center">
                    <p className="text-[10px] md:text-xs text-white/40 uppercase font-bold">Rank</p>
                    <p className="text-neon-cyan font-black text-lg md:text-xl flex items-center justify-center gap-1">
                        {item.rank ? `#${item.rank}` : '-'}
                        {item.rank === 1 && <Trophy size={16} className="text-yellow-400" />}
                    </p>
                 </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
