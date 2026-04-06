'use client';

import { User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Member {
  name: string;
  role: string;
  rank: string;
  isReady: boolean;
  isMe?: boolean;
}

export function PlaygroundTeamMembersMini() {
  const { t } = useTranslation();

  const members = t('playground.team_status.mock.members', { returnObjects: true }) as Member[];

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-white/5 bg-[#141418] p-8 h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-[17px] font-black italic tracking-tighter text-[#EEEEF0]">{t('playground.team_status.title')}</h3>
        <button className="text-[11px] font-black uppercase tracking-widest text-[#4A4A55] hover:text-[#7A7A85]">{t('playground.quick_links.team_mgmt')}</button>
      </div>

      <div className="flex flex-col gap-3">
        {Array.isArray(members) && members.map((member, i) => (
          <div key={i} className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/5 p-4 group hover:bg-white/10 transition-all">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neon-mint/10 border border-neon-mint/20 text-neon-mint group-hover:bg-neon-mint/20 transition-all">
                <User className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-black text-[#EEEEF0] leading-none">
                    {member.name}
                  </span>
                  {member.isMe && (
                    <span className="px-1.5 py-0.5 rounded-md bg-neon-mint/10 border border-neon-mint/20 text-[9px] font-black text-neon-mint tracking-wider uppercase">
                      {t('playground.team_status.you')}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-bold text-[#5A5A65] tracking-tight uppercase tracking-[0.1em]">
                   {member.role} · {member.rank}
                </span>
              </div>
            </div>
            {member.isReady && (
              <span className="text-[10px] font-black text-neon-mint uppercase tracking-wider bg-neon-mint/5 px-2 py-1 rounded-lg border border-neon-mint/20">
                {t('playground.team_status.ready')}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
