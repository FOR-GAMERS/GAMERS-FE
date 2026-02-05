"use client";

import { Image as ImageIcon, Users, Trophy, GitMerge, Gamepad2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Koulen } from "next/font/google";
import { useTranslation } from "react-i18next";

const koulen = Koulen({
  weight: "400",
  subsets: ["latin"],
});

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  
  const adminSections = [
    {
      title: t('admin.dashboard.cards.banner.title'),
      description: t('admin.dashboard.cards.banner.description'),
      icon: <ImageIcon className="w-8 h-8 text-neon-cyan" />,
      href: "/admin/banners",
      color: "border-neon-cyan/20 group-hover:border-neon-cyan/50",
      bgHover: "group-hover:bg-neon-cyan/5"
    },
    {
      title: t('admin.dashboard.cards.user.title'),
      description: t('admin.dashboard.cards.user.description'),
      icon: <Users className="w-8 h-8 text-neon-purple" />,
      href: "/admin/users",
      color: "border-neon-purple/20 group-hover:border-neon-purple/50",
      bgHover: "group-hover:bg-neon-purple/5"
    },
    {
      title: t('admin.dashboard.cards.contest.title'),
      description: t('admin.dashboard.cards.contest.description'),
      icon: <Trophy className="w-8 h-8 text-emerald-500" />,
      href: "/admin/contests-manage",
      color: "border-emerald-500/20 group-hover:border-emerald-500/50",
      bgHover: "group-hover:bg-emerald-500/5"
    },
    {
      title: t('admin.dashboard.cards.result.title'),
      description: t('admin.dashboard.cards.result.description'),
      icon: <GitMerge className="w-8 h-8 text-amber-500" />,
      href: "/admin/results",
      color: "border-amber-500/20 group-hover:border-amber-500/50",
      bgHover: "group-hover:bg-amber-500/5"
    },
    {
      title: t('admin.dashboard.cards.game.title'),
      description: t('admin.dashboard.cards.game.description'),
      icon: <Gamepad2 className="w-8 h-8 text-rose-500" />,
      href: "/admin/games",
      color: "border-rose-500/20 group-hover:border-rose-500/50",
      bgHover: "group-hover:bg-rose-500/5"
    }
  ];

  return (
    <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col mb-12">
            <h1 className={`text-4xl md:text-5xl font-bold text-white mb-4 ${koulen.className} tracking-wide`}>
                {t('admin.dashboard.title')}
            </h1>
            <p className="text-neutral-400 max-w-2xl">
                {t('admin.dashboard.subtitle')}
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminSections.map((section, idx) => (
                <Link 
                    key={idx} 
                    href={section.href}
                    className={`group relative bg-neutral-900/50 border ${section.color} rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
                >
                    <div className={`absolute inset-0 transition-opacity duration-300 opacity-0 ${section.bgHover}`} />
                    
                    <div className="relative z-10">
                        <div className="mb-6 p-3 bg-white/5 rounded-xl w-fit border border-white/5 group-hover:scale-110 transition-transform duration-300">
                            {section.icon}
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                            {section.title}
                        </h3>
                        
                        <p className="text-sm text-neutral-400 mb-8 leading-relaxed">
                            {section.description}
                        </p>
                        
                        <div className="flex items-center gap-2 text-sm font-bold text-neutral-300 group-hover:text-white transition-colors">
                            {t('admin.dashboard.enterModule')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    </div>
  );
}
