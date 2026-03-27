"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight, Gamepad2, Sparkles, Trophy } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function Hero() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const btnGroupRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Stagger animation for title characters
    const chars = titleRef.current?.querySelectorAll(".char");
    if (chars && chars.length > 0) {
        tl.from(chars, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.03,
            ease: "back.out(1.7)",
        });
    }

    tl.from(
        subtitleRef.current,
        {
          y: 30,
          opacity: 0,
          duration: 1,
        },
        "-=0.5"
      )
      .from(
        btnGroupRef.current,
        {
          y: 20,
          opacity: 0,
          duration: 1,
        },
        "-=0.8"
      );
  }, { scope: containerRef });

  const headlineText = t('landing.hero.headline');

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-deep-black"
    >
      {/* Dynamic Background Glow - Enhanced with dual colors */}
      <div 
        className="absolute inset-0 -z-10 pointer-events-none transition-opacity duration-1000"
        style={{
            background: `
              radial-gradient(1000px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 243, 255, 0.07), transparent 40%),
              radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(139, 92, 246, 0.1), transparent 40%)
            `
        }}
      />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-deep-black via-deep-black to-black" />
      
      {/* Floating Particles (Enhanced with glow) */}
      <div className="absolute inset-0 -z-10 opacity-40">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-neon-cyan rounded-full animate-pulse shadow-[0_0_15px_#00f3ff]" />
          <div className="absolute top-[60%] right-[15%] w-1.5 h-1.5 bg-white rounded-full animate-ping" />
          <div className="absolute top-1/2 left-[10%] w-3 h-3 bg-neon-purple rounded-full animate-float shadow-[0_0_20px_#b23aff]" />
          <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-primary rounded-full animate-pulse opacity-50" />
          <div className="absolute top-20 right-20 w-1 h-1 bg-neon-cyan rounded-full animate-pulse shadow-[0_0_8px_#00f3ff]" />
      </div>

      <div 
        className="container px-4 mx-auto text-center z-10 transition-transform duration-200 ease-out"
        style={{
          transform: `perspective(1000px) rotateX(${(mousePos.y - (containerRef.current?.offsetHeight || 0) / 2) / 50}deg) rotateY(${(mousePos.x - (containerRef.current?.offsetWidth || 0) / 2) / -50}deg)`
        }}
      >
        <div className="inline-flex items-center gap-2 px-5 py-2 mb-10 text-[10px] font-black uppercase tracking-[0.3em] rounded-full glass-morphism text-neon-cyan animate-pulse border border-neon-cyan/30 shadow-[0_0_20px_rgba(0,243,255,0.2)]">
           <Sparkles size={14} className="animate-spin-slow" />
           <span>{t('landing.hero.badge')}</span>
        </div>
        
        <h1
          ref={titleRef}
          className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-10 leading-[0.85] text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.15)] uppercase italic"
        >
          {headlineText.split("").map((char, index) => (
            <span key={index} className="char inline-block min-w-[0.2em]">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>

        <p
          ref={subtitleRef}
          className="text-lg md:text-2xl text-white/40 max-w-3xl mx-auto mb-16 leading-relaxed font-bold tracking-tight uppercase"
        >
          {t('landing.hero.subtitle')}
        </p>

        <div ref={btnGroupRef} className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <a 
            href="https://discord.com/oauth2/authorize?client_id=1430981444431511563" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group relative px-12 py-5 bg-primary text-white font-black rounded-2xl transition-all flex items-center gap-4 overflow-hidden shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:shadow-[0_0_60px_rgba(139,92,246,0.5)] hover:scale-110 active:scale-95 border-b-4 border-purple-900/50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <Gamepad2 size={28} />
            <span className="relative uppercase tracking-widest text-sm">{t('landing.hero.inviteBot')}</span>
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </a>
          
          <Link 
            href="/contests" 
            className="px-12 py-5 glass-card bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl transition-all flex items-center gap-4 border border-white/10 hover:border-white/40 hover:scale-110 active:scale-95 group shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
          >
            <Trophy size={28} className="text-neon-cyan group-hover:rotate-12 transition-transform drop-shadow-[0_0_10px_#00f3ff]" />
            <span className="uppercase tracking-widest text-sm">{t('landing.hero.findContest')}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
