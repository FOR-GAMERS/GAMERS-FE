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
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Dynamic Background Glow */}
      <div 
        className="absolute inset-0 -z-10 pointer-events-none transition-opacity duration-500"
        style={{
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(124, 58, 237, 0.15), transparent 40%)`
        }}
      />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-background via-background to-black" />
      
      {/* Floating Particles (CSS Animation) */}
      <div className="absolute inset-0 -z-10 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-pulse" />
          <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-white rounded-full animate-ping" />
          <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-secondary rounded-full animate-bounce duration-[3000ms]" />
      </div>

      <div className="container px-4 mx-auto text-center z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-sm font-medium rounded-full bg-secondary/50 text-accent animate-pulse border border-accent/20">
           <Sparkles size={16} />
           <span>{t('landing.hero.badge')}</span>
        </div>
        
        <h1
          ref={titleRef}
          className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-8 leading-tight"
        >
          {headlineText.split("").map((char, index) => (
            <span key={index} className="char inline-block min-w-[0.2em]">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>

        <p
          ref={subtitleRef}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
        >
          {t('landing.hero.subtitle')}
        </p>

        <div ref={btnGroupRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="https://discord.com/oauth2/authorize?client_id=1430981444431511563" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:shadow-[0_0_40px_rgba(124,58,237,0.7)] group">
            {t('landing.hero.inviteBot')} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </a>
          
          <Link href="/contests" className="px-8 py-4 bg-secondary/20 hover:bg-secondary/40 text-white font-bold rounded-lg transition-all flex items-center gap-2 border border-white/10 backdrop-blur-sm">
            <Trophy size={20} />
            {t('landing.hero.findContest')}
          </Link>
        </div>
      </div>
    </section>
  );
}
