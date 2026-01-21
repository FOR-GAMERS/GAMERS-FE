'use client';

import { useRef } from 'react';
import { AwardItem } from '@/types/mypage';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Trophy, Users, Calendar } from 'lucide-react';

interface AwardsTabProps {
  awards: AwardItem[];
}

export default function AwardsTab({ awards }: AwardsTabProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Initial Stagger Entrance
    gsap.from('.award-card-wrapper', {
      y: 50,
      rotationX: -15,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power3.out',
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="space-y-6 perspective-[1200px]">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
         <span className="w-1 h-6 bg-neon-cyan rounded-full" />
         受賞コレクション
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {awards.map((award) => (
          <AwardCard key={award.id} award={award} />
        ))}
        {awards.length === 0 && (
            <div className="text-center py-20 text-white/30 text-sm col-span-full border border-dashed border-white/10 rounded-xl">
               まだ受賞歴がありません。大会に参加してトロフィーを集めましょう！
            </div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------

function AwardCard({ award }: { award: AwardItem }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const sheenRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    const { contextSafe } = useGSAP({ scope: cardRef });

    const handleMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
        // Disable tilt on mobile/tablet
        if (window.innerWidth < 1024) return;
        
        if (!cardRef.current || !contentRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg rotation
        const rotateY = ((x - centerX) / centerX) * 10;

        // 3D Tilt
        gsap.to(contentRef.current, {
            rotationX: rotateX,
            rotationY: rotateY,
            transformPerspective: 1000,
            duration: 0.4,
            ease: 'power2.out'
        });

        // Move Glow based on mouse
        gsap.to(glowRef.current, {
            x: x - rect.width/2,
            y: y - rect.height/2,
            opacity: 0.6,
            duration: 0.4,
            ease: 'power2.out'
        });
    });

    const handleMouseLeave = contextSafe(() => {
        // Reset Position
        gsap.to(contentRef.current, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.7,
            ease: 'elastic.out(1, 0.5)'
        });
        
        // Hide Glow
        gsap.to(glowRef.current, {
            opacity: 0,
            duration: 0.5
        });
    });

    const handleMouseEnter = contextSafe(() => {
        // Holographic Sheen Sweep
        if (sheenRef.current) {
            gsap.fromTo(sheenRef.current, 
                { x: '-150%', opacity: 0.5 },
                { x: '150%', opacity: 0, duration: 0.8, ease: 'power2.inOut' }
            );
        }
    });

    return (
        <div 
            ref={cardRef}
            className="award-card-wrapper h-[320px] relative group perspective-[1000px]"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
        >
            <div 
                ref={contentRef}
                className="w-full h-full relative preserve-3d transition-transform bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Dynamic Glow Background */}
                <div 
                    ref={glowRef}
                    className="absolute inset-0 w-[500px] h-[500px] bg-neon-purple/20 blur-[80px] rounded-full pointer-events-none opacity-0 mix-blend-screen"
                    style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
                />

                {/* Holographic Sheen Overlay */}
                <div 
                    ref={sheenRef}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] pointer-events-none opacity-0 z-30"
                />

                {/* Content Layer (Lifted in 3D) */}
                <div className="relative z-20 h-full flex flex-col items-center justify-center p-6 text-center" style={{ transform: 'translateZ(40px)' }}>
                    
                    {/* Badge/Trophy */}
                    <div className="relative mb-6 group-hover:scale-110 transition-transform duration-500">
                        <div className="absolute inset-0 bg-neon-purple/40 blur-xl rounded-full animate-pulse" />
                        <div className="w-24 h-24 bg-gradient-to-tr from-[#FFD700] via-[#FDB931] to-[#F3891D] rounded-full flex items-center justify-center shadow-[0_5px_15px_rgba(0,0,0,0.5)] border-2 border-[#FFFFE0]/50 relative z-10">
                             <Trophy size={48} className="text-[#FFF8DC] drop-shadow-md" />
                             
                             {/* Rank Badge */}
                             <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-deep-black border-2 border-neon-cyan rounded-full flex items-center justify-center shadow-[0_0_10px_#00f3ff]">
                                <span className="text-neon-cyan font-black text-lg italic">#{award.rank}</span>
                             </div>
                        </div>
                    </div>

                    {/* Text Info */}
                    <h3 className="text-2xl font-black text-white italic tracking-tight mb-1 drop-shadow-lg">
                        {award.title}
                    </h3>
                    
                    <p className="text-neon-cyan font-bold text-sm mb-6 tracking-wide uppercase opacity-90">
                        {award.contestName}
                    </p>

                    <div className="w-full border-t border-white/10 mb-4" />

                    <div className="space-y-2 w-full">
                        <div className="flex items-center justify-center gap-2 text-xs text-white/50">
                            <Calendar size={12} />
                            <span>{award.date}</span>
                        </div>
                        
                        <div className="flex flex-wrap justify-center gap-2 pt-2">
                             {award.teammates.map((mate, i) => (
                                <div key={i} className="px-2 py-1 bg-white/5 border border-white/5 rounded text-xs text-white/70 flex items-center gap-1">
                                    <Users size={10} /> {mate}
                                </div>
                             ))}
                        </div>
                    </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/30 rounded-tl pointer-events-none" />
                <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/30 rounded-tr pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/30 rounded-bl pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-white/30 rounded-br pointer-events-none" />

            </div>
        </div>
    );
}
