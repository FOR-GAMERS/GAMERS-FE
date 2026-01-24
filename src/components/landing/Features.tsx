"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Zap, ShieldCheck, MonitorPlay, Crosshair } from "lucide-react";
import { cn } from "@/lib/utils";

import { useTranslation } from "react-i18next";

const features = [
  {
    titleKey: "landing.features.zeroLatency.title",
    descriptionKey: "landing.features.zeroLatency.description",
    icon: Zap,
    className: "md:col-span-2",
  },
  {
    titleKey: "landing.features.antiCheat.title",
    descriptionKey: "landing.features.antiCheat.description",
    icon: ShieldCheck,
    className: "md:col-span-1",
  },
  {
    titleKey: "landing.features.crossPlatform.title",
    descriptionKey: "landing.features.crossPlatform.description",
    icon: MonitorPlay,
    className: "md:col-span-1",
  },
  {
    titleKey: "landing.features.instantReplay.title",
    descriptionKey: "landing.features.instantReplay.description",
    icon: Crosshair,
    className: "md:col-span-2",
  },
];

export default function Features() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="py-24 container mx-auto px-4">
      <div className="text-center mb-20">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          {t('landing.features.headline')}
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {t('landing.features.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {features.map((feature, i) => (
          <div
            key={i}
            className={cn(
              "feature-card group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 transition-colors hover:bg-white/10",
              feature.className
            )}
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary transition-transform group-hover:scale-110">
              <feature.icon size={24} />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-foreground">
              {t(feature.titleKey)}
            </h3>
            <p className="text-muted-foreground">{t(feature.descriptionKey)}</p>
            
            {/* Hover Gradient */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        ))}
      </div>
    </section>
  );
}
