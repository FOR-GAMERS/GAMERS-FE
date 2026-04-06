'use client';

import { Share2, Users, FileText, Layout, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface QuickLinkProps {
  label: string;
  icon: React.ReactNode;
  description: string;
}

function QuickLink({ label, icon, description }: QuickLinkProps) {
  return (
    <div className="flex items-center justify-between rounded-3xl border border-white/5 bg-[#141418] p-6 group hover:bg-[#1A1A22] hover:border-white/10 transition-all cursor-pointer">
      <div className="flex items-center gap-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-[#4A4A55] group-hover:text-neon-mint transition-colors border border-white/5 shadow-inner">
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-[17px] font-black italic text-[#EEEEF0] leading-none mb-1 group-hover:text-neon-mint transition-colors tracking-tighter">
            {label}
          </span>
          <span className="text-[11px] font-bold text-[#5A5A65] tracking-tight uppercase tracking-[0.1em]">
            {description}
          </span>
        </div>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-[#4A4A55] group-hover:text-neon-mint transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-1">
        <ChevronRight className="w-5 h-5" />
      </div>
    </div>
  );
}

export function PlaygroundQuickLinks() {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full">
      <QuickLink 
        label={t('playground.quick_links.bracket')}
        icon={<Layout className="w-6 h-6" />}
        description={t('playground.quick_links.bracket_desc')}
      />
      <QuickLink 
        label={t('playground.quick_links.team_mgmt')}
        icon={<Users className="w-6 h-6" />}
        description={t('playground.quick_links.team_mgmt_desc')}
      />
      <QuickLink 
        label={t('playground.quick_links.members')}
        icon={<Share2 className="w-6 h-6" />}
        description={t('playground.quick_links.members_desc')}
      />
      <QuickLink 
        label={t('playground.quick_links.notices')}
        icon={<FileText className="w-6 h-6" />}
        description={t('playground.quick_links.notices_desc')}
      />
    </div>
  );
}
