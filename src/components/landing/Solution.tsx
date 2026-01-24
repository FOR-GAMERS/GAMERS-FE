"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Bot, CheckCircle2, LayoutDashboard, ArrowRightLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

gsap.registerPlugin(ScrollTrigger);

export default function Solution() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Desktop Animation ONLY
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
            scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=3000",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            },
        });

        // Background Transition (Matches total duration ~5s)
        tl.to(containerRef.current, {
            backgroundColor: "#000000",
            ease: "none",
            duration: 5,
        }, 0);

        // Phase 1 -> 2 (Start at 1.0s)
        // P1 Hold: 0s - 1.0s
        tl.to(".phase-1", { opacity: 0, y: -50, duration: 0.5 }, 1.0) 
            .fromTo(".phase-2", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.5 }, 1.5)
            .fromTo(".sync-line", { scaleX: 0 }, { scaleX: 1, duration: 0.5 }, "<")
            .to(".sync-icon", { rotation: 360, duration: 1, ease: "power1.inOut" }, "<");

        // Phase 2 -> 3 (Start at 3.0s)
        // P2 Hold: 1.5s - 3.0s
        tl.to(".phase-2", { opacity: 0, y: -50, duration: 0.5 }, 3.0)
            .fromTo(".phase-3", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5 }, 3.5)
            .fromTo(".celebration-particle", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.1, duration: 0.5 }, "<");
        
        // P3 Hold: 3.5s - 5.0s (implicit by total duration)
      });
      
      // Mobile Cleanup (optional, if needed to reset props)
      return () => {
         // GSAP handles cleanup automatically for matchMedia
      };

    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative z-10 w-full min-h-screen md:h-screen flex flex-col md:flex-row items-center justify-center overflow-hidden bg-[#0f172a] py-20 md:py-0"
    >
      <div className="container mx-auto px-4 h-full flex flex-col md:flex-row items-center justify-center relative">
        
        {/* === MOBILE LAYOUT (Stacked) === */}
        <div className="md:hidden flex flex-col gap-12 w-full">
            <h2 className="text-3xl font-bold text-center mb-8">
              <span className="text-primary">{t('landing.solution.mobileHeadline').split(' ')[0]}</span> {t('landing.solution.mobileHeadline').split(' ').slice(1).join(' ')}
            </h2>

            {/* Step 1 */}
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <LayoutDashboard size={24} />
                    </div>
                    <h3 className="text-xl font-bold">1. {t('landing.solution.steps.web.title')}</h3>
                </div>
                <p className="text-muted-foreground">{t('landing.solution.steps.web.description')}</p>
            </div>

            {/* Step 2 */}
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <ArrowRightLeft size={24} />
                    </div>
                    <h3 className="text-xl font-bold">2. {t('landing.solution.steps.bot.title')}</h3>
                </div>
                 <p className="text-muted-foreground">{t('landing.solution.steps.bot.description')}</p>
            </div>

            {/* Step 3 */}
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                        <CheckCircle2 size={24} />
                    </div>
                    <h3 className="text-xl font-bold">3. {t('landing.solution.steps.complete.title')}</h3>
                </div>
                 <p className="text-muted-foreground">{t('landing.solution.steps.complete.description')}</p>
            </div>
        </div>


        {/* === DESKTOP LAYOUT (Animated) === */}
        <div className="hidden md:flex w-full h-full flex-col items-center justify-center relative">
            <div className="relative w-full max-w-4xl aspect-video bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm overflow-hidden flex items-center justify-center shadow-2xl will-change-transform">
            
            {/* Phase 1: Web Visual */}
            <div className="phase-1 absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-blue-500/10 to-transparent will-change-transform">
                <LayoutDashboard className="w-24 h-24 text-blue-400 mb-6 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
                <div className="space-y-4 max-w-lg">
                    <div className="h-4 bg-white/20 rounded w-3/4 mx-auto animate-pulse" />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-20 bg-white/10 rounded border border-white/5" />
                        <div className="h-20 bg-white/10 rounded border border-white/5" />
                        <div className="h-20 bg-white/10 rounded border border-white/5" />
                        <div className="h-20 bg-white/10 rounded border border-white/5" />
                    </div>
                </div>
            </div>

            {/* Phase 2: Bot Sync */}
            <div className="phase-2 absolute inset-0 flex items-center justify-center opacity-0 will-change-transform">
                <div className="flex items-center gap-12 relative">
                    {/* Web Node */}
                    <div className="w-24 h-24 rounded-2xl bg-blue-500/20 border border-blue-500 flex items-center justify-center z-10">
                        <LayoutDashboard className="w-10 h-10 text-blue-400" />
                    </div>
                    
                    {/* Connecting Line */}
                    <div className="w-48 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 relative sync-line origin-left will-change-transform">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center sync-icon text-black shadow-[0_0_20px_rgba(255,255,255,0.8)] will-change-transform">
                            <ArrowRightLeft size={16} />
                        </div>
                    </div>

                    {/* Discord/Bot Node */}
                    <div className="w-24 h-24 rounded-2xl bg-indigo-500/20 border border-indigo-500 flex items-center justify-center z-10">
                        <Bot className="w-10 h-10 text-indigo-400" />
                    </div>
                </div>
            </div>

            {/* Phase 3: Result */}
            <div className="phase-3 absolute inset-0 flex flex-col items-center justify-center opacity-0 bg-gradient-to-t from-green-500/10 to-transparent will-change-transform">
                {/* Celebration Particles */}
                {[...Array(8)].map((_, i) => (
                    <div 
                        key={i} 
                        className="celebration-particle absolute w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)] will-change-transform"
                        style={{
                            top: `${50 + (Math.random() * 60 - 30)}%`,
                            left: `${50 + (Math.random() * 60 - 30)}%`,
                        }} 
                    />
                ))}
                
                <div className="relative z-10 p-10 bg-green-500/20 border border-green-500/50 rounded-full mb-6 shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                    <CheckCircle2 className="w-20 h-20 text-green-400" />
                </div>
                <h3 className="text-4xl font-black text-white tracking-widest uppercase drop-shadow-lg">{t('landing.solution.desktop.phase3')}</h3>
            </div>

            </div>

            {/* === TEXT OVERLAY (Dynamic) === */}
            <div className="mt-12 text-center h-24 relative w-full overflow-hidden">
                
                {/* Phase 1 Text */}
                <div className="phase-1 absolute inset-0 flex flex-col items-center justify-center will-change-transform">
                    <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                        {t('landing.solution.desktop.phase1')}
                    </h2>
                </div>

                {/* Phase 2 Text */}
                <div className="phase-2 absolute inset-0 flex flex-col items-center justify-center opacity-0 will-change-transform">
                    <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-300">
                        {t('landing.solution.desktop.phase2')}
                    </h2>
                </div>

                {/* Phase 3 Text */}
                <div className="phase-3 absolute inset-0 flex flex-col items-center justify-center opacity-0 will-change-transform">
                    <h2 className="text-3xl md:text-5xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                        {t('landing.solution.desktop.phase3')}
                    </h2>
                </div>

            </div>

             {/* Scroll Indicator */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-muted-foreground text-sm animate-bounce">
                {t('landing.solution.scroll')}
            </div>
        </div>

      </div>
    </section>
  );
}
