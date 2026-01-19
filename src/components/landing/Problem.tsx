"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { AlertTriangle, Clock, EyeOff } from "lucide-react";

const problems = [
  {
    icon: AlertTriangle,
    title: "数十人のメンバー管理、難しくないですか？",
    description: "手動での管理は限界があります。自動化でストレスフリーに。",
  },
  {
    icon: Clock,
    title: "毎回振替される設定ミスや試合遅延",
    description: "設定ミスで試合が台無し...そんな経験はもう終わりです。",
  },
  {
    icon: EyeOff,
    title: "誰が参加してるのか一瞬で分かりづらい！",
    description: "可視化されたロビーで、参加状況をリアルタイムに把握。",
  },
];

export default function Problem() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      tl.from(headerRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      }).from(
        (cardsRef.current?.children as unknown as Element[]) || [],
        {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
        },
        "-=0.4"
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="py-24 bg-muted/30 relative overflow-hidden"
    >
      <div className="container px-4 mx-auto">
        <div ref={headerRef} className="container mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
             <span className="text-destructive">ゲーミング</span>をもっと快適に
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            快適なゲーミング環境を取り戻しましょう。
          </p>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {problems.map((problem, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl bg-secondary/50 border border-secondary hover:border-destructive/50 transition-colors group"
            >
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <problem.icon className="w-7 h-7 text-destructive" />
              </div>
              <h3 className="text-xl font-bold mb-3">{problem.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
