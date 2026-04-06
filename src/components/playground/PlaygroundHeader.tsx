'use client';

import { Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PlaygroundHeaderProps {
  title: string;
  game: string;
  host: string;
  timeLeft: string;
}

export function PlaygroundHeader({ title, game, host, timeLeft }: PlaygroundHeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="flex h-[100px] shrink-0 items-center justify-between border-b border-white/[0.05] bg-[#0C0C0D] px-10">
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-6">
          <div className="flex h-14 w-15 items-center justify-center rounded-2xl bg-neon-mint text-[#0C0C0D] shadow-[0_0_30px_rgba(110,231,183,0.3)] border border-white/20">
            <Trophy className="w-7 h-7" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-[20px] font-black italic tracking-tighter text-[#EEEEF0] leading-tight">
              {title}
            </h2>
            <p className="text-[11px] font-bold text-[#5A5A65] tracking-tight uppercase tracking-[0.1em]">
              {t('playground.header.hosted_by')} {host}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
