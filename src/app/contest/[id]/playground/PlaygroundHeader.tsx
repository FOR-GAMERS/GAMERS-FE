'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Gamepad2 } from 'lucide-react';

gsap.registerPlugin(useGSAP);

export default function PlaygroundHeader({ contestId }: { contestId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Background Entrance (Scale Up + Brighten)
    gsap.fromTo(bgRef.current, 
      { scale: 1.1, filter: 'brightness(0)' }, 
      { scale: 1, filter: 'brightness(1)', duration: 1.5, ease: 'power2.out' }
    );

    // 2. Content Fade In (Staggered)
    const tl = gsap.timeline({ delay: 0.5 });
    tl.fromTo('.header-content-item',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.2, duration: 1, ease: 'back.out(1.7)' }
    );

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative h-[300px] w-full bg-neutral-900 border-b border-neon-cyan/20 overflow-hidden group">
      {/* Animated Background */}
      <div ref={bgRef} className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-deep-black to-neutral-900 opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neon-purple/20 via-transparent to-transparent opacity-50 blur-xl" />
      </div>
      
      {/* Content */}
      <div ref={contentRef} className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <div className="header-content-item mb-4 text-neon-cyan p-3 bg-neon-cyan/10 rounded-full border border-neon-cyan/50 shadow-[0_0_15px_rgba(0,243,255,0.3)]">
          <Gamepad2 size={48} />
        </div>
        <h1 className="header-content-item text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-[0_0_15px_rgba(0,243,255,0.4)] tracking-tight">
          CONTEST <span className="text-neon-cyan">#{contestId}</span>
        </h1>
        <p className="header-content-item text-neutral-400 text-sm md:text-base uppercase tracking-widest border border-neon-purple/50 px-4 py-1 rounded-full bg-deep-black/50 backdrop-blur-sm">
          Playground Area
        </p>
      </div>
    </section>
  );
}
