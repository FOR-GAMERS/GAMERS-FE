'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, LayoutDashboard, User as UserIcon } from 'lucide-react';

export function PlaygroundNavbar() {
  const { t } = useTranslation();

  return (
    <nav className="h-14 border-b border-white/5 bg-[#0C0C0D] px-6">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between">
        {/* Left: Logo & Context */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-black italic tracking-tighter text-[#EEEEF0]">GAMERS</span>
            </Link>
            <div className="h-4 w-[1px] bg-white/10" />
            <span className="text-[13px] font-black text-[#5A5A65] uppercase tracking-wider">Playground</span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            <Link 
              href="/contests/1" 
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-bold text-[#7A7A85] hover:text-white hover:bg-white/5 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              {t('playground.nav.back_to_contest')}
            </Link>
          </div>
        </div>

        {/* Right: View Toggle & User */}
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center p-1 rounded-xl bg-white/5 border border-white/5">
            <button className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-[12px] font-black uppercase tracking-tight bg-white/10 text-white shadow-sm transition-all">
              <UserIcon className="w-3.5 h-3.5" />
              {t('playground.nav.player_view')}
            </button>
            <button className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-[12px] font-black uppercase tracking-tight text-[#5A5A65] hover:text-[#7A7A85] transition-all">
              <LayoutDashboard className="w-3.5 h-3.5" />
              {t('playground.nav.admin_view')}
            </button>
          </div>

          <div className="flex items-center gap-3 rounded-full bg-white/5 border border-white/5 pl-2 pr-4 py-1.5 hover:bg-white/10 transition-colors cursor-pointer group">
            <div className="h-6 w-6 rounded-full bg-neon-mint flex items-center justify-center text-[10px] font-black text-[#0C0C0D]">
              A
            </div>
            <span className="text-[13px] font-black text-[#EEEEF0] group-hover:text-neon-mint transition-colors tracking-tight">Antigravity</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
