'use client';

import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface SidebarProps {
  activeSection: string;
  onSectionClick: (id: string) => void;
  progress: number;
}

export function ContestCreateSidebar({ activeSection, onSectionClick, progress }: SidebarProps) {
  const { t } = useTranslation();

  const sections = [
    { id: 'basic_info', label: t('contests.create.sections.basic_info'), number: 1 },
    { id: 'image_settings', label: t('contests.create.sections.image_settings'), number: 2 },
    { id: 'game_settings', label: t('contests.create.sections.game_settings'), number: 3 },
    { id: 'team_composition', label: t('contests.create.sections.team_composition'), number: 4 },
    { id: 'schedule_settings', label: t('contests.create.sections.schedule_settings'), number: 5 },
    { id: 'discord_integration', label: t('contests.create.sections.discord_integration'), number: 6 },
  ];

  return (
    <div className="sticky top-32 flex flex-col gap-8 w-64 shrink-0">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-[#7A7A85] uppercase tracking-wider">섹션</span>
        <div className="flex flex-col gap-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionClick(section.id)}
              className={cn(
                "group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 text-left",
                activeSection === section.id 
                  ? "bg-[#141418] border border-white/5 shadow-lg shadow-black/20" 
                  : "hover:bg-white/5 border border-transparent"
              )}
            >
              <span className={cn(
                "flex items-center justify-center w-6 h-6 rounded-md text-[10px] font-black transition-all",
                activeSection === section.id 
                  ? "bg-neon-mint text-deep-black shadow-[0_0_10px_rgba(110,231,183,0.3)]" 
                  : "bg-[#1C1C21] text-[#7A7A85] group-hover:bg-[#242428]"
              )}>
                {section.number}
              </span>
              <span className={cn(
                "text-sm font-bold transition-colors",
                activeSection === section.id ? "text-[#EEEEF0]" : "text-[#7A7A85] group-hover:text-[#BBBBCB]"
              )}>
                {section.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Progress Section */}
      <div className="flex flex-col gap-4 p-5 rounded-2xl bg-[#141418] border border-white/5 mt-4">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-bold text-[#7A7A85]">진행률</span>
          <span className="text-[13px] font-black text-neon-mint">{progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-[#1C1C21] rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-neon-mint shadow-[0_0_10px_rgba(110,231,183,0.5)]" 
          />
        </div>
        <p className="text-[11px] font-medium text-[#7A7A85] leading-relaxed">
          {Math.floor(progress / 16.6).toString()} / 6 섹션 완료
        </p>
      </div>
    </div>
  );
}
