'use client';

import { useRef } from 'react';
import { AwardItem } from '@/types/mypage';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Trophy, Star, Users } from 'lucide-react';

interface AwardsTabProps {
  awards: AwardItem[];
}

export default function AwardsTab({ awards }: AwardsTabProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from('.award-card', {
      scale: 0.9,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: 'back.out(1.7)',
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="space-y-6">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
         <span className="w-1 h-6 bg-neon-cyan rounded-full" />
         受賞コレクション
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {awards.map((award) => (
          <div 
            key={award.id} 
            className="award-card relative overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/5 rounded-2xl p-6 group hover:border-neon-purple/50 transition-all duration-500"
          >
             {/* Glow Effect */}
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-neon-purple/20 blur-[50px] group-hover:bg-neon-purple/40 transition-colors" />

             <div className="relative z-10 flex flex-col items-center text-center">
                 <div className="w-20 h-20 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(250,204,21,0.4)] mb-4 animate-pulse">
                    <Trophy size={40} className="text-white drop-shadow-md" />
                 </div>
                 
                 <h3 className="text-2xl font-black text-white italic tracking-tight mb-1">{award.title}</h3>
                 <p className="text-neon-cyan text-sm font-bold mb-4">{award.contestName}</p>
                 
                 <div className="w-full h-px bg-white/10 mb-4" />
                 
                 <div className="flex flex-wrap justify-center gap-2 text-xs text-white/50">
                    {award.teammates.map((mate, i) => (
                        <span key={i} className="px-2 py-1 bg-white/5 rounded flex items-center gap-1">
                            <Users size={10} /> {mate}
                        </span>
                    ))}
                 </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
