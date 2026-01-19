"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    id: 1,
    color: "from-blue-900 to-indigo-900", // Placeholder gradient 1
    image: null // Using CSS gradients for now as requested
  },
  {
    id: 2,
    color: "from-purple-900 to-fuchsia-900", // Placeholder gradient 2
    image: null
  },
  {
    id: 3,
    color: "from-emerald-900 to-teal-900", // Placeholder gradient 3
    image: null
  },
  {
    id: 4,
    color: "from-rose-900 to-red-900", // Placeholder gradient 4
    image: null
  }
];

export default function ContestHero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4000); // 4 seconds interval

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden bg-black">
      
      {/* Slides */}
      {SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out bg-gradient-to-br",
            slide.color,
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        >
            {/* Optional: Add slight pattern or Texture overlay here */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />
        </div>
      ))}

      {/* Text Overlay */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)] animate-fade-in-up">
          GAMERS 大会
        </h1>
        <p className="mt-4 text-lg md:text-xl text-cyan-50/80 font-medium tracking-wide max-w-2xl animate-fade-in-up delay-100">
          最強を目指せ。頂点へ登り詰めろ。栄光を掴み取れ。
        </p>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-8 flex gap-3 z-30">
            {SLIDES.map((_, i) => (
                <button 
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={cn(
                        "w-2 h-2 rounded-full transition-all duration-300 cursor-pointer",
                        i === currentSlide ? "w-8 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" : "bg-white/20 hover:bg-white/40"
                    )}
                />
            ))}
        </div>
      </div>

      {/* Bottom Fade for smooth transition to content */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-20 pointer-events-none" />
    </div>
  );
}
