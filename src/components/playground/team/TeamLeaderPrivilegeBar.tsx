'use client';

import { motion } from 'framer-motion';
import { Settings, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function TeamLeaderPrivilegeBar() {
  const { t } = useTranslation();

  return (
    <div className="flex h-16 items-center justify-between rounded-xl border border-white/10 bg-white/5 px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#EEEEF0]">
          <Settings className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-[14px] font-black text-[#EEEEF0]">{t('playground.team.leader_privilege')}</span>
          <span className="text-[11px] text-[#5A5A65]">{t('playground.team.current_leader')}: Antigravity {t('playground.team.me')} · {t('playground.team.transfer_desc')}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 rounded-lg bg-black/40 p-1 pl-4">
          <span className="text-[12px] text-[#5A5A65]">{t('playground.team.select_member')}</span>
          <select className="bg-transparent text-[13px] font-bold text-[#EEEEF0] outline-none">
            <option>AcePlayer Reaper SilverBullet</option>
          </select>
          <button className="rounded-md bg-white/5 px-4 py-1.5 text-[12px] font-black text-[#EEEEF0] transition-all hover:bg-white/10">
            {t('playground.team.transfer_button')}
          </button>
        </div>
        <div className="flex items-center gap-2 px-2">
            <div className="h-2 w-2 rounded-full bg-neon-mint shadow-[0_0_8px_rgba(0,255,163,0.6)]" />
            <span className="text-[13px] font-bold text-[#EEEEF0]">Antigravity</span>
        </div>
      </div>
    </div>
  );
}
