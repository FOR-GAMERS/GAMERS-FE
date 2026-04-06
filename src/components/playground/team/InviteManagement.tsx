'use client';

import { motion } from 'framer-motion';
import { Share2, Link as LinkIcon, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const PENDING_INVITES = [
  { name: 'NightFox', rankType: 'diamond', level: 2, initials: 'NX', color: 'bg-indigo-500' },
  { name: 'Blaze', rankType: 'platinum', level: 2, initials: 'BZ', color: 'bg-orange-500' },
];

export function InviteManagement() {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const inviteLink = "gamers.gg/inv/A3xK9p";

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-white/5 bg-[#0C0C0D] p-6 shadow-2xl">
      <div className="flex items-center justify-between">
        <h3 className="text-[14px] font-black text-[#EEEEF0]">{t('playground.team.invite_management')}</h3>
        <button className="flex items-center gap-1.5 rounded-md bg-neon-mint px-3 py-1.5 text-[11px] font-black text-black transition-all hover:brightness-110 active:scale-95">
          <LinkIcon className="h-3.5 w-3.5" />
          <span>{t('playground.team.create_link')}</span>
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-xl bg-black/40 p-4 border border-white/5">
        <div className="flex items-center justify-between gap-2 rounded-lg bg-white/5 p-2 px-3">
          <span className="text-[12px] font-bold text-[#5A5A65] truncate">{inviteLink}</span>
          <button 
            onClick={handleCopy}
            className="rounded bg-white/10 px-3 py-1 text-[11px] font-black text-[#EEEEF0] transition-all hover:bg-white/20 active:scale-95"
          >
            {copied ? t('playground.team.copied') : t('playground.team.copy')}
          </button>
        </div>
        <p className="text-[11px] text-[#5A5A65] text-center">{t('playground.team.pending_count', { count: 2 })}</p>
      </div>

      <div className="flex flex-col gap-3">
        {PENDING_INVITES.map((invite, idx) => (
          <div key={invite.name} className="flex items-center justify-between rounded-xl bg-white/5 p-3 px-4 border border-white/5 transition-all hover:bg-white/10">
            <div className="flex items-center gap-3">
               <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg text-[11px] font-black text-[#EEEEF0]", invite.color)}>
                 {invite.initials}
               </div>
               <div className="flex flex-col">
                 <span className="text-[13px] font-black text-[#EEEEF0] leading-none">{invite.name}</span>
                 <span className="text-[10px] font-bold text-[#5A5A65] mt-1">
                   {t(`playground.ranks.${invite.rankType}`, { level: invite.level })}
                 </span>
               </div>
            </div>
            <div className="flex items-center gap-2">
               <button className="flex h-7 w-12 items-center justify-center rounded-md border border-neon-mint/30 text-neon-mint bg-neon-mint/5 hover:bg-neon-mint/10 transition-all text-[11px] font-black">
                 {t('playground.team.accept')}
               </button>
               <button className="flex h-7 w-12 items-center justify-center rounded-md border border-ruby/30 text-ruby bg-ruby/5 hover:bg-ruby/10 transition-all text-[11px] font-black">
                 {t('playground.team.reject')}
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
